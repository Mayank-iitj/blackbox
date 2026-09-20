from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid
import asyncio
import json
import httpx
import traceback

from . import models, database
from engine.inference.state_matcher import StateMatcher
from engine.mutations.generator import MutationGenerator

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Black Box API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the Next.js host
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_websockets: List[WebSocket] = []

@app.get("/")
def read_root():
    return {"message": "Black Box API Running"}

@app.post("/api/targets")
def create_target(payload: dict, db: Session = Depends(database.get_db)):
    target_id = str(uuid.uuid4())
    name = payload.get("name", "Unnamed Target")
    base_url = payload.get("base_url", "http://localhost")
    db_target = models.Target(id=target_id, name=name, base_url=base_url, type=payload.get("type", "api"), status="active")
    db.add(db_target)
    db.commit()
    db.refresh(db_target)
    return db_target

@app.get("/api/targets")
def get_targets(db: Session = Depends(database.get_db)):
    return db.query(models.Target).all()

from engine.adapters.http_client import BlackBoxHTTPClient
from engine.inference.delta_debugger import DeltaDebugger

async def execute_discovery_run(run_id: str):
    matcher = StateMatcher()
    client = BlackBoxHTTPClient("http://localhost:8001") # Using demo API by default
    
    # We will fuzz a few endpoints on the demo API
    endpoints = [
        {"method": "GET", "path": "/health", "body": None},
        {"method": "POST", "path": "/auth/login", "body": {"username": "admin", "password": "password"}},
        {"method": "GET", "path": "/users/me", "body": None},
        {"method": "POST", "path": "/data/process", "body": {"data": "test"}},
    ]
    
    async def broadcast(event):
        for ws in active_websockets:
            try:
                await ws.send_json(event)
            except:
                pass
    
    last_state_id = None
    action_history = []
    
    db = database.SessionLocal()
    try:
        for i, ep in enumerate(endpoints):
            # Apply generator mutations (simulate)
            mutations = MutationGenerator.generate_mutations(ep)
            
            # We'll just execute the baseline for discovery
            resp = await client.execute(method=ep["method"], path=ep["path"], json=ep["body"])
            
            action_history.append({"method": ep["method"], "path": ep["path"], "json": ep["body"]})
            
            state_id, state_info, is_new = matcher.infer_state(
                method=ep["method"], 
                path=ep["path"], 
                status_code=resp["status_code"], 
                response_data=resp["data"]
            )
            
            # Save Observation
            obs_id = str(uuid.uuid4())
            db_obs = models.Observation(
                id=obs_id, run_id=run_id, request_meta_json=ep, response_meta_json=resp, signature=state_info.get("signature")
            )
            db.add(db_obs)
            
            if is_new:
                x_pos = 100 + (i * 150) % 600
                y_pos = 100 + (i * 100) % 400
                
                # Save State to DB
                db_state = models.State(
                    id=state_id, run_id=run_id, label=state_info["label"], 
                    confidence=state_info["confidence"], signature_json=state_info.get("schema", {})
                )
                db.add(db_state)
                db.commit()
                
                await broadcast({
                    "type": "state.discovered",
                    "data": {
                        "id": state_id,
                        "label": state_info["label"],
                        "confidence": state_info["confidence"],
                        "evidenceCount": state_info["evidence_count"]
                    },
                    "position": {"x": x_pos, "y": y_pos}
                })
                
            if last_state_id and last_state_id != state_id:
                trans_id = f"e_{last_state_id}_{state_id}"
                
                # Save Transition to DB
                existing_trans = db.query(models.Transition).filter(models.Transition.id == trans_id).first()
                if not existing_trans:
                    db_trans = models.Transition(
                        id=trans_id, run_id=run_id, source_state_id=last_state_id, target_state_id=state_id, confidence=0.95
                    )
                    db.add(db_trans)
                    db.commit()
                
                await broadcast({
                    "type": "transition.discovered",
                    "data": {
                        "id": trans_id,
                        "source": last_state_id,
                        "target": state_id,
                        "label": f"{ep['method']} {ep['path']}",
                        "confidence": 0.95
                    }
                })
                
            last_state_id = state_id
            
            # If we hit a 500, trigger delta debugging
            if resp["status_code"] >= 500:
                async def runner(sequence):
                    for step in sequence:
                        r = await client.execute(method=step["method"], path=step["path"], json=step["json"])
                        if r["status_code"] >= 500:
                            return True
                    return False
                    
                debugger = DeltaDebugger(runner)
                minimized = await debugger.minimize(action_history)
                
                # Save CrashEvidence
                ce_id = str(uuid.uuid4())
                db_ce = models.CrashEvidence(id=ce_id, run_id=run_id, sequence_json=minimized)
                db.add(db_ce)
                db.commit()
                
                await broadcast({"type": "failure.minimized", "data": {"sequence": minimized}})
                
        # Mark run as finished
        db_run = db.query(models.ExperimentRun).filter(models.ExperimentRun.id == run_id).first()
        if db_run:
            db_run.status = "completed"
            db.commit()
            
    finally:
        db.close()
        await client.close()
        
    await asyncio.sleep(1)
    await broadcast({"type": "run.completed"})

@app.post("/api/runs")
def create_run(payload: dict, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    run_id = str(uuid.uuid4())
    target_id = payload.get("target_id", "demo")
    db_run = models.ExperimentRun(id=run_id, target_id=target_id, mode="discovery", status="running")
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    
    # Start the actual engine in the background
    background_tasks.add_task(execute_discovery_run, run_id)
    
    return db_run

@app.websocket("/api/ws/runs/{run_id}")
async def websocket_endpoint(websocket: WebSocket, run_id: str):
    await websocket.accept()
    active_websockets.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        active_websockets.remove(websocket)
