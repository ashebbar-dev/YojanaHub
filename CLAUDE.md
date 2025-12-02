# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SchemeGraph** (YojanaHub) is a hackathon web application that helps Indian citizens discover and access government welfare schemes through intelligent graph-based eligibility matching. The application features adaptive questioning, life journey planning, scheme optimization, and explainable AI for eligibility determination.

**Success Criteria:** Modern UI, all 7 core features demonstrable, smooth demo flow, visible knowledge graph, and realistic data for 50+ schemes.

## Architecture

This is a **full-stack web application** with:

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** FastAPI (Python 3.11+) + SQLite database
- **Visualization:** React Flow (knowledge graphs) + Recharts (timelines/charts)
- **State Management:** Zustand (global state) + React Query (server state)
- **Deployment:** Vercel (frontend) + Railway/Render (backend)

### Stack Rationale

- **Next.js 14** chosen for fast setup, great DX, and built-in routing
- **FastAPI** chosen for quick API setup and algorithm-friendly Python
- **SQLite** chosen for zero config, portability, and fast read operations
- **shadcn/ui** chosen for beautiful pre-built components and rapid styling

## Project Structure

```
schemegraph/
├── frontend/                    # Next.js application
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── questions/         # Question flow
│   │   ├── results/           # Results page
│   │   ├── schemes/[id]/      # Scheme detail
│   │   └── dashboard/         # Leakage dashboard
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── SchemeCard.tsx
│   │   ├── JourneyTimeline.tsx
│   │   ├── GraphVisualization.tsx
│   │   └── ExplainabilityPanel.tsx
│   ├── lib/
│   │   ├── api.ts            # API client
│   │   ├── store.ts          # Zustand store
│   │   └── utils.ts
│   └── hooks/                # Custom React hooks
│
├── backend/                   # FastAPI application
│   ├── main.py               # FastAPI app entry point
│   ├── routers/              # API route handlers
│   │   ├── questions.py
│   │   ├── eligibility.py
│   │   ├── schemes.py
│   │   ├── journey.py
│   │   ├── optimizer.py
│   │   ├── graph.py
│   │   └── dashboard.py
│   ├── engine/               # Core algorithms
│   │   ├── eligibility.py    # Eligibility matching engine
│   │   ├── journey.py        # Life journey planner
│   │   ├── optimizer.py      # Scheme portfolio optimizer
│   │   └── graph_builder.py  # Knowledge graph construction
│   ├── models/
│   │   └── schemas.py        # Pydantic models
│   ├── database/
│   │   ├── connection.py
│   │   └── queries.py
│   └── data/
│       ├── schemes.db        # SQLite database
│       ├── seed_schemes.sql
│       └── seed_questions.sql
│
└── scripts/
    └── seed_database.py      # Database seeding script
```

## Development Commands

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev         # Development server on localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run linter
```

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate           # Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/seed_database.py    # Seed database with demo data
uvicorn main:app --reload          # Development server on localhost:8000
```

### Testing

```bash
# Test API endpoints
curl http://localhost:8000/api/v1/questions

# Test eligibility endpoint
curl -X POST http://localhost:8000/api/v1/eligibility \
  -H "Content-Type: application/json" \
  -d '{"attributes": {"state": "Jharkhand", "occupation": "Farmer", "bpl_status": true}}'
```

### Deployment

```bash
# Frontend (Vercel)
cd frontend
vercel --prod

# Backend (Railway)
cd backend
railway up
```

## Core Features (7 Must-Haves)

1. **Smart Question Flow** - Adaptive, minimal-question eligibility discovery
2. **Eligible Schemes Display** - List all matching schemes with confidence levels
3. **Life Journey Planner** - Visual timeline of benefits across life stages
4. **Scheme Stack Optimizer** - Conflict resolution and optimal portfolio selection
5. **Scheme Detail + Co-Pilot** - Document checklist, pre-filled form preview
6. **Explainable Eligibility** - Graph path + legal citation view
7. **Knowledge Graph Visualization** - Interactive graph explorer
8. **Leakage Dashboard** - Government/NGO view of unclaimed benefits

## Key Technologies & Libraries

### Frontend Dependencies

- `next@14.1.0` - React framework
- `react-flow@11.10.0` - Knowledge graph visualization
- `recharts@2.10.0` - Charts and timelines
- `zustand@4.5.0` - State management
- `@tanstack/react-query@5.17.0` - Server state management
- `react-hook-form@7.49.0` + `zod@3.22.0` - Form handling and validation
- `tailwindcss@3.4.0` - Styling
- `framer-motion@10.18.0` - Animations
- `lucide-react@0.309.0` - Icons

### Backend Dependencies

- `fastapi@0.109.0` - Web framework
- `uvicorn@0.27.0` - ASGI server
- `pydantic@2.5.0` - Data validation
- `networkx@3.2.1` - Graph algorithms
- `pulp@2.7.0` - Optimization algorithms
- `sqlalchemy@2.0.25` - ORM
- `aiosqlite@0.19.0` - Async SQLite

## Database Schema

The SQLite database is **denormalized for read-heavy operations** and includes:

- **schemes** - Government welfare schemes (50+ pre-seeded)
- **scheme_rules** - Eligibility conditions (hard/soft constraints)
- **scheme_documents** - Required documents per scheme
- **scheme_relations** - Relationships (CONFLICTS, DEPENDS, STACKS, UNLOCKS)
- **questions** - Adaptive question bank with information gain scores
- **personas** - Demo user profiles (Ramesh, Lakshmi, Arjun)
- **districts** - Demographic data for leakage calculations

### Key Relationship Types

- **CONFLICTS** - Schemes that cannot be claimed together (e.g., PM-KISAN vs state's MKAY-JH)
- **DEPENDS** - Prerequisites between schemes (e.g., Ujjwala depends on BPL card)
- **STACKS** - Schemes that can be combined (e.g., PM-KISAN + crop insurance)
- **UNLOCKS** - Schemes that enable others (e.g., BPL card unlocks Ujjwala)

## API Endpoints

Base URL: `/api/v1`

- **GET /questions** - Get ordered list of adaptive questions
- **POST /eligibility** - Calculate eligible schemes from user attributes
- **POST /journey** - Get life journey plan with timeline
- **POST /optimize** - Get optimized scheme portfolio (resolves conflicts)
- **GET /schemes/{id}** - Get detailed scheme info with co-pilot data
- **GET /schemes/{id}/explain** - Get eligibility explanation with graph path
- **GET /graph** - Get knowledge graph data for visualization
- **GET /personas** - Get demo personas
- **GET /personas/{id}** - Get persona with pre-filled attributes
- **GET /dashboard/leakage** - Get leakage statistics by district

## Core Algorithms

### 1. Eligibility Engine (`backend/engine/eligibility.py`)

Evaluates user attributes against scheme rules using:
- Hard constraints (must match) vs soft constraints (probabilistic)
- Confidence scoring (0.0-1.0)
- Returns schemes with matched/blocking conditions

### 2. Journey Planner (`backend/engine/journey.py`)

Creates life-stage timeline showing:
- Which schemes apply at different ages/life events
- Projected annual benefits over time
- Milestone-based scheme transitions

### 3. Scheme Optimizer (`backend/engine/optimizer.py`)

Uses constraint optimization (PuLP) to:
- Resolve conflicting schemes (pick higher value)
- Ensure dependencies are satisfied
- Maximize total benefit value
- Stack compatible schemes

### 4. Graph Builder (`backend/engine/graph_builder.py`)

Constructs knowledge graph using NetworkX:
- Nodes: User attributes, schemes, documents, benefits
- Edges: Eligibility rules, relationships
- Used for explainability and visualization

## Demo Personas (Pre-configured)

Three personas are pre-seeded for demonstrations:

1. **Ramesh Kumar** - 45yo male farmer, BPL, rural Jharkhand, daughter in Class 8
   - Expected: 12 schemes, ~₹52,000 annual value
   - Conflict: PM-KISAN vs MKAY-JH (optimizer picks MKAY-JH)

2. **Lakshmi Devi** - 38yo widow, urban Karnataka, SC, two children
   - Expected: 9 schemes focusing on widow pension + education scholarships

3. **Arjun Prasad** - 22yo SC engineering student, Bihar, family income ₹2L
   - Expected: 7 schemes, primarily education + skill development

## Design Principles

- **Bilingual** - Hindi/English toggle throughout
- **Accessible** - High contrast, large touch targets, screen reader friendly
- **Trust-building** - Government-inspired colors, official logos, legal citations
- **Mobile-first** - Responsive design for low-end devices
- **Delightful** - Subtle animations, progress indicators, celebration moments

## Out of Scope (Hackathon)

The following are **NOT** implemented in the hackathon version:

- User authentication/accounts (demo mode only)
- Real payment/application integrations
- DigiLocker integration
- Mobile app (web responsive only)
- WhatsApp/IVR channels
- Admin panel for scheme management
- Real gazette parsing pipeline
- Outcome feedback collection

## Important Notes

- All data is **pre-seeded** in SQLite - no real-time data fetching
- No backend processing should take >500ms for demo smoothness
- Graph visualization should limit visible nodes to prevent performance issues
- The database uses **denormalized schema** optimized for read operations
- Legal citations and scheme data are simplified for demo purposes
