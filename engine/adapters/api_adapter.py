from typing import Protocol, Any, Dict
import httpx
import time

class Observation:
    def __init__(self, request_meta: dict, response_meta: dict, latency_ms: float):
        self.request_meta = request_meta
        self.response_meta = response_meta
        self.latency_ms = latency_ms

class ProbePolicy:
    def __init__(self, timeout: float = 5.0, retries: int = 1):
        self.timeout = timeout
        self.retries = retries

class Action:
    def __init__(self, method: str, path: str, headers: dict = None, body: dict = None):
        self.method = method
        self.path = path
        self.headers = headers or {}
        self.body = body

class TargetAdapter(Protocol):
    async def probe(self, action: Action, policy: ProbePolicy) -> Observation: ...

class ApiAdapter:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        
    async def probe(self, action: Action, policy: ProbePolicy) -> Observation:
        url = f"{self.base_url}{action.path}"
        start_time = time.time()
        
        async with httpx.AsyncClient(timeout=policy.timeout) as client:
            try:
                response = await client.request(
                    method=action.method,
                    url=url,
                    headers=action.headers,
                    json=action.body
                )
                
                latency_ms = (time.time() - start_time) * 1000
                
                req_meta = {
                    "method": action.method,
                    "url": url,
                    "headers": action.headers
                }
                
                resp_meta = {
                    "status_code": response.status_code,
                    "content_type": response.headers.get("content-type", ""),
                    "headers": dict(response.headers),
                    "body": response.text
                }
                
                return Observation(req_meta, resp_meta, latency_ms)
                
            except httpx.RequestError as exc:
                latency_ms = (time.time() - start_time) * 1000
                req_meta = {"method": action.method, "url": url}
                resp_meta = {"error": str(exc), "status_code": 0}
                return Observation(req_meta, resp_meta, latency_ms)
