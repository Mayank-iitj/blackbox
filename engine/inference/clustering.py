class StateInferenceEngine:
    def __init__(self):
        self.states = {} # signature -> state_id
        self.state_counter = 1
        
    def process_observation(self, normalized_obs: dict) -> str:
        sig = normalized_obs["signature_string"]
        if sig in self.states:
            return self.states[sig]
        
        state_id = f"S{self.state_counter:02d}"
        self.states[sig] = state_id
        self.state_counter += 1
        return state_id
