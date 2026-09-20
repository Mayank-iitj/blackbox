import json

class MutationGenerator:
    @staticmethod
    def generate_mutations(action):
        mutations = []
        body = action.get("body")
        
        if body and isinstance(body, dict):
            for k, v in body.items():
                # 1. Null mutation
                m_null = dict(body)
                m_null[k] = None
                mutations.append({"family": "null_mutation", "field": k, "mutated_body": m_null})
                
                # 2. Type substitution
                m_type = dict(body)
                if isinstance(v, str):
                    m_type[k] = 999999999999999999
                elif isinstance(v, int):
                    m_type[k] = "invalid_string_instead_of_int"
                mutations.append({"family": "type_mutation", "field": k, "mutated_body": m_type})
                
                # 3. SQLi / Command Injection Patterns
                m_sqli = dict(body)
                m_sqli[k] = "' OR 1=1 --"
                mutations.append({"family": "sqli_mutation", "field": k, "mutated_body": m_sqli})
                
                # 4. Large Payload (Buffer Overflow Simulation)
                m_large = dict(body)
                m_large[k] = "A" * 100000
                mutations.append({"family": "large_payload", "field": k, "mutated_body": m_large})
                
                # 5. Nested JSON bombs
                m_nest = dict(body)
                m_nest[k] = {"bomb": {"bomb": {"bomb": "boom"}}}
                mutations.append({"family": "nested_bomb", "field": k, "mutated_body": m_nest})
        
        # Latency Mutation (Slowloris/Timeout simulation)
        mutations.append({
            "family": "latency_mutation",
            "field": "network",
            "mutated_body": body,
            "delay_ms": 10000
        })
        
        # Concurrency Mutation (Race condition simulation)
        mutations.append({
            "family": "concurrency_mutation",
            "field": "network",
            "mutated_body": body,
            "concurrent_requests": 200
        })
                
        return mutations
