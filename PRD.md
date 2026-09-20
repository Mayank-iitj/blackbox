# BLACK BOX + SYNTHETIC PATIENT ZERO
## Product Requirements Document (PRD)

**Document version:** 1.0  
**Product codename:** BLACK BOX  
**Core modules:** Behavioral Reconstruction + Synthetic Patient Zero  
**Target:** 24-hour hackathon MVP, architected for production expansion

---

## 1. Executive Summary

BLACK BOX is an interactive system-observation platform that reconstructs the hidden behavioral model of a software system without requiring source code. A user provides an authorized target such as an API endpoint, documented website flow, test environment, or captured network logs. BLACK BOX treats the target as a scientific instrument: it performs controlled experiments, records input/output observations, clusters responses, infers latent states and transitions, and renders a probabilistic state machine.

Synthetic Patient Zero extends the same model from observation to controlled failure discovery. Once a behavioral model exists, the platform mutates timing, inputs, network conditions, concurrency, dependency availability, and protocol behavior to identify previously untested failure combinations and produce reproducible test cases.

The product is deliberately not positioned as a generic AI testing chatbot. The core system is deterministic, experiment-driven, graph-based, and explainable. AI is an optional interpretation layer that converts discovered behavior into human-readable hypotheses, documentation, and remediation suggestions.

---

## 2. Problem

Software systems often expose behavior that is only partially documented. Important details may exist solely in runtime behavior, undocumented edge cases, legacy compatibility paths, transient states, or interactions between multiple services.

Traditional documentation and static analysis struggle when source code is unavailable or incomplete. Manual black-box testing is slow and usually explores only expected paths. Conventional monitoring describes observed incidents but does not systematically explore the counterfactual combinations that could trigger new failures.

BLACK BOX addresses two connected problems:

1. **Behavioral opacity:** What states, transitions, invariants, and hidden branches exist in a system?
2. **Failure opacity:** Which combinations of realistic perturbations can push that system into degraded, unsafe, or unrecoverable states?

---

## 3. Product Vision

> **Turn unknown software behavior into an observable model, then turn that model into an executable experiment space.**

The long-term product is an engineering laboratory for systems whose internal implementation is unknown, incomplete, or too large to reason about manually.

---

## 4. Primary Users

### 4.1 Software Engineer
Needs to understand undocumented behavior, regressions, brittle integration paths, and hidden assumptions.

### 4.2 QA / Test Engineer
Needs automatic exploratory testing, generated test scenarios, boundary cases, and reproducible failures.

### 4.3 SRE / Platform Engineer
Needs dependency behavior, degradation analysis, failure propagation, and resilience experiments.

### 4.4 Security / Reliability Researcher
Needs controlled observation of externally visible behavior and safe discovery of unusual state transitions.

### 4.5 Technical Lead / Architect
Needs a visual behavioral model that can be attached to documentation and architecture reviews.

---

## 5. Product Principles

1. **Observe before explaining.** Measurements and traces are primary evidence.
2. **Hypotheses must be distinguishable from facts.** Inferred states are labeled as inferred.
3. **Every conclusion must have evidence.** A state or transition can be opened to view the experiments that produced it.
4. **Safe-by-default experimentation.** The system requires explicit authorization and target scope.
5. **AI is advisory, not authoritative.** AI may summarize evidence but may not silently invent observations.
6. **Reproducibility over cleverness.** Every experiment has an ID, seed, configuration, input, output signature, and timestamp.

---

## 6. Core User Journey

### Journey A — Reconstruct a hidden state machine

1. User creates a workspace.
2. User selects **API**, **Website**, or **Network Log** mode.
3. User declares an authorized target and scope.
4. BLACK BOX runs a baseline probe.
5. System establishes response signatures.
6. Explorer generates safe input variations and action sequences.
7. Observations are clustered into behavioral states.
8. State transitions are inferred from action sequences.
9. Confidence scores are assigned.
10. Interactive state graph is rendered.
11. User opens any node/edge to view supporting experiments.
12. User exports a report and/or generated test cases.

### Journey B — Find a new failure mode

1. User selects an inferred state or critical transition.
2. User launches **Synthetic Patient Zero**.
3. User chooses mutation families.
4. Engine creates candidate scenarios.
5. Scenarios are executed inside safe limits.
6. The engine detects divergence, timeouts, error amplification, or state corruption.
7. Failing scenarios are minimized.
8. The system generates a reproducible test case.
9. User can replay, compare, export, or mark as resolved.

---

## 7. Product Modes

### 7.1 API Mode — MVP Priority
Input: base URL, endpoint list or OpenAPI specification.  
Best for reliable hackathon demo and deterministic experiments.

### 7.2 Website Mode — MVP-lite
Input: URL + optional user-supplied flow steps.  
Uses browser automation to observe public/test flows.

### 7.3 Network Log Mode — MVP Priority
Input: HAR/JSON/text logs.  
Reconstructs behavior from historical evidence without active probing.

### 7.4 Application/Container Mode — Post-MVP
Input: Docker Compose or local test environment.  
Adds dependency injection and controlled fault simulation.

---

## 8. Feature Requirements

## 8.1 Workspace & Target Registration

**FR-001** Create named workspaces.  
**FR-002** Register target type: API / Website / Logs.  
**FR-003** Require authorization acknowledgement before active probing.  
**FR-004** Support explicit host allowlists.  
**FR-005** Store probe policy: max requests, concurrency, timeout, retry count.  
**FR-006** Support pause/resume/cancel experiments.

### Acceptance criteria
- A new target cannot start active probing until authorization and scope are confirmed.
- Every experiment records the target and policy used.

---

## 8.2 Baseline Discovery

**FR-010** Perform baseline requests with stable headers and deterministic request settings.

**FR-011** Compute a normalized response signature containing:
- status code
- content-type
- schema/key fingerprint
- body hash / semantic hash
- latency bucket
- redirect behavior
- selected header signature
- error classification

**FR-012** Identify repeated signatures as the same candidate state.

**FR-013** Store raw evidence separately from normalized features.

---

## 8.3 Experiment Generator

The generator creates controlled variations while preserving safety limits.

### Mutation families
- null / empty / missing field
- type substitution
- boundary values
- enum mutation
- string length variation
- malformed but parser-safe input
- duplicate parameter
- ordering variation
- optional field omission
- sequential action changes
- timing delay
- controlled concurrency

The MVP should prioritize mutations with high information gain rather than brute force.

---

## 8.4 Behavioral State Inference

A state is represented as a behavioral signature, not merely a UI screen or HTTP code.

Candidate state vector:

```text
State = {
  response_signature,
  session_context,
  resource_context,
  observed_constraints,
  latency_distribution,
  error_distribution
}
```

The engine clusters compatible observations and assigns a confidence score.

---

## 8.5 Transition Inference

An edge is created when an action sequence reliably moves the system from candidate state A to candidate state B.

Edge metadata:

```text
Transition = {
  source_state,
  action_signature,
  target_state,
  success_rate,
  evidence_count,
  conditions,
  confidence
}
```

The UI must show uncertain edges differently from highly supported edges, but must never hide them.

---

## 8.6 Invariant Discovery

The engine should identify repeated relationships such as:

- action is only accepted after a prior action
- a field becomes required after a state transition
- a token changes after authentication
- duplicate action creates no state change
- rate threshold triggers a different behavior state

These are written as **behavioral hypotheses** backed by evidence.

---

## 8.7 Synthetic Patient Zero

### Objective
Generate plausible environmental or input perturbations and search for minimal combinations that cause a meaningful behavioral deviation.

### Mutation dimensions

```text
Input:
  nulls, boundaries, types, formats

Timing:
  delay, jitter, timeout, burst

Concurrency:
  sequential, parallel, burst

Network:
  packet-loss simulation, response delay, disconnect

Dependencies:
  controlled stub failure, unavailable mock, stale response

State:
  stale token, duplicate action, reordered action
```

### Failure signals
- previously unseen state
- response schema divergence
- unexpected status class
- timeout
- repeated retries
- error amplification
- state transition contradiction
- invariant violation
- recovery failure

### Minimization
When a multi-factor scenario fails, run delta-debugging to identify the smallest factor set responsible.

Example:

```text
Initial failure:
API delay + concurrency 20 + stale dependency + malformed optional field

Minimal reproducer:
API delay + concurrency 20
```

---

## 8.8 Replay & Reproducibility

**FR-080** Every experiment can be replayed.

Stored replay package:

```text
experiment_id
seed
request/action sequence
mutation configuration
target policy
expected baseline signature
observed signatures
environment metadata
```

---

## 8.9 Evidence Explorer

Every inferred result must link to the experiments that support it.

A state panel should show:

- state ID
- human label
- confidence
- first observed
- last observed
- evidence count
- representative request/response
- incoming/outgoing transitions

A transition panel should show:

- action
- source/target
- support count
- success/failure rates
- conditions
- replay button

---

## 8.10 AI Interpretation Layer

Optional AI tasks:

- generate human-readable state labels
- summarize a state
- explain a transition from evidence
- generate documentation
- explain a discovered failure
- suggest follow-up experiments

Guardrail: the AI receives structured evidence and must cite evidence IDs in generated explanations.

---

## 8.11 Reports

Export a Markdown/PDF-ready report containing:

1. Target and scope
2. Experiment policy
3. Discovered states
4. Discovered transitions
5. Behavioral hypotheses
6. Failure scenarios
7. Minimal reproducers
8. Evidence appendix
9. Suggested tests

---

## 9. Dashboard Metrics

Core metrics:

- experiments executed
- unique candidate states
- discovered transitions
- hidden conditions
- confidence-weighted coverage
- anomalies found
- minimized failures
- average experiment latency
- replayable failures

Avoid vanity metrics that cannot be traced to evidence.

---

## 10. Non-Functional Requirements

### Performance
- UI should remain interactive with 1,000+ nodes via virtualization/filtering.
- API responses should return job status immediately for long experiments.
- Experiment workers should be asynchronous.

### Reliability
- Experiments must be resumable.
- Failed individual probes must not crash an entire run.
- Raw evidence must be persisted before post-processing.

### Security
- Default to explicit allowlists.
- Block private/link-local/loopback destinations in remote mode.
- Enforce rate limits and concurrency ceilings.
- Redact secrets from logs.
- Encrypt credentials at rest.
- Never execute untrusted code from a target.
- Require explicit confirmation before destructive or state-changing actions.

### Privacy
- Minimize stored request bodies.
- Provide evidence retention settings.
- Offer workspace deletion.

### Accessibility
- WCAG-oriented keyboard navigation.
- Color must not be the sole indicator of state/confidence.
- Graph nodes must have accessible labels.

---

## 11. Out of Scope for Hackathon MVP

- Arbitrary native application reverse engineering
- Full malware analysis
- Internet-wide scanning
- Autonomous destructive testing
- Production fault injection against systems without explicit authorization
- Perfect state-machine inference
- Guaranteed semantic correctness of inferred states

---

## 12. Hackathon MVP Definition

The strongest 24-hour scope is:

### Must-have
- API target ingestion
- Safe baseline probing
- Response fingerprinting
- Mutation engine
- State clustering
- Transition discovery
- Interactive graph
- Evidence drawer
- Synthetic Patient Zero with 4 mutation types
- Failure minimization
- Replay
- polished landing + demo workspace

### Nice-to-have
- HAR import
- Playwright website mode
- LLM explanations
- report export
- anomaly timeline

### Post-hackathon
- Docker/container mode
- service mesh instrumentation
- advanced active-learning exploration
- organization-wide system maps

---

## 13. Success Metrics

Hackathon MVP success is measured by:

1. A judge can provide a safe test API and obtain a meaningful graph without developer intervention.
2. At least one hidden state/transition is discovered from controlled experiments.
3. At least one failure scenario is generated and minimized.
4. A discovered result can be reproduced using replay.
5. Every result shows the evidence behind it.

---

## 14. Demo Story

### Act 1 — Unknown
“Here is an API. We don't have its source code.”

### Act 2 — Observe
Run 50–150 controlled experiments.

### Act 3 — Reveal
BLACK BOX announces:

> **14 behavioral states discovered.**

### Act 4 — Visualize
The graph appears and becomes explorable.

### Act 5 — Break safely
Run Synthetic Patient Zero on a selected transition.

### Act 6 — Discover
The engine finds a failure under a combination such as latency + concurrency.

### Act 7 — Minimize
It reduces the failure to the smallest reproducible scenario.

### Act 8 — Replay
One click reproduces the result and opens its evidence chain.

Final message:

> **We didn't read the source code. We learned the system by experimenting with it.**

---
