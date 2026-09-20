# BLACK BOX + SYNTHETIC PATIENT ZERO
## Product & UI/UX Design Specification

## 1. Design Direction

### Product personality

**Scientific instrument + cyberpunk observatory + premium developer console.**

The interface should feel like the user is operating a machine that is discovering an unknown system in real time.

Avoid the typical “AI startup” aesthetic of oversized gradients, floating blobs, generic robot imagery, and excessive glassmorphism.

---

## 2. Visual Language

### Base palette

```text
Background      #07090D
Surface         #0D1118
Surface 2       #121923
Border          #1D2733
Primary text    #E8EEF5
Muted text      #8B98A8
Success         #52E0A4
Warning         #F0B55A
Danger          #FF5C72
Info            #66A3FF
```

Use color as a semantic signal, not decoration.

### Typography

Primary:
- Inter / Geist-style sans

Technical:
- JetBrains Mono

Hierarchy:

```text
Display      48–64px
Page title   28–36px
Section      18–22px
Body         14–16px
Technical    12–14px
```

---

## 3. Brand System

### Wordmark

```text
BLACK//BOX
```

Optional product descriptor:

> Behavioral Intelligence Engine

Synthetic Patient Zero appears as a module, not a second brand.

---

## 4. Interaction Philosophy

Everything important should answer one of four questions:

```text
WHAT DID WE OBSERVE?
WHAT DID WE INFER?
WHAT FAILED?
CAN WE REPRODUCE IT?
```

Avoid hidden functionality. Advanced details can progressively reveal from drawers and panels.

---

## 5. Landing Page

### Hero

Headline:

> **UNDERSTAND SYSTEMS YOU CANNOT SEE INSIDE.**

Subheadline:

> BLACK BOX performs controlled experiments on authorized software systems, reconstructs hidden behavioral states, and generates reproducible failure scenarios.

Primary CTA:

**Launch Investigation →**

Secondary CTA:

**View Example System**

### Hero visual

A dark animated state machine gradually appearing:

```text
UNKNOWN
   ↓
S1 ───→ S2
 │       │
 ↓       ↓
S3 ───→ S4
```

During animation, node labels change from `UNKNOWN` to inferred labels such as `AUTHENTICATED` and `LOCKED`.

---

## 6. Main Application Shell

```text
┌──────────────────────────────────────────────────────────────┐
│ BLACK//BOX                     RUNNING • 14 STATES           │
├─────────────┬────────────────────────────────┬───────────────┤
│             │                                │               │
│ NAVIGATION  │       BEHAVIOR GRAPH          │ EVIDENCE      │
│             │                                │               │
│ Overview    │                                │ State S07     │
│ Targets     │                                │               │
│ Runs        │      [S1]────[S2]              │ Confidence    │
│ Discover    │       │       │                │ 94%           │
│ Patient     │      [S3]────[S4]              │               │
│ Zero        │                                │ Evidence ×8   │
│ Failures    │                                │               │
│ Reports     │                                │ [Replay]      │
│             │                                │               │
└─────────────┴────────────────────────────────┴───────────────┘
```

---

## 7. Onboarding Flow

### Step 1 — Choose target
Cards:

```text
API
Website
Network Logs
```

API is visually recommended for first investigation.

### Step 2 — Authorization
Show a prominent safety notice:

> Only analyze systems you own or have explicit authorization to test.

Require acknowledgement.

### Step 3 — Scope
Fields:
- Base URL
- endpoint allowlist
- request budget
- concurrency
- timeout

### Step 4 — Start investigation
Button:

**BEGIN CONTROLLED EXPERIMENT**

---

## 8. Live Investigation View

This is the key “wow” screen.

### Left panel — Experiment stream

```text
09:31:02  Probe #041   S04 → ?
09:31:03  New signature detected
09:31:03  State S07 discovered
09:31:04  Transition S04 → S07
09:31:05  Condition hypothesis created
```

### Center — Graph

Animated edges appear as transitions are discovered.

Nodes should subtly pulse when new evidence arrives.

### Right panel — Current inference

```text
STATE S07
────────────
AUTHENTICATED

Confidence
██████████░ 94%

Observed 8 times

Likely conditions
• valid session
• verified token

Evidence
E-041
E-052
E-061
```

---

## 9. State Node Design

Each graph node contains:

```text
┌───────────────────┐
│ S07               │
│ AUTHENTICATED     │
│                   │
│ 94% confidence    │
│ ×8 observations   │
└───────────────────┘
```

States should not be visually over-designed. The graph itself is the hero.

---

## 10. Transition Design

Edges display an action badge when selected.

Example:

```text
S04 ── POST /login ──→ S07
```

Click edge → evidence drawer.

Drawer content:

```text
TRANSITION T18

POST /login

Success rate      92%
Evidence           12
Confidence         0.91

Inferred condition
Valid credentials

[Replay]
[Inspect Evidence]
```

---

## 11. Synthetic Patient Zero UI

### Launch screen

Title:

> **CREATE A PATIENT ZERO**

Subtext:

> Inject controlled perturbations and search for previously unseen failure states.

### Mutation cards

```text
Latency       [ OFF ]
Concurrency   [ OFF ]
Input         [ ON  ]
Dependency    [ OFF ]
Ordering      [ ON  ]
```

### Strategy

```text
○ Single-factor
● Pairwise
○ Exploratory
```

Button:

**START EVOLUTION**

---

## 12. Failure Discovery Screen

When a failure is discovered, stop the normal graph and visually isolate the failing path.

```text
FAILURE FOUND

S04
 ↓
S07
 ↓
S12  ← DIVERGENCE

Trigger
Latency 1200ms + concurrency 20

Severity
HIGH

[MINIMIZE FAILURE]
```

After minimization:

```text
MINIMAL REPRODUCER

Latency: 1200ms
Concurrency: 20

Removed:
✓ malformed input
✓ stale dependency
✓ ordering mutation

[REPLAY]
```

---

## 13. Evidence Drawer

The most important trust feature.

Every result should have an **Evidence** affordance.

Example:

```text
EVIDENCE E-041
────────────────────────
Request
POST /login

Input
email = demo@example.com
password = ********

Response
200 OK

Observed
redirect → /dashboard

Signature
9f81c4...

Timestamp
09:31:03

[OPEN RAW]
[REPLAY]
```

---

## 14. Failure Timeline

Use a horizontal event timeline:

```text
T+0      baseline
  │
T+120ms  latency injected
  │
T+420ms  retry detected
  │
T+800ms  state divergence
  │
T+1.2s   failure
```

This should be animated during the demo.

---

## 15. Reports Page

Report cards:

```text
Behavior Map
14 states • 31 transitions

Resilience Findings
3 reproducible failures

Coverage
82% confidence-weighted

[EXPORT REPORT]
```

---

## 16. Empty States

Avoid generic:

> No data yet.

Use purposeful messaging:

> **Your system is still unknown.**  
> Run the first controlled experiment to begin reconstructing its behavior.

---

## 17. Microcopy

### Investigation
- `System model initializing…`
- `Testing uncertain transition…`
- `New behavioral state discovered.`
- `Hypothesis created from repeated evidence.`

### Failure
- `Behavior diverged from baseline.`
- `Candidate failure isolated.`
- `Minimal reproducer found.`
- `Replay confirmed.`

Never use sensational language such as “SYSTEM DESTROYED”. The product should feel scientific, not theatrical.

---

## 18. Motion Design

Use motion only to communicate system state.

### Node discovery
Node fades and scales from 0.96 → 1.

### Edge discovery
Edge draws from source to target.

### Failure
A red pulse follows the failing path.

### Minimized failure
Non-essential mutation badges fade away one by one.

### Number changes
Use short count-up transitions.

---

## 19. Responsive Layout

### Desktop
Three-panel investigation layout.

### Tablet
Left navigation collapses; evidence panel becomes a drawer.

### Mobile
Graph becomes horizontally zoomable; evidence opens full-screen.

The hackathon demo should be optimized for desktop first.

---

## 20. Accessibility

- full keyboard navigation
- focus states
- reduced-motion preference
- semantic buttons
- accessible graph labels
- never communicate confidence only through color
- contrast ratio target suitable for dark UI

---

## 21. Design System Components

Build reusable primitives:

```text
AppShell
Sidebar
TopBar
Panel
MetricCard
StateNode
TransitionEdge
EvidenceDrawer
ExperimentRow
MutationCard
FailureCard
Timeline
ConfidenceBar
StatusBadge
ReplayButton
GraphToolbar
CommandPalette
```

---

## 22. Command Palette

Keyboard shortcut:

`Ctrl/Cmd + K`

Commands:

```text
Start investigation
Pause run
Open current state
Search state
Run Patient Zero
Replay failure
Export report
```

This makes the product feel like an engineering tool rather than a marketing site.

---

## 23. Final Demo Screen

After a successful run, show a concise summary:

```text
BLACK//BOX
INVESTIGATION COMPLETE

14 behavioral states discovered
31 transitions inferred
7 conditions hypothesized
3 failure scenarios found
1 minimal reproducer confirmed

[VIEW SYSTEM]
[RUN PATIENT ZERO]
[EXPORT REPORT]
```

Primary closing line:

> **THE SOURCE CODE WAS HIDDEN. THE BEHAVIOR WAS NOT.**

---

## 24. Landing Page Sections

1. Hero
2. “How it thinks” experiment loop
3. Live behavioral graph preview
4. Synthetic Patient Zero section
5. Evidence-first architecture
6. Use cases
7. Technical architecture
8. CTA

Keep the landing page concise; the application itself should carry the technical story.

---
