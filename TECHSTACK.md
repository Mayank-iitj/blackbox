# BLACK BOX + SYNTHETIC PATIENT ZERO
## Recommended Technology Stack

## 1. Architecture Choice

Use a **TypeScript frontend + Python experiment engine**.

Reason: the frontend needs strong interaction and visualization libraries, while Python makes rapid experimentation, HTTP/browser automation, graph analytics, scientific utilities, and mutation logic easy to build.

---

## 2. Frontend

### Framework
**Next.js + React + TypeScript**

Use the App Router and server/client boundaries cleanly.

### UI
- Tailwind CSS
- shadcn/ui
- Radix primitives
- Lucide icons

### Visualization
- React Flow for state machine graphs
- D3 for custom graph/math visuals where required
- Recharts for metrics
- Framer Motion for transitions

### Code/JSON views
- Monaco Editor for request/response inspection
- syntax highlighting for JSON, HTTP, headers

### Form/state
- React Hook Form
- Zod
- Zustand for local workspace/graph interaction state

---

## 3. Backend

### API
**FastAPI + Python**

Why:
- async HTTP support
- typed schemas
- fast iteration
- excellent fit for experiment workers
- straightforward OpenAPI generation

### Validation
- Pydantic

### HTTP
- httpx

### Browser automation
- Playwright

### Graph
- NetworkX

### Parsing
- Python standard parsing + structured parsers for HAR/OpenAPI/Docker manifests

### Async jobs
Hackathon:
- Redis + lightweight worker process

Later:
- Celery / Dramatiq / Temporal depending on scale

---

## 4. Database

### PostgreSQL
Primary system database.

Recommended hosted option:
**Supabase Postgres**

Use relational storage for:
- workspaces
- targets
- experiment runs
- observations
- states
- transitions
- failure cases

Keep graph relationships relational first; do not introduce a graph database in the MVP.

---

## 5. Object Storage

Use S3-compatible storage or Supabase Storage for:
- HAR files
- generated reports
- large evidence payloads
- replay bundles

Do not store large raw artifacts directly inside PostgreSQL.

---

## 6. Authentication

Supabase Auth is sufficient for the MVP.

Support:
- email/password
- Google OAuth

Workspace-level authorization should be enforced in the backend, not trusted to the frontend.

---

## 7. AI Layer

Make the AI provider swappable.

Recommended interface:

```python
class ReasoningProvider(Protocol):
    async def summarize_state(self, evidence): ...
    async def explain_transition(self, evidence): ...
    async def explain_failure(self, evidence): ...
```

Possible providers:
- Gemini
- OpenAI
- other OpenAI-compatible provider

The engine remains usable when the provider is unavailable.

---

## 8. Security Stack

- Pydantic validation
- strict target allowlists
- outbound request proxy
- SSRF filtering
- request budgets
- rate limiting
- secret redaction
- audit logs
- HTTPS

For isolated test environments, run a dedicated worker/container with no access to internal infrastructure beyond the explicitly configured target.

---

## 9. Observability

- structured JSON logging
- OpenTelemetry
- Sentry for frontend/backend exceptions
- simple metrics endpoint

Key metrics:
- experiments/minute
- probe failures
- average probe latency
- inference latency
- worker queue depth
- active runs
- replay success rate

---

## 10. Deployment

### Fastest hackathon deployment

```text
Web      → Vercel
API      → Render / Railway
Database → Supabase
Redis    → managed Redis
Storage  → Supabase Storage
```

### Production path

```text
CDN / Edge
    ↓
Next.js
    ↓
API Gateway
    ↓
Experiment Orchestrator
    ↓
Worker Pool
    ├── API Adapter
    ├── Browser Adapter
    └── Fault Simulation Worker
    ↓
PostgreSQL + Object Storage
```

---

## 11. Why Not Use a Graph Database Yet?

A graph database sounds attractive, but it adds operational and modeling complexity.

For the MVP, PostgreSQL can store:

```text
states
transitions
observations
relationships
```

and React Flow can render the graph.

Introduce Neo4j only when cross-project dependency queries become a demonstrated bottleneck.

---

## 12. Technology Decisions

| Layer | Choice | Reason |
|---|---|---|
| Web | Next.js | Fast product UI + deployment |
| Language | TypeScript | Type-safe frontend |
| API | FastAPI | Async, typed, rapid development |
| Engine | Python | Graph + testing ecosystem |
| DB | PostgreSQL | Strong relational model |
| Hosted DB | Supabase | Auth + DB + storage |
| Queue | Redis | Lightweight orchestration |
| Browser | Playwright | Reliable automation |
| Graph | NetworkX | Fast inference prototyping |
| Visual graph | React Flow | Interactive state machine |
| Motion | Framer Motion | Product polish |
| AI | Provider abstraction | Avoid vendor lock-in |
| Deploy | Vercel + Render/Railway | Fast hackathon launch |

---

## 13. Environment Variables

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
REDIS_URL=
AI_PROVIDER=
AI_API_KEY=
STORAGE_BUCKET=
TARGET_PROXY_URL=
SENTRY_DSN=
```

Never expose service-role credentials or worker secrets to the browser.

---
