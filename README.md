<div align="center">
  <br />
  <h1>⬛ BLACK//BOX ⬛</h1>
  <p>
    <strong>Autonomous API Discovery & Intelligent Fuzzing Engine</strong>
  </p>
  <br />

  <p align="center">
    <a href="https://github.com/your-username/blackbox/issues"><img src="https://img.shields.io/github/issues/your-username/blackbox?style=for-the-badge&color=ef4444" alt="Issues" /></a>
    <a href="https://github.com/your-username/blackbox/pulls"><img src="https://img.shields.io/github/issues-pr/your-username/blackbox?style=for-the-badge&color=3b82f6" alt="Pull Requests" /></a>
    <a href="https://github.com/your-username/blackbox/blob/main/LICENSE"><img src="https://img.shields.io/github/license/your-username/blackbox?style=for-the-badge&color=10b981" alt="License" /></a>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  </p>
</div>

<hr />

## 🪐 Overview

**BLACK//BOX** is a next-generation security testing platform that autonomously maps out API perimeters, infers implicit state machines, and dynamically fuzzes endpoints to surface hidden vulnerabilities. 

Coupled with a **premium, glassmorphic UI**, the platform transforms complex vulnerability discovery into an intuitive, visually stunning experience.

---

## ✨ Key Features

- **🧠 State Machine Inference**  
  Automatically explores an API to uncover hidden states and transitions, building an accurate map of the target's underlying logic.

- **💥 Intelligent Mutation Engine**  
  Injects context-aware payloads, including JSON bombs, SQL injections, and buffer overflows, to stress-test target endpoints.

- **🔬 Delta Debugging (Crash Minimization)**  
  When an internal server error (500) is triggered, the engine automatically minimizes the sequence of requests to the exact reproducible steps that caused the crash.

- **⚡ Real-Time Telemetry**  
  Watch the engine map and attack the target in real-time via WebSocket streams, visualized in a high-end, responsive Next.js frontend.

---

## 🏗️ Architecture

BLACK//BOX is designed as a modern, decoupled monorepo:

### 1. The Engine (Backend)
- **FastAPI**: Asynchronous Python core powering the REST API and WebSockets.
- **State Matcher & Mutator**: The intelligent algorithms executing the fuzzing runs.
- **PostgreSQL & Redis**: Persistent storage and job queue management.

### 2. The Dashboard (Frontend)
- **Next.js 16 (App Router)**: High-performance React framework.
- **Framer Motion & GSAP**: Fluid animations and complex physics simulations.
- **Tailwind CSS**: Utility-first styling with custom glassmorphism, glowing neon borders, and dynamic noise filters.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Docker & Docker Compose](https://www.docker.com/)
- [Node.js (v20+)](https://nodejs.org/) & [pnpm](https://pnpm.io/)
- Python 3.10+

### Option 1: One-Click Docker Startup (Recommended)
The easiest way to start both the engine and the dashboard locally.

```bash
# Start the entire stack (Postgres, Redis, FastAPI, Next.js)
docker-compose up -d --build
```
> The dashboard will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

### Option 2: Manual Start

**1. Start the API (Backend)**
```bash
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. Start the Dashboard (Frontend)**
```bash
cd apps/web
pnpm install
pnpm run dev
```

---

## 🌍 Deployment

BLACK//BOX is configured for zero-configuration deployments using **Render** and **Vercel**.

### Deploying the Backend (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/).
3. Create a new **Blueprint** and connect your repository.
4. Render will automatically detect the `render.yaml` file, spin up a PostgreSQL 15 database, and deploy the FastAPI backend.

### Deploying the Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com/) and import your GitHub repository.
2. The project root is automatically configured via the `vercel.json` file.
3. Add the following **Environment Variables** in Vercel:
   - `NEXT_PUBLIC_API_URL`: *Your Render API URL (e.g., https://blackbox-api.onrender.com)*
   - `NEXT_PUBLIC_WS_URL`: *Your Render WebSocket URL (e.g., wss://blackbox-api.onrender.com)*
4. Deploy!

---

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

<br/>
<div align="center">
  <p><i>Engineered for the resilient.</i></p>
</div>
# blackbox
