# Standalone Decoupled Architecture: DukaanSense Rebuild

**Target Phase**: Production Hardening & Cloud Infrastructure  
**Recommended Stack**: Decoupled Monorepo (Node.js/Express TypeScript + PostgreSQL + Redis + React/Vite)

---

## 1. High-Level Target Topology

```mermaid
graph TD
    subgraph Client Layer
        POS[Counter POS Terminal / Browser]
        Mobile[Merchant Mobile PWA]
    end

    subgraph CDN & Gateway Layer
        CDN[Cloudflare CDN & Edge Proxy]
        LB[Load Balancer / Nginx Reverse Proxy]
    end

    subgraph Application Cluster
        API1[Express API Worker 1]
        API2[Express API Worker 2]
    end

    subgraph Cache & Message Broker
        Redis[(Redis 7: Session Store & Cache)]
    end

    subgraph Persistent Storage
        PG[(PostgreSQL 16 Multi-Tenant DB with RLS)]
    end

    subgraph External Integrations
        Gemini[Google Gemini 2.5 Flash API]
        WA[WhatsApp Cloud API / Web Links]
        OAuth[Google Identity Provider]
    end

    Client Layer --> CDN
    CDN --> LB
    LB --> API1 & API2
    API1 & API2 <--> Redis
    API1 & API2 <--> PG
    API1 & API2 --> Gemini
    API1 & API2 --> OAuth
    POS --> WA
```

---

## 2. Component Decoupling Strategy

| Component | Prototype Implementation `[VERIFIED]` | Target Production Standalone `[INFERRED]` |
|---|---|---|
| **Data Persistence** | In-memory JavaScript arrays in `store.js` | PostgreSQL 16 with ACID transactions and Row-Level Security (RLS). |
| **Backend Runtime** | ES Modules `server.js` with Express 5 | TypeScript + Express/Fastify with Zod schema validation. |
| **Frontend Framework**| Vanilla JS (`app.js`, `dashboard.js`, etc.) | React 19 + Vite (or Next.js App Router) with Type-safe API client. |
| **CSS Styling** | Hand-crafted Vanilla CSS design system | Preserved exact tokens via CSS Modules or Vanilla Extract. |
| **Session Cache** | Memory state | Redis cluster for session tokens, daily action cache, and rate limiting. |
| **AI Integration** | Synchronous REST endpoints | Server-Sent Events (SSE) streaming for real-time Co-pilot responses. |
| **Concurrency Control**| Sequential JS array push | PostgreSQL row locks (`SELECT ... FOR UPDATE`) during billing and checkout. |

---

## 3. Deployment Architecture

### 3.1 Containerization (Dockerfile)
```dockerfile
# Multi-stage production build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
```

### 3.2 Environment Topology
- **Development**: Local Node.js server, local Dockerized PostgreSQL (`postgres:16-alpine`), local Redis.
- **Production**:
  - Compute: Managed Kubernetes (GKE) or Fly.io / Render container instances.
  - Database: AWS RDS PostgreSQL or Supabase Managed Postgres.
  - Caching: Upstash Redis or AWS ElastiCache.
  - Monitoring: OpenTelemetry + Prometheus + Grafana.
