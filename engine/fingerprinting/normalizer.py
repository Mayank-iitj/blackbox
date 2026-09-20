import hashlib
import json

def get_latency_bucket(latency_ms: float) -> str:
    if latency_ms < 50: return "fast"
    if latency_ms < 200: return "medium"
    if latency_ms < 1000: return "slow"
    return "timeout"

def compute_schema_hash(body_text: str) -> str:
    try:
        data = json.loads(body_text)
        if isinstance(data, dict):
            keys = sorted(data.keys())
            return hashlib.md5("".join(keys).encode()).hexdigest()
    except:
        pass
    return hashlib.md5(body_text.encode()).hexdigest()

def normalize_observation(obs) -> dict:
    resp = obs.response_meta
    status_code = resp.get("status_code", 0)
    
    status_class = f"{str(status_code)[0]}xx" if status_code else "0xx"
    
    schema_hash = compute_schema_hash(resp.get("body", ""))
    latency_bucket = get_latency_bucket(obs.latency_ms)
    
    signature = f"{status_class}|{status_code}|{schema_hash}|{latency_bucket}"
    
    return {
        "status_class": status_class,
        "exact_status": status_code,
        "schema_hash": schema_hash,
        "latency_bucket": latency_bucket,
        "signature_string": signature
    }
