from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Demo API")

# State machine:
# LOGIN -> OTP_REQUIRED
#  ├── valid otp -> AUTHENTICATED
#  └── invalid otp -> LOCKED

class LoginRequest(BaseModel):
    email: str
    password: str

class OtpRequest(BaseModel):
    otp: str

# In-memory session store for simplicity
sessions = {}

@app.post("/login")
def login(req: LoginRequest):
    if req.email == "demo@example.com" and req.password == "password":
        session_id = "session_123"
        sessions[session_id] = "OTP_REQUIRED"
        return {"status": "otp_required", "session_id": session_id}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/verify-otp")
def verify_otp(req: OtpRequest, authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    session_id = authorization.replace("Bearer ", "")
    if session_id not in sessions:
        raise HTTPException(status_code=401, detail="Invalid session")
        
    if sessions[session_id] == "LOCKED":
        raise HTTPException(status_code=403, detail="Account locked")
        
    if req.otp == "123456":
        sessions[session_id] = "AUTHENTICATED"
        return {"status": "authenticated", "token": "final_token_999"}
    else:
        sessions[session_id] = "LOCKED"
        raise HTTPException(status_code=403, detail="Invalid OTP, account locked")

@app.get("/dashboard")
def dashboard(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
        
    token = authorization.replace("Bearer ", "")
    if token == "final_token_999":
        return {"data": "Welcome to the dashboard!"}
    
    raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
