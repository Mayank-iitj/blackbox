from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from .database import Base

class Workspace(Base):
    __tablename__ = "workspaces"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    owner_id = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    settings_json = Column(JSON, default={})

class Target(Base):
    __tablename__ = "targets"
    id = Column(String, primary_key=True, index=True)
    workspace_id = Column(String, ForeignKey("workspaces.id"))
    type = Column(String)
    name = Column(String)
    base_url = Column(String)
    scope_json = Column(JSON, default={})
    probe_policy_json = Column(JSON, default={})
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ExperimentRun(Base):
    __tablename__ = "experiment_runs"
    id = Column(String, primary_key=True, index=True)
    target_id = Column(String, ForeignKey("targets.id"))
    mode = Column(String)
    seed = Column(String)
    status = Column(String)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True), nullable=True)
    metadata_json = Column(JSON, default={})

class Observation(Base):
    __tablename__ = "observations"
    id = Column(String, primary_key=True, index=True)
    run_id = Column(String, ForeignKey("experiment_runs.id"))
    request_meta_json = Column(JSON, default={})
    response_meta_json = Column(JSON, default={})
    signature = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class State(Base):
    __tablename__ = "states"
    id = Column(String, primary_key=True, index=True)
    run_id = Column(String, ForeignKey("experiment_runs.id"))
    label = Column(String)
    confidence = Column(Float)
    signature_json = Column(JSON, default={})
    evidence_count = Column(Integer, default=0)

class Transition(Base):
    __tablename__ = "transitions"
    id = Column(String, primary_key=True, index=True)
    run_id = Column(String, ForeignKey("experiment_runs.id"))
    source_state_id = Column(String, ForeignKey("states.id"))
    target_state_id = Column(String, ForeignKey("states.id"))
    action_signature_json = Column(JSON, default={})
    confidence = Column(Float)

class CrashEvidence(Base):
    __tablename__ = "crash_evidence"
    id = Column(String, primary_key=True, index=True)
    run_id = Column(String, ForeignKey("experiment_runs.id"))
    sequence_json = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

