import hashlib
import json
from typing import Dict, Any, Tuple

class StateMatcher:
    def __init__(self):
        self.known_states = {}  # state_id -> state_info
        self.state_counter = 1
        
    def _extract_schema(self, data: Any) -> Any:
        """Recursively extracts the schema (keys and types) from a JSON object."""
        if isinstance(data, dict):
            return {k: self._extract_schema(v) for k, v in data.items()}
        elif isinstance(data, list):
            if not data:
                return []
            return [self._extract_schema(data[0])]
        else:
            return type(data).__name__

    def _hash_schema(self, schema: Any) -> str:
        schema_str = json.dumps(schema, sort_keys=True)
        return hashlib.md5(schema_str.encode()).hexdigest()

    def infer_state(self, method: str, path: str, status_code: int, response_data: Any) -> Tuple[str, dict, bool]:
        """
        Infers the state based on response.
        Returns: (state_id, state_info, is_new_state)
        """
        schema = self._extract_schema(response_data)
        schema_hash = self._hash_schema(schema)
        
        # State signature is based on the endpoint, status code, and the response shape
        signature = f"{method}:{path}:{status_code}:{schema_hash}"
        
        if signature in self.known_states:
            state_id = self.known_states[signature]["id"]
            self.known_states[signature]["evidence_count"] += 1
            return state_id, self.known_states[signature], False
            
        # New State discovered
        state_id = f"S{self.state_counter:02d}"
        self.state_counter += 1
        
        # Determine a human-readable label using AI
        from engine.inference.ai_explainer import AIExplainer
        label = AIExplainer.generate_state_label(method, path, status_code, schema)
            
        state_info = {
            "id": state_id,
            "label": label,
            "signature": signature,
            "status_code": status_code,
            "schema": schema,
            "evidence_count": 1,
            "confidence": 0.95 if status_code < 400 else 0.8
        }
        
        self.known_states[signature] = state_info
        return state_id, state_info, True

