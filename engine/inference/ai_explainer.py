class AIExplainer:
    """
    Mock integration for an LLM (e.g., OpenAI or Google Gemini).
    Generates human-readable explanations of states and failure sequences.
    """
    
    @staticmethod
    def generate_state_label(method: str, path: str, status: int, schema: dict) -> str:
        """
        Uses an LLM to look at the schema and endpoint and guess a semantic label.
        e.g., {"user": "...", "token": "..."} -> "AUTH_SUCCESS"
        """
        # In a real setup, we would call:
        # response = openai.ChatCompletion.create(...)
        # We simulate the LLM intelligence here based on simple heuristics.
        
        path_end = path.split('/')[-1].upper()
        if "login" in path.lower() or "auth" in path.lower():
            if status == 200:
                return "AUTH_SUCCESS"
            return "AUTH_FAILURE"
            
        if status >= 500:
            return f"CRASH_{path_end}"
            
        if status == 403:
            return f"FORBIDDEN_{path_end}"
            
        if "error" in str(schema).lower():
            return f"CLIENT_ERR_{path_end}"
            
        return f"OK_{path_end}"
        
    @staticmethod
    def generate_failure_explanation(sequence: list) -> str:
        """
        Takes a sequence of requests (the output of Delta Debugger) and explains
        why the system crashed.
        """
        # Simulated LLM response
        return (
            "The failure occurs because the system fails to validate the `data` payload "
            "when processed sequentially after a successful login but before the cache initializes. "
            "This results in a NullReferenceException in the downstream processor."
        )
