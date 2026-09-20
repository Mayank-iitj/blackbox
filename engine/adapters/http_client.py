import httpx
import time
import asyncio

class BlackBoxHTTPClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        limits = httpx.Limits(max_keepalive_connections=50, max_connections=100)
        self.client = httpx.AsyncClient(base_url=base_url, timeout=15.0, limits=limits)

    async def execute(self, method: str, path: str, json: dict = None, headers: dict = None, delay_ms: int = 0, retries: int = 3):
        if delay_ms > 0:
            await asyncio.sleep(delay_ms / 1000.0)
            
        start_time = time.time()
        for attempt in range(retries):
            try:
                response = await self.client.request(method=method, url=path, json=json, headers=headers)
                elapsed = time.time() - start_time
                
                try:
                    resp_data = response.json()
                except:
                    resp_data = {"raw": response.text}
                    
                return {
                    "status_code": response.status_code,
                    "data": resp_data,
                    "elapsed_ms": int(elapsed * 1000),
                    "error": None
                }
            except httpx.RequestError as e:
                if attempt == retries - 1:
                    elapsed = time.time() - start_time
                    return {
                        "status_code": 503, # Service Unavailable / Network Error
                        "data": {"error": str(e)},
                        "elapsed_ms": int(elapsed * 1000),
                        "error": str(e)
                    }
                await asyncio.sleep(2 ** attempt) # Exponential backoff
            except Exception as e:
                elapsed = time.time() - start_time
                return {
                    "status_code": 500,
                    "data": {"error": str(e)},
                    "elapsed_ms": int(elapsed * 1000),
                    "error": str(e)
                }
                
    async def close(self):
        await self.client.aclose()
