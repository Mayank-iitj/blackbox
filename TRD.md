# BLACK BOX + SYNTHETIC PATIENT ZERO
## Technical Requirements & Design Document (TRD)

**Document version:** 1.0

---

## 1. Technical Objectives

The implementation must create a deterministic experiment loop:

```text
Target
  ↓
Baseline Probe
  ↓
Observation Normalization
  ↓
Feature Extraction
  ↓
State Clustering
  ↓
Transition Inference
  ↓
Graph Model
  ↓
Mutation / Chaos Generator
  ↓
Failure Detection
  ↓
Minimization
  ↓
Replay + Evidence
```

The platform should remain functional without an LLM. AI must enrich explanations rather than become a critical dependency.

---

## 2. High-Level Architecture

```text
┌──────────────────────────────────────────────────────────────┐
│                         WEB APP                             │
│ Next.js + React + React Flow + Tailwind + Motion            │
└───────────────────────────────┬──────────────────────────────┘
                                │ HTTPS / JSON
                                ↓
┌──────────────────────────────────────────────────────────────┐
│                         API LAYER                            │
│ FastAPI                                                     │
│ Auth / Workspaces / Targets / Jobs / Graph / Reports        │
└───────────────┬───────────────────────────┬─────────────────┘
                │                           │
                ↓                           ↓
        ┌──────────────┐            ┌──────────────────┐
        │ Job Queue    │            │ PostgreSQL       │
        │ Redis/worker │            │ Supabase         │
        └──────┬───────┘            └──────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────────────────┐
│                    EXPERIMENT ENGINE                         │
│ Baseline → Mutations → Probe → Normalize → Infer → Score    │
└───────────────┬───────────────────────┬──────────────────────┘
                │                       │
                ↓                       ↓
        ┌──────────────┐        ┌────────────────┐
        │ API Adapter  │        │ Browser Adapter│
        │ httpx        │        │ Playwright     │
        └──────────────┘        └────────────────┘

               ↓
       Evidence / Artifact Store

               ↓
       Optional AI Interpretation
```

---

## 3. Logical Components

### 3.1 API Gateway
Responsibilities:
- authentication
- authorization
- workspace isolation
- request validation
- job creation
- rate limiting

### 3.2 Target Manager
Stores target metadata, scope, policies, and credentials.

### 3.3 Probe Scheduler
Turns experiments into executable jobs and controls concurrency.

### 3.4 Adapter Layer
Abstract interface:

```python
class TargetAdapter(Protocol):
    async def probe(self, action: Action, policy: ProbePolicy) -> Observation: ...
```

Implementations:
- `ApiAdapter`
- `BrowserAdapter`
- `LogAdapter`

### 3.5 Observation Normalizer
Converts raw observations into comparable signatures.

### 3.6 State Inference Engine
Clusters observations and maintains candidate behavioral states.

### 3.7 Transition Inference Engine
Builds directed edges from state/action/state sequences.

### 3.8 Synthetic Patient Zero Engine
Generates, executes, detects, and minimizes perturbation combinations.

### 3.9 Evidence Service
Provides traceability from every claim to source observations.

### 3.10 AI Interpreter
Receives structured evidence and emits explanations, labels, and documentation.

---

## 4. Core Data Model

### Workspace

```text
id
name
owner_id
created_at
settings_json
```

### Target

```text
id
workspace_id
type
name
base_url
scope_json
probe_policy_json
credential_ref
status
created_at
```

### ExperimentRun

```text
id
target_id
mode
seed
status
started_at
finished_at
request_budget
metadata_json
```

### Experiment

```text
id
run_id
parent_experiment_id
action_json
mutation_json
expected_signature
observed_signature
status
latency_ms
created_at
```

### Observation

```text
id
experiment_id
request_meta_json
response_meta_json
body_hash
schema_fingerprint
semantic_features_json
error_class
created_at
```

### State

```text
id
run_id
label
confidence
signature_json
evidence_count
first_seen
last_seen
```

### Transition

```text
id
run_id
source_state_id
target_state_id
action_signature_json
confidence
support_count
condition_json
```

### FailureCase

```text
id
run_id
trigger_state_id
mutation_json
failure_class
severity
minimal_reproducer_json
confidence
status
```

---

## 5. State Signature Design

The signature should be robust to noise but sensitive to meaningful behavioral change.

### API signature

```text
status_class
exact_status
content_type
schema_keys_hash
normalized_body_hash
error_code
selected_headers_hash
redirect_chain
latency_bucket
```

### Browser signature

```text
url
page_title
DOM_structure_hash
visible_component_signature
network_request_signature
console_error_signature
```

### Log signature

```text
event_type
service
endpoint
status
error_category
sequence_context
```

---

## 6. State Inference Algorithm

### MVP approach

Do not attempt universal process discovery. Start with online clustering.

1. Create baseline observations.
2. Normalize observations.
3. Compute feature vector.
4. Compare to existing candidate states.
5. Assign if similarity exceeds threshold.
6. Otherwise create new state.
7. Update state centroid/prototype.

A simple similarity model can combine:

```text
0.25 status similarity
0.20 schema similarity
0.20 semantic/body similarity
0.15 error similarity
0.10 redirect similarity
0.10 latency bucket similarity
```

These weights are configuration, not hard truth.

### Post-MVP
Replace the simple weighted matcher with configurable embeddings + graph-constrained clustering.

---

## 7. Transition Discovery

For each experiment sequence:

```text
S0 --action A--> S1
S1 --action B--> S2
```

Increment transition support.

Confidence can be estimated from repeated support:

```text
confidence = successful_support / total_observed_support
```

Add condition labels when a repeated precondition is observed.

Examples:

```text
requires authenticated session
requires resource existence
requires token freshness
requires previous action
```

Conditions should be marked as inferred until verified by a targeted counter-experiment.

---

## 8. Active Experiment Selection

The engine should not randomly probe everything.

For each candidate experiment calculate:

```text
score =
  information_gain
  + transition_uncertainty
  + novelty
  + failure_potential
  - execution_cost
```

The next experiment is the highest scoring safe action.

### Information gain heuristic
Prefer actions that:
- target uncertain edges
- distinguish two similar candidate states
- test a suspected precondition
- explore a rarely observed response signature
- investigate a high-risk divergence

---

## 9. Synthetic Patient Zero Engine

### 9.1 Mutation object

```python
Mutation(
    family="latency",
    parameter="delay_ms",
    value=1200,
    scope="payment_request"
)
```

### 9.2 Mutation operators

```text
BoundaryMutation
TypeMutation
NullMutation
OmissionMutation
LatencyMutation
ConcurrencyMutation
DependencyFailureMutation
OrderingMutation
RetryMutation
```

### 9.3 Scenario representation

```text
Scenario = [Mutation1, Mutation2, ...]
```

### 9.4 Search strategy

MVP:
- single-factor mutation
- pairwise mutation
- bounded random search

Post-MVP:
- evolutionary search
- Bayesian optimization
- multi-objective exploration

---

## 10. Failure Oracle

A failure is not necessarily an HTTP 500.

The oracle evaluates:

```text
Unexpected state
Schema divergence
Latency threshold violation
Retry amplification
Error-rate spike
Invariant violation
Recovery failure
Behavioral dead-end
```

Example:

```python
failure = (
    new_state_not_seen_before
    or schema_changed_unexpectedly
    or timeout > policy.timeout_threshold
    or invariant_violated
)
```

---

## 11. Failure Minimization

Use delta-debugging.

Given a failing scenario:

```text
[A, B, C, D, E]
```

Test subsets:

```text
[A, B, C]
[D, E]
[A, D]
[B, E]
...
```

Continue until no smaller subset reproduces the failure.

For the MVP, cap minimization attempts to prevent runaway experiment cost.

---

## 12. Replay Engine

Replay must use the exact original:

- seed
- action sequence
- mutation parameters
- headers policy
- concurrency
- timeout
- target adapter

Replay results are compared against the original observation signature and assigned:

```text
REPRODUCED
DIVERGED
NOT_REPRODUCED
```

---

## 13. REST API

### Authentication

```http
POST /auth/session
```

### Targets

```http
POST /api/targets
GET  /api/targets
GET  /api/targets/{id}
DELETE /api/targets/{id}
```

### Runs

```http
POST /api/runs
GET  /api/runs/{id}
POST /api/runs/{id}/cancel
```

### Graph

```http
GET /api/runs/{id}/states
GET /api/runs/{id}/transitions
GET /api/runs/{id}/evidence
```

### Failure discovery

```http
POST /api/runs/{id}/patient-zero
GET  /api/failures/{id}
POST /api/failures/{id}/replay
```

### Reports

```http
POST /api/runs/{id}/report
GET  /api/reports/{id}
```

---

## 14. WebSocket / Live Events

Use a streaming channel for experiment progress.

Event types:

```text
run.started
probe.started
probe.completed
state.discovered
transition.discovered
mutation.started
failure.detected
failure.minimized
run.completed
```

Payload example:

```json
{
  "type": "state.discovered",
  "runId": "run_123",
  "stateId": "S14",
  "label": "AUTHENTICATED",
  "confidence": 0.94,
  "evidenceCount": 8
}
```

---

## 15. Security Architecture

### Target authorization

The active probe workflow must require:
- explicit user acknowledgement
- target allowlist
- scope declaration
- request budget
- concurrency cap

### SSRF controls

Remote worker blocks:
- loopback
- link-local
- private RFC1918 ranges
- metadata service addresses

unless the user explicitly runs a local/authorized connector mode.

### Credential handling

- store only references to secrets
- use environment/secret manager
- never include credentials in evidence bodies
- redact Authorization/Cookie headers before persistence

### Destructive actions

MVP excludes destructive verbs by default. Unsafe action classes require an explicit policy and an isolated test environment.

---

## 16. Observability

Every layer emits:

```text
trace_id
run_id
experiment_id
target_id
latency
status
error_type
```

Recommended telemetry:
- structured JSON logs
- OpenTelemetry traces
- worker health metrics
- experiment counters

---

## 17. Deployment Architecture

### Hackathon

```text
Vercel
  ↓
Next.js

Render / Railway
  ↓
FastAPI worker

Supabase
  ↓
Postgres

Redis
  ↓
job coordination
```

The architecture should permit moving workers to Kubernetes later without rewriting the core engine.

---

## 18. Testing Strategy

### Unit
- fingerprinting
- mutation generation
- similarity
- clustering
- transition calculation
- failure oracle
- minimization

### Integration
- API adapter
- browser adapter
- database
- job lifecycle
- replay

### Contract
- target fixtures with known state machines
- deterministic mock APIs

### Golden fixture
Create a deliberately simple demo API with:

```text
LOGIN
  ↓
OTP_REQUIRED
  ├── valid → AUTHENTICATED
  └── invalid → LOCKED
```

The system should rediscover this model automatically.

---

## 19. 24-Hour Engineering Plan

### Hours 0–2
Repo bootstrap, auth, environment, database, design system.

### Hours 2–5
Target registration + API adapter + baseline probes.

### Hours 5–8
Fingerprinting + evidence persistence.

### Hours 8–12
State clustering + transition graph.

### Hours 12–15
Interactive React Flow graph + live progress.

### Hours 15–18
Synthetic Patient Zero mutations + failure oracle.

### Hours 18–20
Minimization + replay.

### Hours 20–22
AI explanation + report.

### Hours 22–24
Polish, test, deploy, seed demo fixture, README, screenshots, video.

---

## 20. Repository Structure

```text
black-box/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── shared-types/
│   └── ui/
├── engine/
│   ├── adapters/
│   ├── fingerprinting/
│   ├── inference/
│   ├── mutations/
│   ├── patient_zero/
│   ├── minimization/
│   └── replay/
├── fixtures/
│   ├── demo-api/
│   └── sample-har/
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── design.md
│   └── TECHSTACK.md
├── tests/
├── .env.example
├── docker-compose.yml
├── README.md
└── LICENSE
```

---
