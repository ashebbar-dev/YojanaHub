SchemeGraph: Technical Design Document (TDD)
Hackathon Edition — Web Application

Document Control
AttributeValueProject NameSchemeGraphDocument TypeTechnical Design Document (Hackathon MVP)Target DeliverableFully functional web application with demo-ready featuresTimelineHackathon duration (24-48 hours typical)Primary GoalBeautiful UI + All core functionalities demonstrable

Table of Contents

1. Executive Summary
2. Scope Definition
3. Feature Prioritization Matrix
4. System Architecture
5. Technology Stack
6. Database Design
7. API Specification
8. Frontend Design System
9. Core Algorithm Implementation
10. Screen-by-Screen Specification
11. Demo Data Strategy
12. Development Phases & Timeline
13. Deployment Strategy
14. Risk Mitigation
15. Post-Hackathon Roadmap


1. Executive Summary
What We're Building
A single-page web application that demonstrates SchemeGraph's core value proposition: transforming how citizens discover and access government welfare schemes through intelligent graph-based eligibility matching.
Hackathon Success Criteria
CriteriaTargetVisual ImpactModern, polished UI that impresses judges in first 10 secondsFeature CompletenessAll 7 core features demonstrable end-to-endDemo FlowSmooth 5-7 minute walkthrough without errorsTechnical DepthKnowledge graph visible; algorithm explainableData Realism50+ real schemes; 3 compelling user personas
What We're NOT Building (Hackathon Scope)

* Mobile app (web responsive is sufficient)
* User authentication/accounts (demo mode only)
* Real payment/application integrations
* WhatsApp/IVR channels
* Admin panel for scheme management
* Production-grade security


2. Scope Definition
In-Scope Features (Must Have)
#FeatureDemo Purpose1Smart Question FlowShow adaptive, minimal-question eligibility discovery2Eligible Schemes DisplayList all matching schemes with confidence levels3Life Journey PlannerVisual timeline of benefits across life stages4Scheme Stack OptimizerShow conflict resolution and optimal portfolio5Scheme Detail + Co-PilotDocument checklist, pre-filled form preview6Explainable EligibilityGraph path + legal citation view7Knowledge Graph VisualizationInteractive graph explorer8Leakage DashboardGovernment/NGO view of unclaimed benefits
Out-of-Scope (Post-Hackathon)

* Real gazette parsing pipeline
* DigiLocker integration
* Actual form submission
* User accounts and saved progress
* Outcome feedback collection
* Multi-language voice interface

Demo Personas (Pre-configured)
PersonaProfileExpected SchemesRamesh45, Male, Farmer, BPL, Rural Jharkhand, Daughter in Class 812 schemesLakshmi38, Female, Widow, Urban Karnataka, Two children9 schemesArjun22, Male, SC, Engineering student, Family income < 2.5L7 schemes

3. Feature Prioritization Matrix
MoSCoW Analysis for Hackathon
PriorityFeaturesEffortImpactMust HaveQuestion Flow, Scheme List, Journey Timeline, Graph VizHighCriticalShould HaveOptimizer, Co-Pilot, ExplainabilityMediumHighCould HaveLeakage Dashboard, Document OCR simulationLowMediumWon't HaveAuth, Real integrations, Admin panel--
Feature Dependencies
┌─────────────────────────────────────────────────────────────────┐
│                    FEATURE DEPENDENCY GRAPH                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐                                              │
│   │   Database   │◄─────────────────────────────────────┐       │
│   │   (Schemes + │                                      │       │
│   │    Rules)    │                                      │       │
│   └──────┬───────┘                                      │       │
│          │                                              │       │
│          ▼                                              │       │
│   ┌──────────────┐      ┌──────────────┐               │       │
│   │  Eligibility │─────▶│   Scheme     │               │       │
│   │    Engine    │      │    List      │               │       │
│   └──────┬───────┘      └──────┬───────┘               │       │
│          │                     │                        │       │
│          │    ┌────────────────┼────────────────┐      │       │
│          │    │                │                │      │       │
│          ▼    ▼                ▼                ▼      │       │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐       │
│   │   Question   │   │   Journey    │   │  Optimizer   │       │
│   │    Flow      │   │   Planner    │   │              │       │
│   └──────────────┘   └──────────────┘   └──────────────┘       │
│                             │                │                  │
│                             ▼                ▼                  │
│                      ┌──────────────┐ ┌──────────────┐          │
│                      │  Graph Viz   │ │   Co-Pilot   │          │
│                      └──────────────┘ └──────────────┘          │
│                                              │                  │
│                                              ▼                  │
│                                       ┌──────────────┐          │
│                                       │Explainability│          │
│                                       └──────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


4. System Architecture
High-Level Architecture (Hackathon)
┌─────────────────────────────────────────────────────────────────────────┐
│                     SCHEMEGRAPH - HACKATHON ARCHITECTURE                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                         FRONTEND                                │   │
│   │                     (Next.js + React)                           │   │
│   │                                                                 │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│   │  │  Home   │ │Questions│ │ Results │ │ Journey │ │Dashboard│   │   │
│   │  │  Page   │ │  Flow   │ │  Page   │ │  View   │ │  View   │   │   │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│   │                                                                 │   │
│   │  ┌───────────────────────────────────────────────────────────┐ │   │
│   │  │                    SHARED COMPONENTS                      │ │   │
│   │  │  • SchemeCard  • GraphViewer  • Timeline  • FormPreview   │ │   │
│   │  └───────────────────────────────────────────────────────────┘ │   │
│   └─────────────────────────────────┬───────────────────────────────┘   │
│                                     │                                   │
│                                     │ REST API                          │
│                                     ▼                                   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                          BACKEND                                │   │
│   │                    (FastAPI / Python)                           │   │
│   │                                                                 │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │   │
│   │  │ Eligibility │  │  Journey    │  │  Optimizer  │             │   │
│   │  │   Engine    │  │  Planner    │  │   Engine    │             │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘             │   │
│   │                                                                 │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │   │
│   │  │   Graph     │  │  Question   │  │  Leakage    │             │   │
│   │  │  Queries    │  │  Selector   │  │  Calculator │             │   │
│   │  └─────────────┘  └─────────────┘  └─────────────┘             │   │
│   └─────────────────────────────────┬───────────────────────────────┘   │
│                                     │                                   │
│                                     ▼                                   │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                         DATA LAYER                              │   │
│   │                                                                 │   │
│   │  ┌─────────────────────┐    ┌─────────────────────┐            │   │
│   │  │   SQLite / JSON     │    │   Static Assets     │            │   │
│   │  │   (Scheme Data)     │    │   (Demo Content)    │            │   │
│   │  │                     │    │                     │            │   │
│   │  │  • 50+ Schemes      │    │  • Form templates   │            │   │
│   │  │  • Eligibility rules│    │  • Legal citations  │            │   │
│   │  │  • Relationships    │    │  • Persona profiles │            │   │
│   │  └─────────────────────┘    └─────────────────────┘            │   │
│   │                                                                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Simplified Stack Rationale
LayerChoiceRationale for HackathonFrontendNext.js 14 + TypeScriptFast setup, great DX, built-in routingUI LibraryTailwind CSS + shadcn/uiBeautiful components, rapid stylingVisualizationReact Flow + RechartsGraph viz + charts out of boxBackendFastAPI (Python)Quick API setup, algorithm-friendlyDatabaseSQLite + JSON filesZero config, portable, fastDeploymentVercel (FE) + Railway/Render (BE)Free tier, instant deploys

5. Technology Stack
Complete Stack Specification
yamlDownloadCopy code# FRONTEND
framework: Next.js 14 (App Router)
language: TypeScript 5.x
styling:
  - Tailwind CSS 3.4
  - shadcn/ui (Radix primitives)
  - Framer Motion (animations)
visualization:
  - React Flow (knowledge graph)
  - Recharts (charts/timelines)
  - Lucide React (icons)
state_management: 
  - Zustand (global state)
  - React Query (server state)
forms: React Hook Form + Zod

# BACKEND  
framework: FastAPI 0.109+
language: Python 3.11+
key_libraries:
  - Pydantic (validation)
  - NetworkX (graph algorithms)
  - PuLP (optimization)
  - SQLAlchemy (ORM, optional)
database: SQLite 3

# DEPLOYMENT
frontend: Vercel
backend: Railway / Render
Package.json (Frontend)
jsonDownloadCopy code{
  "name": "schemegraph-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-progress": "^1.0.3",
    "reactflow": "^11.10.0",
    "recharts": "^2.10.0",
    "framer-motion": "^10.18.0",
    "lucide-react": "^0.309.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
Requirements.txt (Backend)
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.0
python-multipart==0.0.6
networkx==3.2.1
pulp==2.7.0
sqlalchemy==2.0.25
aiosqlite==0.19.0
httpx==0.26.0
python-dotenv==1.0.0


6. Database Design
Overview
For hackathon simplicity, we use SQLite with a denormalized schema optimized for read-heavy operations. All data is pre-seeded.
Entity Relationship Diagram
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA (SQLite)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────┐         ┌─────────────────────┐               │
│  │      SCHEMES        │         │   SCHEME_RULES      │               │
│  ├─────────────────────┤         ├─────────────────────┤               │
│  │ id (PK)             │───┐     │ id (PK)             │               │
│  │ name                │   │     │ scheme_id (FK)      │───────────────┤
│  │ name_hindi          │   │     │ attribute           │               │
│  │ ministry            │   │     │ operator            │               │
│  │ description         │   │     │ value               │               │
│  │ description_hindi   │   │     │ is_hard_constraint  │               │
│  │ benefit_type        │   │     └─────────────────────┘               │
│  │ benefit_value       │   │                                           │
│  │ benefit_frequency   │   │     ┌─────────────────────┐               │
│  │ life_stages (JSON)  │   │     │ SCHEME_DOCUMENTS    │               │
│  │ application_url     │   │     ├─────────────────────┤               │
│  │ application_mode    │   │     │ id (PK)             │               │
│  │ deadline            │   └────▶│ scheme_id (FK)      │               │
│  │ legal_citation      │         │ document_name       │               │
│  │ icon                │         │ is_mandatory        │               │
│  └─────────────────────┘         │ how_to_obtain       │               │
│                                  └─────────────────────┘               │
│                                                                         │
│  ┌─────────────────────┐         ┌─────────────────────┐               │
│  │ SCHEME_RELATIONS    │         │   QUESTIONS         │               │
│  ├─────────────────────┤         ├─────────────────────┤               │
│  │ id (PK)             │         │ id (PK)             │               │
│  │ scheme_id_1 (FK)    │         │ attribute           │               │
│  │ scheme_id_2 (FK)    │         │ text_en             │               │
│  │ relation_type       │         │ text_hi             │               │
│  │ (CONFLICTS/DEPENDS/ │         │ input_type          │               │
│  │  STACKS/UNLOCKS)    │         │ options (JSON)      │               │
│  └─────────────────────┘         │ priority            │               │
│                                  │ information_gain    │               │
│                                  └─────────────────────┘               │
│                                                                         │
│  ┌─────────────────────┐         ┌─────────────────────┐               │
│  │     PERSONAS        │         │   DISTRICTS         │               │
│  ├─────────────────────┤         ├─────────────────────┤               │
│  │ id (PK)             │         │ id (PK)             │               │
│  │ name                │         │ name                │               │
│  │ attributes (JSON)   │         │ state               │               │
│  │ story               │         │ population          │               │
│  │ expected_schemes    │         │ bpl_percentage      │               │
│  └─────────────────────┘         │ scheme_stats (JSON) │               │
│                                  └─────────────────────┘               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

SQL Schema Definition
sqlDownloadCopy code-- schemes.sql

-- Core Schemes Table
CREATE TABLE schemes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_hindi TEXT,
    ministry TEXT NOT NULL,
    description TEXT NOT NULL,
    description_hindi TEXT,
    benefit_type TEXT CHECK(benefit_type IN ('cash', 'kind', 'service', 'loan', 'insurance')),
    benefit_value INTEGER, -- in INR, NULL if not monetary
    benefit_frequency TEXT CHECK(benefit_frequency IN ('one_time', 'monthly', 'quarterly', 'annual')),
    life_stages TEXT, -- JSON array: ["child", "youth", "working_age", "elderly"]
    trigger_events TEXT, -- JSON array: ["birth", "marriage", "death", "job_loss"]
    application_url TEXT,
    application_mode TEXT CHECK(application_mode IN ('online', 'offline', 'csc', 'both')),
    deadline TEXT, -- NULL if open enrollment
    legal_citation TEXT,
    icon TEXT, -- emoji or icon name
    category TEXT,
    state TEXT, -- NULL for central schemes
    is_active INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eligibility Rules
CREATE TABLE scheme_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheme_id TEXT NOT NULL REFERENCES schemes(id),
    attribute TEXT NOT NULL, -- e.g., 'income', 'gender', 'state'
    operator TEXT NOT NULL CHECK(operator IN ('eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in', 'not_in', 'exists')),
    value TEXT NOT NULL, -- JSON-encoded value
    is_hard_constraint INTEGER DEFAULT 1, -- 0 for soft/probabilistic
    description TEXT
);

-- Required Documents
CREATE TABLE scheme_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheme_id TEXT NOT NULL REFERENCES schemes(id),
    document_name TEXT NOT NULL,
    document_name_hindi TEXT,
    is_mandatory INTEGER DEFAULT 1,
    how_to_obtain TEXT,
    typical_time TEXT -- e.g., "3-5 days"
);

-- Scheme Relationships (Conflicts, Dependencies, etc.)
CREATE TABLE scheme_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheme_id_1 TEXT NOT NULL REFERENCES schemes(id),
    scheme_id_2 TEXT NOT NULL REFERENCES schemes(id),
    relation_type TEXT NOT NULL CHECK(relation_type IN ('conflicts', 'depends', 'stacks', 'unlocks', 'supersedes')),
    description TEXT
);

-- Questions for Adaptive Flow
CREATE TABLE questions (
    id TEXT PRIMARY KEY,
    attribute TEXT NOT NULL UNIQUE,
    text_en TEXT NOT NULL,
    text_hi TEXT NOT NULL,
    input_type TEXT CHECK(input_type IN ('select', 'radio', 'number', 'text', 'boolean')),
    options TEXT, -- JSON array for select/radio
    priority INTEGER DEFAULT 50, -- higher = ask earlier
    information_gain REAL DEFAULT 0.5 -- calculated metric
);

-- Demo Personas
CREATE TABLE personas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_hindi TEXT,
    age INTEGER,
    avatar_url TEXT,
    attributes TEXT NOT NULL, -- JSON object
    story TEXT,
    story_hindi TEXT,
    expected_scheme_count INTEGER
);

-- District Statistics (for Leakage Dashboard)
CREATE TABLE districts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    population INTEGER,
    bpl_population INTEGER,
    farmer_population INTEGER,
    scheme_stats TEXT -- JSON: {"scheme_id": {"eligible": 1000, "enrolled": 500}}
);

-- Indexes for Performance
CREATE INDEX idx_scheme_rules_scheme ON scheme_rules(scheme_id);
CREATE INDEX idx_scheme_rules_attribute ON scheme_rules(attribute);
CREATE INDEX idx_scheme_docs_scheme ON scheme_documents(scheme_id);
CREATE INDEX idx_scheme_relations_scheme1 ON scheme_relations(scheme_id_1);
CREATE INDEX idx_scheme_relations_scheme2 ON scheme_relations(scheme_id_2);
Sample Seed Data
sqlDownloadCopy code-- seed_data.sql

-- Sample Schemes
INSERT INTO schemes (id, name, name_hindi, ministry, description, benefit_type, benefit_value, benefit_frequency, life_stages, application_mode, icon, category, state) VALUES
('pm_kisan', 'PM-KISAN Samman Nidhi', 'पीएम-किसान सम्मान निधि', 'Ministry of Agriculture', 'Income support of ₹6,000 per year to all landholding farmer families', 'cash', 6000, 'annual', '["working_age"]', 'online', '🌾', 'Agriculture', NULL),
('ayushman_bharat', 'Ayushman Bharat PMJAY', 'आयुष्मान भारत', 'Ministry of Health', 'Health insurance coverage of ₹5 lakh per family per year', 'insurance', 500000, 'annual', '["child", "youth", "working_age", "elderly"]', 'both', '🏥', 'Health', NULL),
('ujjwala', 'PM Ujjwala Yojana', 'प्रधानमंत्री उज्ज्वला योजना', 'Ministry of Petroleum', 'Free LPG connection to BPL households', 'kind', 1600, 'one_time', '["working_age"]', 'offline', '🔥', 'Energy', NULL),
('pmay_g', 'PM Awas Yojana (Gramin)', 'प्रधानमंत्री आवास योजना ग्रामीण', 'Ministry of Rural Development', 'Financial assistance for construction of pucca house', 'cash', 120000, 'one_time', '["working_age"]', 'csc', '🏠', 'Housing', NULL),
('nsp_postmatric', 'Post-Matric Scholarship', 'पोस्ट-मैट्रिक छात्रवृत्ति', 'Ministry of Social Justice', 'Scholarship for SC/ST/OBC students in post-matric education', 'cash', 12000, 'annual', '["youth"]', 'online', '🎓', 'Education', NULL),
('widow_pension_jh', 'Widow Pension (Jharkhand)', 'विधवा पेंशन (झारखंड)', 'Social Welfare Dept, Jharkhand', 'Monthly pension for widows', 'cash', 12000, 'annual', '["working_age", "elderly"]', 'offline', '👩', 'Social Security', 'Jharkhand'),
('kisan_credit_card', 'Kisan Credit Card', 'किसान क्रेडिट कार्ड', 'Ministry of Agriculture', 'Credit facility for farmers at subsidized interest rates', 'loan', 300000, 'annual', '["working_age"]', 'both', '💳', 'Agriculture', NULL),
('pmfby', 'PM Fasal Bima Yojana', 'प्रधानमंत्री फसल बीमा योजना', 'Ministry of Agriculture', 'Crop insurance at subsidized premium', 'insurance', 200000, 'annual', '["working_age"]', 'both', '🌱', 'Agriculture', NULL),
('mkay_jh', 'Mukhyamantri Krishi Ashirwad', 'मुख्यमंत्री कृषि आशीर्वाद', 'Agriculture Dept, Jharkhand', '₹5000 per acre for small farmers', 'cash', 25000, 'annual', '["working_age"]', 'online', '🚜', 'Agriculture', 'Jharkhand'),
('atal_pension', 'Atal Pension Yojana', 'अटल पेंशन योजना', 'Ministry of Finance', 'Pension scheme for unorganized sector workers', 'cash', 60000, 'annual', '["elderly"]', 'both', '👴', 'Social Security', NULL);

-- Sample Rules for PM-KISAN
INSERT INTO scheme_rules (scheme_id, attribute, operator, value, is_hard_constraint, description) VALUES
('pm_kisan', 'occupation', 'in', '["farmer", "agricultural_laborer"]', 1, 'Must be engaged in farming'),
('pm_kisan', 'has_cultivable_land', 'eq', 'true', 1, 'Must have cultivable land'),
('pm_kisan', 'is_institutional_landholder', 'eq', 'false', 1, 'Not institutional landholder'),
('pm_kisan', 'income_tax_payer', 'eq', 'false', 1, 'Should not be income tax payer');

-- Sample Rules for Ayushman Bharat
INSERT INTO scheme_rules (scheme_id, attribute, operator, value, is_hard_constraint, description) VALUES
('ayushman_bharat', 'secc_deprivation', 'gte', '1', 0, 'Based on SECC deprivation criteria'),
('ayushman_bharat', 'bpl_status', 'eq', 'true', 0, 'BPL status increases eligibility');

-- Sample Rules for Ujjwala
INSERT INTO scheme_rules (scheme_id, attribute, operator, value, is_hard_constraint, description) VALUES
('ujjwala', 'bpl_status', 'eq', 'true', 1, 'Must be BPL'),
('ujjwala', 'gender', 'eq', 'female', 1, 'Connection in woman''s name'),
('ujjwala', 'has_lpg_connection', 'eq', 'false', 1, 'Should not have existing LPG');

-- Sample Scheme Relations
INSERT INTO scheme_relations (scheme_id_1, scheme_id_2, relation_type, description) VALUES
('pm_kisan', 'mkay_jh', 'conflicts', 'Cannot avail both PM-KISAN and state''s Krishi Ashirwad'),
('ujjwala', 'bpl_card', 'depends', 'BPL card required for Ujjwala'),
('pm_kisan', 'pmfby', 'stacks', 'Can avail both income support and crop insurance'),
('bpl_card', 'ujjwala', 'unlocks', 'BPL card enables Ujjwala eligibility');

-- Sample Documents
INSERT INTO scheme_documents (scheme_id, document_name, document_name_hindi, is_mandatory, how_to_obtain) VALUES
('pm_kisan', 'Aadhaar Card', 'आधार कार्ड', 1, 'Visit nearest Aadhaar center'),
('pm_kisan', 'Land Records (Khatiyan)', 'भूमि अभिलेख', 1, 'From Circle Office or online'),
('pm_kisan', 'Bank Passbook', 'बैंक पासबुक', 1, 'From your bank'),
('ujjwala', 'BPL Card', 'बीपीएल कार्ड', 1, 'From Block Development Office'),
('ujjwala', 'Aadhaar Card', 'आधार कार्ड', 1, 'Visit nearest Aadhaar center'),
('ujjwala', 'Passport Photo', 'पासपोर्ट फोटो', 1, 'Any photo studio');

-- Sample Questions
INSERT INTO questions (id, attribute, text_en, text_hi, input_type, options, priority, information_gain) VALUES
('q_state', 'state', 'Which state do you live in?', 'आप किस राज्य में रहते हैं?', 'select', '["Jharkhand", "Bihar", "Odisha", "Uttar Pradesh", "Madhya Pradesh", "Karnataka", "Other"]', 100, 0.9),
('q_area', 'area_type', 'Do you live in a rural or urban area?', 'आप ग्रामीण या शहरी क्षेत्र में रहते हैं?', 'radio', '["Rural", "Urban"]', 95, 0.7),
('q_gender', 'gender', 'What is your gender?', 'आपका लिंग क्या है?', 'radio', '["Male", "Female", "Other"]', 90, 0.5),
('q_age', 'age', 'What is your age?', 'आपकी उम्र क्या है?', 'number', NULL, 85, 0.6),
('q_occupation', 'occupation', 'What is your primary occupation?', 'आपका मुख्य व्यवसाय क्या है?', 'select', '["Farmer", "Agricultural Laborer", "Daily Wage Worker", "Small Business", "Employed", "Student", "Homemaker", "Unemployed", "Other"]', 80, 0.85),
('q_bpl', 'bpl_status', 'Do you have a BPL (Below Poverty Line) card?', 'क्या आपके पास बीपीएल कार्ड है?', 'radio', '["Yes", "No", "Not Sure"]', 75, 0.8),
('q_income', 'annual_income', 'What is your approximate annual family income?', 'आपकी वार्षिक पारिवारिक आय लगभग कितनी है?', 'select', '["Less than ₹1 Lakh", "₹1-2.5 Lakh", "₹2.5-5 Lakh", "More than ₹5 Lakh", "Not Sure"]', 70, 0.75),
('q_caste', 'caste_category', 'What is your caste category?', 'आपकी जाति श्रेणी क्या है?', 'select', '["General", "OBC", "SC", "ST", "Prefer not to say"]', 65, 0.6),
('q_children', 'has_school_children', 'Do you have children studying in school/college?', 'क्या आपके बच्चे स्कूल/कॉलेज में पढ़ते हैं?', 'radio', '["Yes", "No"]', 60, 0.5),
('q_marital', 'marital_status', 'What is your marital status?', 'आपकी वैवाहिक स्थिति क्या है?', 'select', '["Married", "Unmarried", "Widowed", "Divorced", "Separated"]', 55, 0.4);

-- Sample Personas
INSERT INTO personas (id, name, name_hindi, age, attributes, story, expected_scheme_count) VALUES
('ramesh', 'Ramesh Kumar', 'रमेश कुमार', 45, '{"state": "Jharkhand", "area_type": "Rural", "gender": "Male", "occupation": "Farmer", "bpl_status": true, "annual_income": "Less than ₹1 Lakh", "caste_category": "OBC", "has_school_children": true, "marital_status": "Married", "has_cultivable_land": true, "daughter_class": 8}', 'Ramesh is a 45-year-old farmer in rural Jharkhand. He has a BPL card and owns 2 acres of land. His daughter Priya is in Class 8. Despite being eligible for multiple schemes, he only knows about PM-KISAN.', 12),
('lakshmi', 'Lakshmi Devi', 'लक्ष्मी देवी', 38, '{"state": "Karnataka", "area_type": "Urban", "gender": "Female", "occupation": "Homemaker", "bpl_status": true, "annual_income": "Less than ₹1 Lakh", "caste_category": "SC", "has_school_children": true, "marital_status": "Widowed", "children_count": 2}', 'Lakshmi is a 38-year-old widow in Bangalore. After her husband''s death, she struggles to support her two children. She is unaware of widow pension and educational scholarships.', 9),
('arjun', 'Arjun Prasad', 'अर्जुन प्रसाद', 22, '{"state": "Bihar", "area_type": "Rural", "gender": "Male", "occupation": "Student", "bpl_status": false, "annual_income": "₹1-2.5 Lakh", "caste_category": "SC", "education_level": "Engineering", "marital_status": "Unmarried"}', 'Arjun is a 22-year-old engineering student from a lower-middle-class SC family in Bihar. He is looking for scholarships to fund his education.', 7);

-- Sample District Data
INSERT INTO districts (id, name, state, population, bpl_population, farmer_population, scheme_stats) VALUES
('ranchi', 'Ranchi', 'Jharkhand', 2914253, 728563, 450000, '{"pm_kisan": {"eligible": 124000, "enrolled": 89000}, "ayushman_bharat": {"eligible": 450000, "enrolled": 320000}, "widow_pension_jh": {"eligible": 8200, "enrolled": 3100}}'),
('patna', 'Patna', 'Bihar', 5838465, 1167693, 320000, '{"pm_kisan": {"eligible": 98000, "enrolled": 72000}, "ayushman_bharat": {"eligible": 620000, "enrolled": 410000}}');

7. API Specification
Base Configuration
Base URL: /api/v1
Content-Type: application/json

Endpoints Overview
MethodEndpointDescriptionGET/questionsGet ordered list of questionsPOST/eligibilityCalculate eligible schemesPOST/journeyGet life journey planPOST/optimizeGet optimized scheme portfolioGET/schemes/{id}Get scheme details with co-pilot infoGET/schemes/{id}/explainGet eligibility explanationGET/graphGet knowledge graph data for visualizationGET/personasGet demo personasGET/personas/{id}Get persona with pre-filled attributesGET/dashboard/leakageGet leakage statistics
Detailed API Specification
1. GET /questions
Returns ordered questions for adaptive eligibility flow.
Response:
jsonDownloadCopy code{
  "questions": [
    {
      "id": "q_state",
      "attribute": "state",
      "text": {
        "en": "Which state do you live in?",
        "hi": "आप किस राज्य में रहते हैं?"
      },
      "input_type": "select",
      "options": [
        {"value": "Jharkhand", "label": {"en": "Jharkhand", "hi": "झारखंड"}},
        {"value": "Bihar", "label": {"en": "Bihar", "hi": "बिहार"}}
      ],
      "priority": 100
    }
  ],
  "total_questions": 10
}
2. POST /eligibility
Calculate eligible schemes based on user attributes.
Request:
jsonDownloadCopy code{
  "attributes": {
    "state": "Jharkhand",
    "area_type": "Rural",
    "gender": "Male",
    "age": 45,
    "occupation": "Farmer",
    "bpl_status": true,
    "annual_income": "Less than ₹1 Lakh",
    "caste_category": "OBC",
    "has_school_children": true,
    "marital_status": "Married"
  },
  "include_probabilistic": true
}
Response:
jsonDownloadCopy code{
  "eligible_schemes": [
    {
      "id": "pm_kisan",
      "name": "PM-KISAN Samman Nidhi",
      "name_hindi": "पीएम-किसान सम्मान निधि",
      "confidence": 1.0,
      "confidence_label": "Eligible",
      "benefit_value": 6000,
      "benefit_frequency": "annual",
      "category": "Agriculture",
      "icon": "🌾",
      "matched_rules": ["occupation", "has_cultivable_land"],
      "blocking_conditions": []
    },
    {
      "id": "ayushman_bharat",
      "name": "Ayushman Bharat PMJAY",
      "confidence": 0.85,
      "confidence_label": "Highly Likely",
      "benefit_value": 500000,
      "benefit_frequency": "annual",
      "category": "Health",
      "icon": "🏥",
      "matched_rules": ["bpl_status"],
      "blocking_conditions": ["Verify SECC listing"]
    }
  ],
  "total_count": 12,
  "total_annual_value": 52000,
  "summary": {
    "eligible": 10,
    "highly_likely": 2,
    "conditional": 0
  }
}
3. POST /journey
Generate life journey plan based on eligible schemes.
Request:
jsonDownloadCopy code{
  "attributes": { ... },
  "eligible_scheme_ids": ["pm_kisan", "ayushman_bharat", ...],
  "time_horizon_years": 10
}
Response:
jsonDownloadCopy code{
  "journey": {
    "immediate": {
      "label": "Immediate Actions (Next 30 days)",
      "schemes": [
        {
          "id": "pm_kisan",
          "name": "PM-KISAN",
          "urgency": "high",
          "reason": "Open enrollment, immediate benefit",
          "annual_value": 6000
        }
      ],
      "total_value": 18000
    },
    "short_term": {
      "label": "Next 1-2 Years",
      "schemes": [...],
      "total_value": 50000,
      "life_events": ["Daughter enters Class 9 - new scholarships available"]
    },
    "medium_term": {
      "label": "3-5 Years",
      "schemes": [...],
      "total_value": 150000,
      "life_events": ["Daughter enters college"]
    },
    "long_term": {
      "label": "5+ Years (Retirement Planning)",
      "schemes": [...],
      "total_value": 36000,
      "life_events": ["Enroll now for future pension benefits"]
    }
  },
  "lifetime_potential": 1500000,
  "timeline_visualization": [
    {"year": 2025, "schemes": ["pm_kisan", "ayushman_bharat"], "value": 18000},
    {"year": 2026, "schemes": ["pm_kisan", "scholarship"], "value": 30000}
  ]
}
4. POST /optimize
Get optimized scheme portfolio respecting conflicts and dependencies.
Request:
jsonDownloadCopy code{
  "eligible_scheme_ids": ["pm_kisan", "mkay_jh", "ayushman_bharat", ...],
  "constraints": {
    "max_applications": 5,
    "prefer_online": true
  }
}
Response:
jsonDownloadCopy code{
  "optimized_portfolio": {
    "selected_schemes": [
      {
        "id": "mkay_jh",
        "name": "Mukhyamantri Krishi Ashirwad",
        "benefit_value": 25000,
        "selected_over": "pm_kisan",
        "reason": "Higher annual benefit (₹25,000 vs ₹6,000)"
      }
    ],
    "total_annual_value": 52000,
    "conflicts_resolved": [
      {
        "schemes": ["pm_kisan", "mkay_jh"],
        "resolution": "Selected mkay_jh (higher value)",
        "value_difference": 19000
      }
    ],
    "dependencies": [
      {
        "scheme": "ujjwala",
        "depends_on": "bpl_card",
        "status": "satisfied"
      }
    ],
    "stacking_benefits": [
      {
        "schemes": ["mkay_jh", "pmfby"],
        "combined_value": 225000,
        "note": "Income support + crop insurance stack"
      }
    ]
  },
  "excluded_schemes": [
    {
      "id": "pm_kisan",
      "reason": "Conflicts with selected scheme mkay_jh"
    }
  ],
  "visualization": {
    "layers": [
      {"name": "Foundation", "schemes": ["bpl_card"]},
      {"name": "Income", "schemes": ["mkay_jh"]},
      {"name": "Protection", "schemes": ["ayushman_bharat", "pmfby"]}
    ]
  }
}
5. GET /schemes/{id}
Get detailed scheme information with co-pilot data.
Response:
jsonDownloadCopy code{
  "scheme": {
    "id": "pm_kisan",
    "name": "PM-KISAN Samman Nidhi",
    "name_hindi": "पीएम-किसान सम्मान निधि",
    "ministry": "Ministry of Agriculture",
    "description": "Income support of ₹6,000 per year...",
    "description_hindi": "प्रति वर्ष ₹6,000 की आय सहायता...",
    "benefit": {
      "type": "cash",
      "value": 6000,
      "frequency": "annual",
      "disbursement": "₹2,000 every 4 months directly to bank"
    },
    "eligibility_summary": [
      "Landholding farmer family",
      "Not an income tax payer",
      "Not a government employee"
    ],
    "application": {
      "mode": "online",
      "url": "https://pmkisan.gov.in",
      "deadline": "Open enrollment",
      "steps": [
        "Visit pmkisan.gov.in",
        "Click 'New Farmer Registration'",
        "Enter Aadhaar number and verify OTP",
        "Fill land details and upload documents",
        "Submit application"
      ]
    },
    "documents": [
      {
        "name": "Aadhaar Card",
        "name_hindi": "आधार कार्ड",
        "mandatory": true,
        "how_to_obtain": "Visit nearest Aadhaar center"
      }
    ],
    "common_issues": [
      {
        "issue": "Aadhaar-bank linking not done",
        "solution": "Visit bank branch with Aadhaar to link"
      }
    ],
    "legal_citation": "Ministry of Agriculture Notification dated 01.12.2018",
    "related_schemes": ["pmfby", "kisan_credit_card"],
    "conflicts_with": ["mkay_jh"]
  }
}
6. GET /schemes/{id}/explain
Get detailed eligibility explanation with graph path.
Request Query Params:
?attributes={"state":"Jharkhand","occupation":"Farmer",...}

Response:
jsonDownloadCopy code{
  "scheme_id": "pm_kisan",
  "is_eligible": true,
  "confidence": 1.0,
  "explanation": {
    "graph_path": [
      {"node": "user", "type": "start"},
      {"node": "occupation:Farmer", "type": "attribute", "matched": true},
      {"node": "has_cultivable_land:true", "type": "attribute", "matched": true},
      {"node": "pm_kisan", "type": "scheme", "matched": true}
    ],
    "matched_conditions": [
      {
        "attribute": "occupation",
        "required": "Farmer or Agricultural Laborer",
        "user_value": "Farmer",
        "status": "✓ Matched"
      }
    ],
    "legal_basis": {
      "citation": "PM-KISAN Operational Guidelines, Section 4.1",
      "text": "All landholding farmer families are eligible for the scheme...",
      "source_url": "https://pmkisan.gov.in/Documents/..."
    },
    "plain_language": "You are eligible for PM-KISAN because you are a farmer with cultivable land, and you are not an income tax payer or government employee."
  }
}
7. GET /graph
Get knowledge graph data for visualization.
Query Params:
?center_node=user&depth=2&attributes={"occupation":"Farmer",...}

Response:
jsonDownloadCopy code{
  "nodes": [
    {"id": "user", "type": "user", "label": "You", "data": {}},
    {"id": "attr_farmer", "type": "attribute", "label": "Farmer", "category": "occupation"},
    {"id": "attr_bpl", "type": "attribute", "label": "BPL", "category": "status"},
    {"id": "pm_kisan", "type": "scheme", "label": "PM-KISAN", "benefit": 6000, "eligible": true},
    {"id": "ujjwala", "type": "scheme", "label": "Ujjwala", "benefit": 1600, "eligible": true}
  ],
  "edges": [
    {"source": "user", "target": "attr_farmer", "type": "has_attribute"},
    {"source": "user", "target": "attr_bpl", "type": "has_attribute"},
    {"source": "attr_farmer", "target": "pm_kisan", "type": "qualifies_for"},
    {"source": "attr_bpl", "target": "ujjwala", "type": "qualifies_for"},
    {"source": "pm_kisan", "target": "mkay_jh", "type": "conflicts_with"}
  ],
  "layout_hints": {
    "user_position": {"x": 0, "y": 0},
    "attribute_ring_radius": 150,
    "scheme_ring_radius": 300
  }
}
8. GET /dashboard/leakage
Get leakage statistics for government/NGO view.
Query Params:
?state=Jharkhand&district=Ranchi

Response:
jsonDownloadCopy code{
  "district": {
    "name": "Ranchi",
    "state": "Jharkhand",
    "population": 2914253,
    "bpl_population": 728563
  },
  "scheme_gaps": [
    {
      "scheme_id": "pm_kisan",
      "scheme_name": "PM-KISAN",
      "estimated_eligible": 124000,
      "actual_enrolled": 89000,
      "gap": 35000,
      "gap_percentage": 28.2,
      "unclaimed_value": 21000000,
      "unclaimed_value_formatted": "₹2.1 Cr"
    }
  ],
  "total_unclaimed": 167000000,
  "total_unclaimed_formatted": "₹16.7 Cr",
  "demographic_gaps": [
    {"category": "SC/ST households", "gap_percentage": 42},
    {"category": "Female-headed households", "gap_percentage": 56},
    {"category": "Elderly (60+)", "gap_percentage": 61}
  ],
  "block_wise_heatmap": [
    {"block": "Kanke", "gap_percentage": 67},
    {"block": "Ratu", "gap_percentage": 58}
  ]
}
Pydantic Models (Backend)
pythonDownloadCopy code# models.py

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum

class ConfidenceLevel(str, Enum):
    ELIGIBLE = "Eligible"
    HIGHLY_LIKELY = "Highly Likely"
    POSSIBLE = "Possible"
    CONDITIONAL = "Conditional"
    NOT_ELIGIBLE = "Not Eligible"

class BenefitType(str, Enum):
    CASH = "cash"
    KIND = "kind"
    SERVICE = "service"
    LOAN = "loan"
    INSURANCE = "insurance"

class BenefitFrequency(str, Enum):
    ONE_TIME = "one_time"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    ANNUAL = "annual"

# Request Models
class UserAttributes(BaseModel):
    state: Optional[str] = None
    area_type: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    bpl_status: Optional[bool] = None
    annual_income: Optional[str] = None
    caste_category: Optional[str] = None
    has_school_children: Optional[bool] = None
    marital_status: Optional[str] = None
    # Additional attributes
    has_cultivable_land: Optional[bool] = None
    is_disabled: Optional[bool] = None
    education_level: Optional[str] = None

class EligibilityRequest(BaseModel):
    attributes: UserAttributes
    include_probabilistic: bool = True

class JourneyRequest(BaseModel):
    attributes: UserAttributes
    eligible_scheme_ids: List[str]
    time_horizon_years: int = 10

class OptimizeRequest(BaseModel):
    eligible_scheme_ids: List[str]
    constraints: Optional[Dict[str, Any]] = None

# Response Models
class SchemeBasic(BaseModel):
    id: str
    name: str
    name_hindi: Optional[str]
    confidence: float
    confidence_label: ConfidenceLevel
    benefit_value: Optional[int]
    benefit_frequency: Optional[BenefitFrequency]
    category: str
    icon: str
    matched_rules: List[str]
    blocking_conditions: List[str]

class EligibilityResponse(BaseModel):
    eligible_schemes: List[SchemeBasic]
    total_count: int
    total_annual_value: int
    summary: Dict[str, int]

class JourneyPhase(BaseModel):
    label: str
    schemes: List[Dict[str, Any]]
    total_value: int
    life_events: Optional[List[str]] = None

class JourneyResponse(BaseModel):
    journey: Dict[str, JourneyPhase]
    lifetime_potential: int
    timeline_visualization: List[Dict[str, Any]]

class ConflictResolution(BaseModel):
    schemes: List[str]
    resolution: str
    value_difference: int

class OptimizedPortfolio(BaseModel):
    selected_schemes: List[Dict[str, Any]]
    total_annual_value: int
    conflicts_resolved: List[ConflictResolution]
    dependencies: List[Dict[str, Any]]
    stacking_benefits: List[Dict[str, Any]]

class OptimizeResponse(BaseModel):
    optimized_portfolio: OptimizedPortfolio
    excluded_schemes: List[Dict[str, Any]]
    visualization: Dict[str, Any]

class Document(BaseModel):
    name: str
    name_hindi: Optional[str]
    mandatory: bool
    how_to_obtain: Optional[str]

class SchemeDetail(BaseModel):
    id: str
    name: str
    name_hindi: Optional[str]
    ministry: str
    description: str
    description_hindi: Optional[str]
    benefit: Dict[str, Any]
    eligibility_summary: List[str]
    application: Dict[str, Any]
    documents: List[Document]
    common_issues: List[Dict[str, str]]
    legal_citation: Optional[str]
    related_schemes: List[str]
    conflicts_with: List[str]

class GraphNode(BaseModel):
    id: str
    type: str
    label: str
    data: Optional[Dict[str, Any]] = None

class GraphEdge(BaseModel):
    source: str
    target: str
    type: str

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    layout_hints: Optional[Dict[str, Any]] = None

class SchemeGap(BaseModel):
    scheme_id: str
    scheme_name: str
    estimated_eligible: int
    actual_enrolled: int
    gap: int
    gap_percentage: float
    unclaimed_value: int
    unclaimed_value_formatted: str

class LeakageResponse(BaseModel):
    district: Dict[str, Any]
    scheme_gaps: List[SchemeGap]
    total_unclaimed: int
    total_unclaimed_formatted: str
    demographic_gaps: List[Dict[str, Any]]
    block_wise_heatmap: List[Dict[str, Any]]

8. Frontend Design System
Design Principles
PrincipleImplementationAccessibleHigh contrast, large touch targets, screen reader friendlyBilingualHindi/English toggle throughoutTrust-buildingGovernment-inspired colors, official logos, citationsMobile-firstResponsive, works on low-end devicesDelightfulSubtle animations, progress indicators, celebrations
Color Palette
cssDownloadCopy code:root {
  /* Primary - Government Blue (inspired by India.gov.in) */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-900: #1e3a8a;

  /* Secondary - Saffron (national) */
  --secondary-500: #f97316;
  --secondary-600: #ea580c;

  /* Accent - Green (success, money) */
  --accent-500: #22c55e;
  --accent-600: #16a34a;

  /* Neutral */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;

  /* Semantic */
  --success: #22c55e;
  --warning: #eab308;
  --error: #ef4444;
  --info: #3b82f6;

  /* Confidence Levels */
  --eligible: #22c55e;
  --highly-likely: #84cc16;
  --possible: #eab308;
  --conditional: #f97316;
}
Typography
cssDownloadCopy code/* Font Stack */
--font-sans: 'Inter', 'Noto Sans Devanagari', system-ui, sans-serif;
--font-display: 'Plus Jakarta Sans', var(--font-sans);

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
Component Library (shadcn/ui customization)
typescriptDownloadCopy code// components/ui/button.tsx - Custom variants

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50",
        ghost: "text-gray-600 hover:bg-gray-100",
        success: "bg-accent-500 text-white hover:bg-accent-600",
        destructive: "bg-error text-white hover:bg-red-600",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-6",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
Key UI Components Specification
1. SchemeCard Component
typescriptDownloadCopy code// components/SchemeCard.tsx

interface SchemeCardProps {
  scheme: {
    id: string;
    name: string;
    name_hindi?: string;
    icon: string;
    category: string;
    benefit_value?: number;
    benefit_frequency?: string;
    confidence: number;
    confidence_label: string;
  };
  language: 'en' | 'hi';
  onClick: () => void;
  isSelected?: boolean;
}

/*
Visual Design:
┌────────────────────────────────────────────────┐
│  🌾  PM-KISAN Samman Nidhi                     │
│      पीएम-किसान सम्मान निधि                      │
│                                                │
│  ┌──────────┐  ┌─────────────────────────────┐ │
│  │ ₹6,000   │  │ ████████████████░░ 100%    │ │
│  │ /year    │  │ Eligible ✓                 │ │
│  └──────────┘  └─────────────────────────────┘ │
│                                                │
│  Agriculture  •  Central Scheme                │
│                                   [View →]     │
└────────────────────────────────────────────────┘
*/
2. JourneyTimeline Component
typescriptDownloadCopy code// components/JourneyTimeline.tsx

interface TimelinePhase {
  id: string;
  label: string;
  year_range: string;
  schemes: SchemeBasic[];
  total_value: number;
  life_events?: string[];
}

/*
Visual Design:
┌─────────────────────────────────────────────────────────────────┐
│                     YOUR BENEFIT JOURNEY                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NOW          2026-27        2028-30        2035+              │
│   ●━━━━━━━━━━━━━●━━━━━━━━━━━━━●━━━━━━━━━━━━━●                  │
│   │             │             │             │                   │
│   │  ┌───────┐  │  ┌───────┐  │  ┌───────┐  │  ┌───────┐      │
│   │  │₹18,000│  │  │₹50,000│  │  │₹1.5L  │  │  │₹36,000│      │
│   │  │/year  │  │  │/year  │  │  │/year  │  │  │/year  │      │
│   │  └───────┘  │  └───────┘  │  └───────┘  │  └───────┘      │
│   │             │             │             │                   │
│   │ • PM-KISAN  │ • Scholarship│ • KCC      │ • Atal Pension   │
│   │ • Ayushman  │ • College   │ • Solar    │ • PMSBY          │
│   │ • Ujjwala   │   fee waiver│   subsidy  │                   │
│   │             │             │             │                   │
│   ▼             ▼             ▼             ▼                   │
│ [Apply Now]   [Daughter      [Farm         [Enroll Now        │
│               enters Class 9] Expansion]    for future]        │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│  LIFETIME POTENTIAL: ₹12-15 LAKHS                              │
└─────────────────────────────────────────────────────────────────┘
*/
3. GraphVisualization Component
typescriptDownloadCopy code// components/GraphVisualization.tsx

import ReactFlow, { 
  Node, 
  Edge, 
  Background, 
  Controls,
  MiniMap 
} from 'reactflow';

/*
Visual Design:
┌─────────────────────────────────────────────────────────────────┐
│  ELIGIBILITY GRAPH                    [Zoom +] [Zoom -] [Fit]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        ┌─────────┐                              │
│                        │   YOU   │                              │
│                        │  ████   │                              │
│                        └────┬────┘                              │
│              ┌──────────────┼──────────────┐                   │
│              │              │              │                    │
│              ▼              ▼              ▼                    │
│        ┌─────────┐    ┌─────────┐    ┌─────────┐              │
│        │ FARMER  │    │   BPL   │    │  RURAL  │              │
│        │ ░░░░░░░ │    │ ░░░░░░░ │    │ ░░░░░░░ │              │
│        └────┬────┘    └────┬────┘    └────┬────┘              │
│             │              │              │                     │
│    ┌────────┴────┐    ┌────┴────┐    ┌───┴────┐               │
│    │             │    │         │    │        │                │
│    ▼             ▼    ▼         ▼    ▼        ▼                │
│ ┌──────┐    ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│ │PM-   │╌╌╌▶│MKAY  │ │Ujjwa-│ │PMAY-G│ │Ayush-│               │
│ │KISAN │    │(JH)  │ │la    │ │      │ │man   │               │
│ │₹6K ✓ │    │₹25K ✓│ │₹1.6K✓│ │₹1.2L✓│ │₹5L ✓ │               │
│ └──────┘    └──────┘ └──────┘ └──────┘ └──────┘               │
│      ╌╌╌ CONFLICTS ╌╌╌                                         │
│                                                                 │
│  Legend: ● You  ● Attribute  ● Scheme (Eligible)               │
│          ─ Qualifies  ╌╌ Conflicts                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ MiniMap                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
*/
4. ExplainabilityPanel Component
typescriptDownloadCopy code// components/ExplainabilityPanel.tsx

/*
Visual Design (Two-column layout):
┌─────────────────────────────────────────────────────────────────┐
│                     WHY YOU'RE ELIGIBLE                         │
│                     PM-KISAN Samman Nidhi                       │
├───────────────────────────┬─────────────────────────────────────┤
│     ELIGIBILITY PATH      │         LEGAL BASIS                 │
├───────────────────────────┼─────────────────────────────────────┤
│                           │                                     │
│  ┌───────────────────┐    │  📜 PM-KISAN Operational Guidelines │
│  │      YOU          │    │     (December 2018)                 │
│  │   Ramesh Kumar    │    │                                     │
│  └─────────┬─────────┘    │  Section 4.1:                       │
│            │              │  "All landholding farmer families   │
│            ▼              │   with cultivable land as per       │
│  ┌───────────────────┐    │   land records of the State are    │
│  │  Occupation:      │    │   eligible for the scheme."         │
│  │  Farmer ✓         │    │                                     │
│  └─────────┬─────────┘    │  Section 4.2:                       │
│            │              │  "The following are NOT eligible:   │
│            ▼              │   - Institutional land holders      │
│  ┌───────────────────┐    │   - Income tax payers              │
│  │  Has Cultivable   │    │   - Government employees"          │
│  │  Land ✓           │    │                                     │
│  └─────────┬─────────┘    │  Your Status:                       │
│            │              │  ✓ Not an institutional holder      │
│            ▼              │  ✓ Not an income tax payer         │
│  ┌───────────────────┐    │  ✓ Not a government employee       │
│  │  Not Excluded ✓   │    │                                     │
│  └─────────┬─────────┘    │  ─────────────────────────────────  │
│            │              │                                     │
│            ▼              │  [📄 View Full Notification]        │
│  ┌───────────────────┐    │                                     │
│  │    ELIGIBLE ✓     │    │                                     │
│  │    100% Match     │    │                                     │
│  └───────────────────┘    │                                     │
│                           │                                     │
└───────────────────────────┴─────────────────────────────────────┘
*/
Animation Guidelines
typescriptDownloadCopy code// lib/animations.ts

import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Celebration animation for results
export const celebrationVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: [0, 1.2, 1],
    transition: { duration: 0.5, times: [0, 0.7, 1] }
  }
};

9. Core Algorithm Implementation
9.1 Eligibility Engine
pythonDownloadCopy code# backend/engine/eligibility.py

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum
import json

class Operator(Enum):
    EQ = "eq"
    NEQ = "neq"
    LT = "lt"
    LTE = "lte"
    GT = "gt"
    GTE = "gte"
    IN = "in"
    NOT_IN = "not_in"
    EXISTS = "exists"

@dataclass
class EligibilityRule:
    attribute: str
    operator: Operator
    value: Any
    is_hard: bool = True

@dataclass
class EligibilityResult:
    scheme_id: str
    is_eligible: bool
    confidence: float
    matched_rules: List[str]
    failed_rules: List[str]
    blocking_conditions: List[str]

class EligibilityEngine:
    def __init__(self, db_connection):
        self.db = db_connection
        self.schemes_cache = {}
        self.rules_cache = {}
        self._load_data()
    
    def _load_data(self):
        """Load schemes and rules into memory for fast access."""
        # Load schemes
        schemes = self.db.execute("SELECT * FROM schemes WHERE is_active = 1").fetchall()
        for scheme in schemes:
            self.schemes_cache[scheme['id']] = dict(scheme)
        
        # Load rules grouped by scheme
        rules = self.db.execute("SELECT * FROM scheme_rules").fetchall()
        for rule in rules:
            scheme_id = rule['scheme_id']
            if scheme_id not in self.rules_cache:
                self.rules_cache[scheme_id] = []
            self.rules_cache[scheme_id].append(EligibilityRule(
                attribute=rule['attribute'],
                operator=Operator(rule['operator']),
                value=json.loads(rule['value']),
                is_hard=bool(rule['is_hard_constraint'])
            ))
    
    def evaluate_rule(self, rule: EligibilityRule, user_attrs: Dict) -> tuple[bool, float]:
        """
        Evaluate a single rule against user attributes.
        Returns (matched, confidence).
        """
        attr_value = user_attrs.get(rule.attribute)
        
        # Handle missing attributes
        if attr_value is None:
            if rule.operator == Operator.EXISTS:
                return (False, 0.0)
            # For missing soft constraints, return uncertain
            if not rule.is_hard:
                return (True, 0.5)  # 50% confidence for unknown
            return (False, 0.0)
        
        # Evaluate based on operator
        match rule.operator:
            case Operator.EQ:
                matched = attr_value == rule.value
            case Operator.NEQ:
                matched = attr_value != rule.value
            case Operator.LT:
                matched = float(attr_value) < float(rule.value)
            case Operator.LTE:
                matched = float(attr_value) <= float(rule.value)
            case Operator.GT:
                matched = float(attr_value) > float(rule.value)
            case Operator.GTE:
                matched = float(attr_value) >= float(rule.value)
            case Operator.IN:
                matched = attr_value in rule.value
            case Operator.NOT_IN:
                matched = attr_value not in rule.value
            case Operator.EXISTS:
                matched = attr_value is not None
            case _:
                matched = False
        
        confidence = 1.0 if matched else 0.0
        return (matched, confidence)
    
    def check_eligibility(
        self, 
        scheme_id: str, 
        user_attrs: Dict
    ) -> EligibilityResult:
        """Check eligibility for a single scheme."""
        rules = self.rules_cache.get(scheme_id, [])
        
        matched_rules = []
        failed_rules = []
        blocking_conditions = []
        total_confidence = 1.0
        
        for rule in rules:
            matched, confidence = self.evaluate_rule(rule, user_attrs)
            
            if matched:
                matched_rules.append(rule.attribute)
            else:
                failed_rules.append(rule.attribute)
                if rule.is_hard:
                    blocking_conditions.append(
                        f"Requires {rule.attribute} {rule.operator.value} {rule.value}"
                    )
            
            # Update confidence (multiply for independent conditions)
            total_confidence *= confidence
        
        # Determine eligibility
        hard_rules_passed = len(blocking_conditions) == 0
        
        return EligibilityResult(
            scheme_id=scheme_id,
            is_eligible=hard_rules_passed and total_confidence > 0.5,
            confidence=total_confidence if hard_rules_passed else 0.0,
            matched_rules=matched_rules,
            failed_rules=failed_rules,
            blocking_conditions=blocking_conditions
        )
    
    def find_all_eligible(
        self, 
        user_attrs: Dict,
        include_probabilistic: bool = True
    ) -> List[Dict]:
        """Find all eligible schemes for a user."""
        results = []
        
        for scheme_id, scheme in self.schemes_cache.items():
            # Filter by state if user has state attribute
            if scheme.get('state') and user_attrs.get('state'):
                if scheme['state'] != user_attrs['state']:
                    continue
            
            result = self.check_eligibility(scheme_id, user_attrs)
            
            # Include based on confidence threshold
            if result.is_eligible or (include_probabilistic and result.confidence > 0.3):
                confidence_label = self._get_confidence_label(result.confidence)
                
                results.append({
                    **scheme,
                    'confidence': result.confidence,
                    'confidence_label': confidence_label,
                    'matched_rules': result.matched_rules,
                    'blocking_conditions': result.blocking_conditions
                })
        
        # Sort by confidence (highest first)
        results.sort(key=lambda x: x['confidence'], reverse=True)
        
        return results
    
    def _get_confidence_label(self, confidence: float) -> str:
        if confidence >= 1.0:
            return "Eligible"
        elif confidence >= 0.8:
            return "Highly Likely"
        elif confidence >= 0.5:
            return "Possible"
        else:
            return "Conditional"
9.2 Journey Planner
pythonDownloadCopy code# backend/engine/journey.py

from typing import List, Dict, Any
from datetime import datetime
from dataclasses import dataclass

@dataclass
class LifeEvent:
    year: int
    event: str
    triggered_schemes: List[str]

class JourneyPlanner:
    LIFE_STAGES = ['child', 'youth', 'working_age', 'elderly']
    
    def __init__(self, db_connection):
        self.db = db_connection
    
    def generate_journey(
        self,
        user_attrs: Dict,
        eligible_schemes: List[Dict],
        time_horizon: int = 10
    ) -> Dict:
        """Generate a life journey plan based on eligible schemes."""
        
        current_year = datetime.now().year
        user_age = user_attrs.get('age', 30)
        
        # Categorize schemes by time phase
        phases = {
            'immediate': {
                'label': 'Immediate Actions (Next 30 days)',
                'schemes': [],
                'total_value': 0
            },
            'short_term': {
                'label': f'Short Term ({current_year + 1}-{current_year + 2})',
                'schemes': [],
                'total_value': 0,
                'life_events': []
            },
            'medium_term': {
                'label': f'Medium Term ({current_year + 3}-{current_year + 5})',
                'schemes': [],
                'total_value': 0,
                'life_events': []
            },
            'long_term': {
                'label': f'Long Term ({current_year + 5}+)',
                'schemes': [],
                'total_value': 0,
                'life_events': []
            }
        }
        
        # Predict life events
        life_events = self._predict_life_events(user_attrs, time_horizon)
        
        # Categorize each scheme
        for scheme in eligible_schemes:
            phase = self._determine_phase(scheme, user_attrs, life_events)
            urgency = self._calculate_urgency(scheme, user_attrs)
            
            scheme_entry = {
                'id': scheme['id'],
                'name': scheme['name'],
                'benefit_value': scheme.get('benefit_value', 0),
                'urgency': urgency,
                'reason': self._get_recommendation_reason(scheme, user_attrs)
            }
            
            phases[phase]['schemes'].append(scheme_entry)
            if scheme.get('benefit_value'):
                phases[phase]['total_value'] += scheme['benefit_value']
        
        # Add predicted life events to phases
        for event in life_events:
            years_from_now = event.year - current_year
            if years_from_now <= 2:
                phases['short_term']['life_events'].append(event.event)
            elif years_from_now <= 5:
                phases['medium_term']['life_events'].append(event.event)
            else:
                phases['long_term']['life_events'].append(event.event)
        
        # Sort schemes within each phase by urgency
        for phase in phases.values():
            phase['schemes'].sort(
                key=lambda x: {'high': 0, 'medium': 1, 'low': 2}.get(x['urgency'], 2)
            )
        
        # Calculate lifetime potential
        lifetime_potential = sum(
            self._estimate_lifetime_value(s, user_attrs, time_horizon) 
            for s in eligible_schemes
        )
        
        # Build timeline visualization
        timeline = self._build_timeline(
            eligible_schemes, user_attrs, current_year, time_horizon
        )
        
        return {
            'journey': phases,
            'lifetime_potential': lifetime_potential,
            'timeline_visualization': timeline
        }
    
    def _predict_life_events(
        self, 
        user_attrs: Dict, 
        time_horizon: int
    ) -> List[LifeEvent]:
        """Predict future life events that might trigger new eligibility."""
        events = []
        current_year = datetime.now().year
        user_age = user_attrs.get('age', 30)
        
        # Children's education milestones
        if user_attrs.get('has_school_children'):
            daughter_class = user_attrs.get('daughter_class', 8)
            # Class 9 (post-matric scholarships)
            years_to_class_9 = max(0, 9 - daughter_class)
            if years_to_class_9 <= time_horizon:
                events.append(LifeEvent(
                    year=current_year + years_to_class_9,
                    event="Daughter enters Class 9 - Post-matric scholarships available",
                    triggered_schemes=['nsp_postmatric']
                ))
            
            # College
            years_to_college = max(0, 12 - daughter_class + 1)
            if years_to_college <= time_horizon:
                events.append(LifeEvent(
                    year=current_year + years_to_college,
                    event="Daughter enters college - Higher education schemes available",
                    triggered_schemes=['college_fee_waiver', 'higher_ed_scholarship']
                ))
        
        # Retirement milestone
        retirement_age = 60
        years_to_retirement = max(0, retirement_age - user_age)
        if years_to_retirement <= time_horizon:
            events.append(LifeEvent(
                year=current_year + years_to_retirement,
                event="Retirement age - Pension benefits begin",
                triggered_schemes=['atal_pension', 'pm_sym']
            ))
        
        return events
    
    def _determine_phase(
        self, 
        scheme: Dict, 
        user_attrs: Dict,
        life_events: List[LifeEvent]
    ) -> str:
        """Determine which phase a scheme belongs to."""
        life_stages = scheme.get('life_stages', [])
        trigger_events = scheme.get('trigger_events', [])
        
        # Immediate: already eligible, high value, or urgent
        if scheme['confidence'] >= 0.9 and not trigger_events:
            return 'immediate'
        
        # Check if scheme is triggered by a future event
        for event in life_events:
            if scheme['id'] in event.triggered_schemes:
                years_from_now = event.year - datetime.now().year
                if years_from_now <= 2:
                    return 'short_term'
                elif years_from_now <= 5:
                    return 'medium_term'
                else:
                    return 'long_term'
        
        # Pension schemes should be enrolled early but benefit later
        if 'elderly' in life_stages and user_attrs.get('age', 30) < 50:
            return 'long_term'  # But flag for early enrollment
        
        return 'immediate'
    
    def _calculate_urgency(self, scheme: Dict, user_attrs: Dict) -> str:
        """Calculate urgency level for a scheme."""
        # Check deadline
        if scheme.get('deadline'):
            # Parse and check deadline proximity
            return 'high'
        
        # High value schemes
        if scheme.get('benefit_value', 0) > 50000:
            return 'high'
        
        # Foundation schemes that unlock others
        if scheme['id'] in ['bpl_card', 'aadhaar']:
            return 'high'
        
        return 'medium'
    
    def _get_recommendation_reason(self, scheme: Dict, user_attrs: Dict) -> str:
        """Generate a human-readable reason for recommending this scheme."""
        reasons = []
        
        if scheme.get('benefit_value', 0) > 10000:
            reasons.append(f"High value benefit (₹{scheme['benefit_value']:,})")
        
        if scheme.get('deadline'):
            reasons.append("Deadline approaching")
        
        if not reasons:
            reasons.append("You meet all eligibility criteria")
        
        return "; ".join(reasons)
    
    def _estimate_lifetime_value(
        self, 
        scheme: Dict, 
        user_attrs: Dict, 
        time_horizon: int
    ) -> int:
        """Estimate total lifetime value of a scheme."""
        benefit = scheme.get('benefit_value', 0)
        frequency = scheme.get('benefit_frequency', 'one_time')
        
        if frequency == 'one_time':
            return benefit
        elif frequency == 'annual':
            return benefit * min(time_horizon, 10)  # Cap at 10 years
        elif frequency == 'monthly':
            return benefit * 12 * min(time_horizon, 10)
        elif frequency == 'quarterly':
            return benefit * 4 * min(time_horizon, 10)
        
        return benefit
    
    def _build_timeline(
        self, 
        schemes: List[Dict], 
        user_attrs: Dict,
        current_year: int,
        time_horizon: int
    ) -> List[Dict]:
        """Build year-by-year timeline for visualization."""
        timeline = []
        
        for year_offset in range(min(time_horizon, 10)):
            year = current_year + year_offset
            year_schemes = []
            year_value = 0
            
            for scheme in schemes:
                # Determine if scheme applies this year
                phase = self._determine_phase(scheme, user_attrs, [])
                
                if phase == 'immediate' or (phase == 'short_term' and year_offset <= 2):
                    if scheme.get('benefit_frequency') != 'one_time' or year_offset == 0:
                        year_schemes.append(scheme['id'])
                        year_value += scheme.get('benefit_value', 0)
            
            timeline.append({
                'year': year,
                'schemes': year_schemes,
                'value': year_value
            })
        
        return timeline
9.3 Scheme Optimizer
pythonDownloadCopy code# backend/engine/optimizer.py

from typing import List, Dict, Any, Set, Tuple
from dataclasses import dataclass
import json

@dataclass
class SchemeRelation:
    scheme_id_1: str
    scheme_id_2: str
    relation_type: str  # conflicts, depends, stacks, unlocks

class SchemeOptimizer:
    def __init__(self, db_connection):
        self.db = db_connection
        self.relations = self._load_relations()
    
    def _load_relations(self) -> List[SchemeRelation]:
        """Load scheme relationships from database."""
        rows = self.db.execute("SELECT * FROM scheme_relations").fetchall()
        return [
            SchemeRelation(
                scheme_id_1=row['scheme_id_1'],
                scheme_id_2=row['scheme_id_2'],
                relation_type=row['relation_type']
            )
            for row in rows
        ]
    
    def optimize_portfolio(
        self,
        eligible_schemes: List[Dict],
        constraints: Dict = None
    ) -> Dict:
        """
        Find optimal combination of schemes maximizing benefit
        while respecting conflicts and dependencies.
        """
        constraints = constraints or {}
        scheme_ids = {s['id'] for s in eligible_schemes}
        scheme_map = {s['id']: s for s in eligible_schemes}
        
        # Build conflict and dependency graphs
        conflicts = self._get_conflicts(scheme_ids)
        dependencies = self._get_dependencies(scheme_ids)
        stacking = self._get_stacking(scheme_ids)
        
        # Greedy optimization (for hackathon; can upgrade to ILP later)
        selected = self._greedy_select(
            eligible_schemes,
            conflicts,
            dependencies,
            constraints.get('max_applications')
        )
        
        # Calculate total value
        total_value = sum(
            scheme_map[s]['benefit_value'] or 0 
            for s in selected
        )
        
        # Identify conflicts resolved
        conflicts_resolved = []
        for s1, s2 in conflicts:
            if s1 in selected and s2 not in selected:
                conflicts_resolved.append({
                    'schemes': [s1, s2],
                    'resolution': f"Selected {s1} (higher value)",
                    'value_difference': (
                        (scheme_map[s1].get('benefit_value') or 0) -
                        (scheme_map[s2].get('benefit_value') or 0)
                    )
                })
        
        # Identify dependencies
        dependency_status = []
        for child, parent in dependencies:
            if child in selected:
                dependency_status.append({
                    'scheme': child,
                    'depends_on': parent,
                    'status': 'satisfied' if parent in selected else 'missing'
                })
        
        # Identify stacking benefits
        stacking_benefits = []
        for s1, s2 in stacking:
            if s1 in selected and s2 in selected:
                combined = (
                    (scheme_map[s1].get('benefit_value') or 0) +
                    (scheme_map[s2].get('benefit_value') or 0)
                )
                stacking_benefits.append({
                    'schemes': [s1, s2],
                    'combined_value': combined,
                    'note': 'These schemes stack - you can claim both!'
                })
        
        # Build visualization layers
        layers = self._build_layers(selected, scheme_map, dependencies)
        
        # Excluded schemes
        excluded = []
        for s in eligible_schemes:
            if s['id'] not in selected:
                reason = self._get_exclusion_reason(s['id'], selected, conflicts)
                excluded.append({
                    'id': s['id'],
                    'reason': reason
                })
        
        return {
            'optimized_portfolio': {
                'selected_schemes': [
                    {**scheme_map[s], 'selected_over': None}
                    for s in selected
                ],
                'total_annual_value': total_value,
                'conflicts_resolved': conflicts_resolved,
                'dependencies': dependency_status,
                'stacking_benefits': stacking_benefits
            },
            'excluded_schemes': excluded,
            'visualization': {
                'layers': layers
            }
        }
    
    def _get_conflicts(self, scheme_ids: Set[str]) -> List[Tuple[str, str]]:
        """Get all conflict pairs among given schemes."""
        conflicts = []
        for rel in self.relations:
            if rel.relation_type == 'conflicts':
                if rel.scheme_id_1 in scheme_ids and rel.scheme_id_2 in scheme_ids:
                    conflicts.append((rel.scheme_id_1, rel.scheme_id_2))
        return conflicts
    
    def _get_dependencies(self, scheme_ids: Set[str]) -> List[Tuple[str, str]]:
        """Get all dependency pairs (child, parent)."""
        deps = []
        for rel in self.relations:
            if rel.relation_type == 'depends':
                if rel.scheme_id_1 in scheme_ids:
                    deps.append((rel.scheme_id_1, rel.scheme_id_2))
        return deps
    
    def _get_stacking(self, scheme_ids: Set[str]) -> List[Tuple[str, str]]:
        """Get all stacking pairs."""
        stacks = []
        for rel in self.relations:
            if rel.relation_type == 'stacks':
                if rel.scheme_id_1 in scheme_ids and rel.scheme_id_2 in scheme_ids:
                    stacks.append((rel.scheme_id_1, rel.scheme_id_2))
        return stacks
    
    def _greedy_select(
        self,
        schemes: List[Dict],
        conflicts: List[Tuple[str, str]],
        dependencies: List[Tuple[str, str]],
        max_schemes: int = None
    ) -> Set[str]:
        """
        Greedy algorithm to select optimal schemes.
        Prioritizes by value while avoiding conflicts.
        """
        # Sort by benefit value (descending)
        sorted_schemes = sorted(
            schemes,
            key=lambda s: s.get('benefit_value') or 0,
            reverse=True
        )
        
        selected = set()
        excluded_due_to_conflict = set()
        
        # Build conflict lookup
        conflict_map = {}
        for s1, s2 in conflicts:
            conflict_map.setdefault(s1, set()).add(s2)
            conflict_map.setdefault(s2, set()).add(s1)
        
        # Build dependency lookup
        dep_map = {}  # child -> parent
        for child, parent in dependencies:
            dep_map[child] = parent
        
        for scheme in sorted_schemes:
            sid = scheme['id']
            
            # Check max limit
            if max_schemes and len(selected) >= max_schemes:
                break
            
            # Skip if already excluded due to conflict
            if sid in excluded_due_to_conflict:
                continue
            
            # Check dependencies
            if sid in dep_map:
                parent = dep_map[sid]
                if parent not in selected:
                    # Try to add parent first if not conflicting
                    parent_scheme = next(
                        (s for s in schemes if s['id'] == parent), 
                        None
                    )
                    if parent_scheme and parent not in excluded_due_to_conflict:
                        selected.add(parent)
                        # Mark conflicts
                        for conflict in conflict_map.get(parent, []):
                            excluded_due_to_conflict.add(conflict)
            
            # Add scheme if not conflicting
            if sid not in excluded_due_to_conflict:
                selected.add(sid)
                # Mark conflicts
                for conflict in conflict_map.get(sid, []):
                    excluded_due_to_conflict.add(conflict)
        
        return selected
    
    def _build_layers(
        self,
        selected: Set[str],
        scheme_map: Dict,
        dependencies: List[Tuple[str, str]]
    ) -> List[Dict]:
        """Build visualization layers for benefit stack."""
        # Group schemes by category/type
        layers = {
            'Foundation': [],
            'Income Support': [],
            'Protection': [],
            'Education': [],
            'Other': []
        }
        
        category_map = {
            'bpl_card': 'Foundation',
            'aadhaar': 'Foundation',
            'pm_kisan': 'Income Support',
            'mkay_jh': 'Income Support',
            'ayushman_bharat': 'Protection',
            'pmfby': 'Protection',
            'pmsby': 'Protection',
            'nsp_postmatric': 'Education'
        }
        
        for sid in selected:
            category = category_map.get(sid, 'Other')
            layers[category].append(sid)
        
        # Convert to list format, excluding empty layers
        return [
            {'name': name, 'schemes': schemes}
            for name, schemes in layers.items()
            if schemes
        ]
    
    def _get_exclusion_reason(
        self,
        scheme_id: str,
        selected: Set[str],
        conflicts: List[Tuple[str, str]]
    ) -> str:
        """Get reason why a scheme was excluded."""
        for s1, s2 in conflicts:
            if scheme_id == s1 and s2 in selected:
                return f"Conflicts with selected scheme {s2}"
            if scheme_id == s2 and s1 in selected:
                return f"Conflicts with selected scheme {s1}"
        return "Not selected in optimization"
9.4 Graph Builder
pythonDownloadCopy code# backend/engine/graph_builder.py

from typing import List, Dict, Any, Set

class GraphBuilder:
    """Builds knowledge graph data for visualization."""
    
    def __init__(self, db_connection):
        self.db = db_connection
    
    def build_user_graph(
        self,
        user_attrs: Dict,
        eligible_schemes: List[Dict],
        depth: int = 2
    ) -> Dict:
        """Build a graph centered on the user."""
        nodes = []
        edges = []
        
        # Add user node
        nodes.append({
            'id': 'user',
            'type': 'user',
            'label': 'You',
            'data': {'attributes': user_attrs}
        })
        
        # Add attribute nodes for key attributes
        key_attrs = ['occupation', 'bpl_status', 'area_type', 'caste_category', 'gender']
        
        for attr in key_attrs:
            if user_attrs.get(attr):
                attr_id = f"attr_{attr}"
                value = user_attrs[attr]
                
                nodes.append({
                    'id': attr_id,
                    'type': 'attribute',
                    'label': str(value),
                    'data': {'category': attr, 'value': value}
                })
                
                edges.append({
                    'source': 'user',
                    'target': attr_id,
                    'type': 'has_attribute'
                })
        
        # Add scheme nodes
        for scheme in eligible_schemes:
            scheme_id = scheme['id']
            
            nodes.append({
                'id': scheme_id,
                'type': 'scheme',
                'label': scheme['name'],
                'data': {
                    'benefit_value': scheme.get('benefit_value'),
                    'confidence': scheme.get('confidence', 1.0),
                    'eligible': scheme.get('confidence', 0) > 0.5,
                    'icon': scheme.get('icon', '📋')
                }
            })
            
            # Connect attributes to schemes based on matched rules
            for rule in scheme.get('matched_rules', []):
                attr_id = f"attr_{rule}"
                if any(n['id'] == attr_id for n in nodes):
                    edges.append({
                        'source': attr_id,
                        'target': scheme_id,
                        'type': 'qualifies_for'
                    })
        
        # Add conflict edges
        relations = self.db.execute(
            "SELECT * FROM scheme_relations WHERE relation_type = 'conflicts'"
        ).fetchall()
        
        scheme_ids = {s['id'] for s in eligible_schemes}
        for rel in relations:
            if rel['scheme_id_1'] in scheme_ids and rel['scheme_id_2'] in scheme_ids:
                edges.append({
                    'source': rel['scheme_id_1'],
                    'target': rel['scheme_id_2'],
                    'type': 'conflicts_with'
                })
        
        # Calculate layout hints
        layout_hints = self._calculate_layout(nodes, edges)
        
        return {
            'nodes': nodes,
            'edges': edges,
            'layout_hints': layout_hints
        }
    
    def _calculate_layout(self, nodes: List[Dict], edges: List[Dict]) -> Dict:
        """Calculate suggested positions for graph layout."""
        import math
        
        # User at center
        positions = {'user': {'x': 0, 'y': 0}}
        
        # Attributes in first ring
        attr_nodes = [n for n in nodes if n['type'] == 'attribute']
        for i, node in enumerate(attr_nodes):
            angle = (2 * math.pi * i) / max(len(attr_nodes), 1)
            positions[node['id']] = {
                'x': 150 * math.cos(angle),
                'y': 150 * math.sin(angle)
            }
        
        # Schemes in second ring
        scheme_nodes = [n for n in nodes if n['type'] == 'scheme']
        for i, node in enumerate(scheme_nodes):
            angle = (2 * math.pi * i) / max(len(scheme_nodes), 1)
            positions[node['id']] = {
                'x': 350 * math.cos(angle),
                'y': 350 * math.sin(angle)
            }
        
        return {
            'positions': positions,
            'suggested_zoom': 0.8,
            'center': {'x': 0, 'y': 0}
        }

10. Screen-by-Screen Specification
Screen Flow
┌─────────────────────────────────────────────────────────────────────────┐
│                         SCREEN FLOW DIAGRAM                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                        ┌─────────────────┐                              │
│                        │   HOME PAGE     │                              │
│                        │   (Landing)     │                              │
│                        └────────┬────────┘                              │
│                                 │                                       │
│              ┌──────────────────┼──────────────────┐                   │
│              │                  │                  │                    │
│              ▼                  ▼                  ▼                    │
│     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│     │   START     │    │   PERSONA   │    │  DASHBOARD  │             │
│     │   FRESH     │    │   SELECT    │    │   VIEW      │             │
│     └──────┬──────┘    └──────┬──────┘    └─────────────┘             │
│            │                  │                                        │
│            └────────┬─────────┘                                        │
│                     ▼                                                  │
│            ┌─────────────────┐                                         │
│            │   QUESTION      │                                         │
│            │   FLOW          │ ◄──── (6-8 adaptive questions)         │
│            └────────┬────────┘                                         │
│                     │                                                  │
│                     ▼                                                  │
│            ┌─────────────────┐                                         │
│            │   RESULTS       │                                         │
│            │   PAGE          │                                         │
│            └────────┬────────┘                                         │
│                     │                                                  │
│     ┌───────────────┼───────────────┬───────────────┐                 │
│     │               │               │               │                  │
│     ▼               ▼               ▼               ▼                  │
│ ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐                │
│ │ SCHEME  │   │ JOURNEY │   │ GRAPH   │   │OPTIMIZER│                │
│ │ LIST    │   │ VIEW    │   │ VIEW    │   │ VIEW    │                │
│ └────┬────┘   └─────────┘   └─────────┘   └─────────┘                │
│      │                                                                 │
│      ▼                                                                 │
│ ┌─────────────────┐                                                   │
│ │  SCHEME DETAIL  │                                                   │
│ │  + CO-PILOT     │                                                   │
│ │  + EXPLAIN      │                                                   │
│ └─────────────────┘                                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Screen 1: Home Page
Route: /
Purpose: Landing page, entry point, value proposition
Layout:
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] SchemeGraph              [हिंदी|EN]  [About]  [GitHub]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │           🏛️ SchemeGraph                                │   │
│  │                                                         │   │
│  │      Discover Every Government Scheme                   │   │
│  │           You're Entitled To                            │   │
│  │                                                         │   │
│  │   आपके लिए उपलब्ध हर सरकारी योजना खोजें                    │   │
│  │                                                         │   │
│  │   Answer a few simple questions. Get a personalized     │   │
│  │   benefit plan worth lakhs of rupees.                   │   │
│  │                                                         │   │
│  │              [ 🚀 Find My Schemes ]                     │   │
│  │                                                         │   │
│  │   ─────────── or try a demo persona ───────────        │   │
│  │                                                         │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐               │   │
│  │   │  👨‍🌾    │  │  👩    │  │  👨‍🎓    │               │   │
│  │   │ Ramesh  │  │ Lakshmi │  │  Arjun  │               │   │
│  │   │ Farmer  │  │ Widow   │  │ Student │               │   │
│  │   │Jharkhand│  │Karnataka│  │  Bihar  │               │   │
│  │   └─────────┘  └─────────┘  └─────────┘               │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   1000+     │  │  ₹5000 Cr+  │  │   50,000+   │            │
│  │   Schemes   │  │  Discovered │  │   Families  │            │
│  │   Indexed   │  │  Benefits   │  │   Helped    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ────────────── How It Works ──────────────                    │
│                                                                 │
│  1️⃣ Answer 6-8    2️⃣ We traverse    3️⃣ Get your              │
│     simple           our knowledge      personalized           │
│     questions        graph              benefit plan           │
│                                                                 │
│  ────────────── For Government/NGOs ──────────────             │
│                                                                 │
│  [ 📊 View Leakage Dashboard ]                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Built for India 🇮🇳  •  Open Source  •  Made with ❤️          │
└─────────────────────────────────────────────────────────────────┘

Components:

* Header - Navigation with language toggle
* HeroSection - Main CTA and value proposition
* PersonaCards - Quick demo access
* StatsBar - Impact numbers (animated counters)
* HowItWorks - Three-step explanation
* Footer - Links and attribution

State:

* language: 'en' | 'hi'
* selectedPersona: string | null

Actions:

* "Find My Schemes" → Navigate to /questions
* Persona card click → Navigate to /questions?persona={id}
* "View Leakage Dashboard" → Navigate to /dashboard


Screen 2: Question Flow
Route: /questions
Purpose: Collect user attributes through adaptive questioning
Layout:
┌─────────────────────────────────────────────────────────────────┐
│  [← Back]  SchemeGraph                           Step 3 of 7   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ░░░░░░░░░░░████████████████░░░░░░░░░░░░░  42%                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │     What is your primary occupation?                    │   │
│  │     आपका मुख्य व्यवसाय क्या है?                           │   │
│  │                                                         │   │
│  │     ┌─────────────────────────────────────────────┐     │   │
│  │     │                                             │     │   │
│  │     │   🌾  Farmer / किसान                        │     │   │
│  │     │                                             │     │   │
│  │     └─────────────────────────────────────────────┘     │   │
│  │                                                         │   │
│  │     ┌─────────────────────────────────────────────┐     │   │
│  │     │                                             │     │   │
│  │     │   👷  Daily Wage Worker / दिहाड़ी मजदूर       │     │   │
│  │     │                                             │     │   │
│  │     └─────────────────────────────────────────────┘     │   │
│  │                                                         │   │
│  │     ┌─────────────────────────────────────────────┐     │   │
│  │     │                                             │     │   │
│  │     │   🏪  Small Business / छोटा व्यापार          │     │   │
│  │     │                                             │     │   │
│  │     └─────────────────────────────────────────────┘     │   │
│  │                                                         │   │
│  │     ┌─────────────────────────────────────────────┐     │   │
│  │     │                                             │     │   │
│  │     │   💼  Employed / नौकरी                       │     │   │
│  │     │                                             │     │   │
│  │     └─────────────────────────────────────────────┘     │   │
│  │                                                         │   │
│  │     ┌─────────────────────────────────────────────┐     │   │
│  │     │                                             │     │   │
│  │     │   📝  Other / अन्य                          │     │   │
│  │     │                                             │     │   │
│  │     └─────────────────────────────────────────────┘     │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  💡 Why we ask: This helps us find agriculture,        │   │
│  │     employment, and occupation-specific schemes.       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                                        [ Skip → ] (if optional)│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Components:

* ProgressBar - Shows completion progress
* QuestionCard - Current question with options
* OptionButton - Selectable option (radio/checkbox style)
* HelpText - Why this question matters
* NavigationButtons - Back, Skip (if optional)

State:
typescriptDownloadCopy codeinterface QuestionFlowState {
  currentQuestionIndex: number;
  answers: Record<string, any>;
  questions: Question[];
  isLoading: boolean;
}
Question Types:
typescriptDownloadCopy codetype QuestionInputType = 'select' | 'radio' | 'number' | 'boolean' | 'text';

interface Question {
  id: string;
  attribute: string;
  text: { en: string; hi: string };
  input_type: QuestionInputType;
  options?: { value: string; label: { en: string; hi: string } }[];
  required: boolean;
  help_text?: { en: string; hi: string };
}
Transitions:

* On answer selection → Animate to next question
* On complete → Navigate to /results
* "Back" → Previous question with animation


Screen 3: Results Page
Route: /results
Purpose: Display eligible schemes with multiple view options
Layout:
┌─────────────────────────────────────────────────────────────────┐
│  [← New Search]  SchemeGraph                        [Share 📤]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  🎉 Great news, Ramesh!                                │   │
│  │                                                         │   │
│  │  You're eligible for 12 schemes                        │   │
│  │  worth ₹52,000 per year                                │   │
│  │                                                         │   │
│  │  ════════════════════════════════════════════════════  │   │
│  │  LIFETIME POTENTIAL: ₹12-15 LAKHS                      │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │📋 LIST  │ │🛤️ JOURNEY│ │📊 GRAPH │ │⚡OPTIMIZE│              │
│  │ (Active)│ │         │ │         │ │         │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Filter: [All ▼] [Agriculture] [Health] [Education] ...  │ │
│  │  Sort:   [Relevance ▼]                                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🌾  PM-KISAN Samman Nidhi                    ₹6,000/yr │   │
│  │      पीएम-किसान सम्मान निधि                              │   │
│  │      ████████████████████ 100% Eligible                 │   │
│  │      Agriculture • Central Scheme      [View Details →] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🏥  Ayushman Bharat PMJAY                   ₹5L coverage│   │
│  │      आयुष्मान भारत                                       │   │
│  │      ████████████████░░░░ 85% Highly Likely             │   │
│  │      Health • Central Scheme               [View Details →] │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🚜  Mukhyamantri Krishi Ashirwad           ₹25,000/yr │   │
│  │      मुख्यमंत्री कृषि आशीर्वाद                             │   │
│  │      ████████████████████ 100% Eligible                 │   │
│  │      Agriculture • Jharkhand              [View Details →] │   │
│  │                                                         │   │
│  │      ⚠️ CONFLICTS with PM-KISAN (choose one)            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ... more cards ...                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Sub-Views:
List View (default)

* Scrollable list of SchemeCard components
* Filter chips for categories
* Sort dropdown

Journey View

* JourneyTimeline component (see Section 8)
* Interactive timeline with phases
* Life event markers

Graph View

* GraphVisualization component (see Section 8)
* Interactive zoom/pan
* Click nodes for details

Optimizer View
┌─────────────────────────────────────────────────────────────────┐
│                    OPTIMIZED BENEFIT PORTFOLIO                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  CONFLICTS RESOLVED                                     │   │
│  │  ──────────────────                                     │   │
│  │                                                         │   │
│  │  PM-KISAN (₹6,000)  vs  MKAY-JH (₹25,000)             │   │
│  │                                                         │   │
│  │  ✓ Selected: MKAY-JH                                   │   │
│  │  Reason: Higher annual benefit (+₹19,000)              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  BENEFIT STACK                                          │   │
│  │  ─────────────                                          │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  PROTECTION LAYER                               │   │   │
│  │  │  Ayushman Bharat + PMFBY + PMSBY               │   │   │
│  │  │  ₹5L health + ₹2L crop + ₹2L life             │   │   │
│  │  ├─────────────────────────────────────────────────┤   │   │
│  │  │  INCOME LAYER                                   │   │   │
│  │  │  MKAY-JH + KCC                                  │   │   │
│  │  │  ₹25,000/yr + subsidized credit                │   │   │
│  │  ├─────────────────────────────────────────────────┤   │   │
│  │  │  FOUNDATION LAYER                               │   │   │
│  │  │  BPL Card (unlocks 8 schemes)                   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ════════════════════════════════════════════════════  │   │
│  │  OPTIMIZED TOTAL: ₹52,000/year + ₹9L coverage         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

State:
typescriptDownloadCopy codeinterface ResultsState {
  userAttributes: Record<string, any>;
  eligibleSchemes: Scheme[];
  journeyPlan: JourneyPlan;
  optimizedPortfolio: OptimizedPortfolio;
  graphData: GraphData;
  activeView: 'list' | 'journey' | 'graph' | 'optimizer';
  filters: {
    category: string | null;
    confidenceLevel: string | null;
  };
  sortBy: 'relevance' | 'value' | 'name';
}

Screen 4: Scheme Detail
Route: /schemes/[id]
Purpose: Detailed scheme info with co-pilot and explainability
Layout:
┌─────────────────────────────────────────────────────────────────┐
│  [← Back to Results]  SchemeGraph                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  🌾  PM-KISAN Samman Nidhi                              │   │
│  │      पीएम-किसान सम्मान निधि                                │   │
│  │                                                         │   │
│  │      Ministry of Agriculture                            │   │
│  │      Central Scheme • Open Enrollment                   │   │
│  │                                                         │   │
│  │  ┌───────────┐  ┌───────────────────────────────────┐   │   │
│  │  │  ₹6,000   │  │  ████████████████████ 100%       │   │   │
│  │  │  /year    │  │  You are ELIGIBLE ✓               │   │   │
│  │  │           │  │                                   │   │   │
│  │  │ ₹2,000    │  │  Disbursed in 3 installments     │   │   │
│  │  │ every 4   │  │  directly to bank account        │   │   │
│  │  │ months    │  │                                   │   │   │
│  │  └───────────┘  └───────────────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │📋 ABOUT  │ │❓WHY     │ │📄 DOCS   │ │🚀 APPLY  │          │
│  │ (Active) │ │ELIGIBLE  │ │REQUIRED  │ │  NOW     │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  ABOUT THIS SCHEME                                              │
│  ─────────────────                                              │
│                                                                 │
│  The PM-KISAN scheme provides income support of ₹6,000 per     │
│  year to all landholding farmer families across the country.   │
│  The amount is paid in three equal installments of ₹2,000      │
│  directly into the bank accounts of beneficiaries.             │
│                                                                 │
│  KEY BENEFITS:                                                  │
│  • ₹6,000 annual income support                                │
│  • Direct bank transfer (no middlemen)                         │
│  • Can be combined with crop insurance                         │
│                                                                 │
│  ELIGIBILITY CRITERIA:                                          │
│  • Landholding farmer family                                   │
│  • Not an income tax payer                                     │
│  • Not a government employee                                   │
│  • Not receiving pension > ₹10,000/month                       │
│                                                                 │
│  ⚠️ NOTE: This scheme CONFLICTS with Mukhyamantri Krishi       │
│     Ashirwad Yojana. You can claim only one.                   │
│                                                                 │
│  RELATED SCHEMES:                                               │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │ PMFBY       │  │ KCC         │                              │
│  │ Crop        │  │ Credit      │                              │
│  │ Insurance   │  │ Card        │                              │
│  └─────────────┘  └─────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Tab Views:
About Tab (above)
Why Eligible Tab (Explainability)

* ExplainabilityPanel component (see Section 8)
* Graph path visualization
* Legal citations

Documents Required Tab
┌─────────────────────────────────────────────────────────────────┐
│  DOCUMENTS CHECKLIST                                            │
│  ───────────────────                                            │
│                                                                 │
│  Based on your profile, here's what you'll need:               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✅  Aadhaar Card                         [Available]   │   │
│  │      आधार कार्ड                                          │   │
│  │                                                         │   │
│  │      You likely have this. Ensure Aadhaar is linked     │   │
│  │      to your bank account.                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✅  Land Records (Khatiyan/Patta)        [Available]   │   │
│  │      भूमि अभिलेख                                          │   │
│  │                                                         │   │
│  │      Get from: Circle Office or jharbhoomi.nic.in      │   │
│  │      Time: 1-3 days if applying fresh                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✅  Bank Passbook                        [Available]   │   │
│  │      बैंक पासबुक                                          │   │
│  │                                                         │   │
│  │      Any scheduled bank. Jan Dhan account works.        │   │
│  │      First page with account details needed.            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️ COMMON ISSUES:                                             │
│  • Aadhaar-bank seeding not done → Visit bank with Aadhaar    │
│  • Name mismatch → Get correction before applying              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Apply Now Tab (Co-Pilot)
┌─────────────────────────────────────────────────────────────────┐
│  APPLICATION CO-PILOT                                           │
│  ────────────────────                                           │
│                                                                 │
│  📍 Application Mode: ONLINE                                    │
│  🌐 Portal: pmkisan.gov.in                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [ 📥 DOWNLOAD PRE-FILLED FORM ]                        │   │
│  │  (We've filled what we know from your profile)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  STEP-BY-STEP GUIDE:                                            │
│                                                                 │
│  Step 1 ──────────────────────────────────────────────         │
│  Visit pmkisan.gov.in and click "New Farmer Registration"      │
│                                                                 │
│  Step 2 ──────────────────────────────────────────────         │
│  Select your state (Jharkhand) and enter Aadhaar number        │
│                                                                 │
│  Step 3 ──────────────────────────────────────────────         │
│  Verify OTP sent to Aadhaar-linked mobile                      │
│                                                                 │
│  Step 4 ──────────────────────────────────────────────         │
│  Fill land details and upload documents                        │
│                                                                 │
│  Step 5 ──────────────────────────────────────────────         │
│  Review and submit. Note down application number.              │
│                                                                 │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  NEED HELP? Visit a Common Service Center (CSC):               │
│  📍 Jan Seva Kendra, Main Market, Ranchi                       │
│     2.3 km away • Open 9 AM - 6 PM                             │
│     [Get Directions]                                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  [ 🌐 OPEN OFFICIAL PORTAL → ]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


Screen 5: Leakage Dashboard
Route: /dashboard
Purpose: Government/NGO view of unclaimed benefits
Layout:
┌─────────────────────────────────────────────────────────────────┐
│  [← Home]  SchemeGraph                    GOVERNMENT DASHBOARD  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Select Region:                                         │   │
│  │  State: [Jharkhand ▼]    District: [Ranchi ▼]          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  📊 RANCHI DISTRICT - BENEFIT LEAKAGE REPORT           │   │
│  │                                                         │   │
│  │  ┌───────────────┐  ┌───────────────┐                  │   │
│  │  │   ₹167 Cr     │  │    28.2%      │                  │   │
│  │  │   Unclaimed   │  │   Average     │                  │   │
│  │  │   Benefits    │  │   Gap Rate    │                  │   │
│  │  └───────────────┘  └───────────────┘                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  SCHEME-WISE GAP ANALYSIS                               │   │
│  │  ─────────────────────────                               │   │
│  │                                                         │   │
│  │  Scheme         Eligible  Enrolled  Gap    Unclaimed   │   │
│  │  ────────────────────────────────────────────────────  │   │
│  │  PM-KISAN       1,24,000   89,000   35,000  ₹21 Cr     │   │
│  │  ██████████████████░░░░░░░░░░  72%                      │   │
│  │                                                         │   │
│  │  Widow Pension    8,200    3,100    5,100  ₹3.6 Cr    │   │
│  │  ███████░░░░░░░░░░░░░░░░░░░░░  38%                      │   │
│  │                                                         │   │
│  │  Ayushman        4,50,000  3,20,000 1,30,000 ₹65 Cr   │   │
│  │  ██████████████░░░░░░░░░░░░░  71%                       │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────┬──────────────────────────┐   │
│  │  DEMOGRAPHIC GAPS            │  BLOCK-WISE HEATMAP      │   │
│  │  ─────────────────           │  ──────────────────      │   │
│  │                              │                          │   │
│  │  SC/ST:     42% gap          │  Kanke:     ████░ 67%   │   │
│  │  Female HH: 56% gap          │  Ratu:      ███░░ 58%   │   │
│  │  Elderly:   61% gap          │  Ormanjhi:  ██░░░ 32%   │   │
│  │                              │  Namkum:    █░░░░ 21%   │   │
│  │                              │                          │   │
│  └──────────────────────────────┴──────────────────────────┘   │
│                                                                 │
│  [ 📥 Export Report (PDF) ]  [ 📊 Export Data (CSV) ]          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Components:

* RegionSelector - State/District dropdowns
* SummaryCards - Total unclaimed, gap rate
* SchemeGapTable - Per-scheme breakdown with progress bars
* DemographicGaps - Bar chart or list
* BlockHeatmap - Geographic visualization
* ExportButtons - PDF/CSV download


11. Demo Data Strategy
Pre-Loaded Data
Data TypeCountSourceCentral Schemes25Manual entry from official sourcesJharkhand Schemes15Focus state for demoKarnataka Schemes10Second demo stateBihar Schemes10Third demo stateEligibility Rules150+Per scheme, manually craftedScheme Relations30Conflicts, dependenciesDocuments80+Per scheme requirementsQuestions10Adaptive question setDemo Personas3Ramesh, Lakshmi, ArjunDistricts5Sample leakage data
Demo Scenarios
Scenario 1: Ramesh (Primary Demo)
Profile:
- 45-year-old male farmer in rural Jharkhand
- BPL card holder, OBC category
- Daughter in Class 8
- Annual income: ~₹80,000
- Has cultivable land (2 acres)

Expected Output:
- 12 eligible schemes
- Journey plan spanning education + agriculture + retirement
- Conflict: PM-KISAN vs MKAY-JH (optimizer picks MKAY-JH)
- Total annual value: ₹52,000
- Lifetime potential: ₹12-15 lakhs

Scenario 2: Lakshmi (Widowed Mother)
Profile:
- 38-year-old widow in urban Karnataka
- BPL status, SC category
- Two children in school
- Works as domestic helper

Expected Output:
- 9 eligible schemes
- Focus on: widow pension, children's scholarships
- Journey emphasizes children's education pathway
- No major conflicts

Scenario 3: Arjun (Student)
Profile:
- 22-year-old engineering student in Bihar
- SC category, family income ₹2 lakhs
- First-generation college student

Expected Output:
- 7 eligible schemes
- Primarily education scholarships
- Includes skill development schemes

Realistic Numbers
For leakage dashboard:
jsonDownloadCopy code{
  "ranchi": {
    "pm_kisan": {"eligible": 124000, "enrolled": 89000},
    "ayushman_bharat": {"eligible": 450000, "enrolled": 320000},
    "widow_pension": {"eligible": 8200, "enrolled": 3100},
    "ujjwala": {"eligible": 45000, "enrolled": 41000},
    "pmay_g": {"eligible": 18000, "enrolled": 6200}
  }
}

12. Development Phases & Timeline
Phase 1: Foundation (Hours 0-6)
TaskOwnerTimeProject setup (Next.js + FastAPI)Full Stack1hDatabase schema + seed dataBackend2hBasic API endpoints (questions, eligibility)Backend2hComponent library setup (shadcn/ui)Frontend1h
Deliverable: Running local dev environment with working DB
Phase 2: Core Flow (Hours 6-14)
TaskOwnerTimeHome page UIFrontend1.5hQuestion flow UI + navigationFrontend2.5hEligibility engine implementationBackend2hResults page (List view)Frontend2h
Deliverable: Complete user flow from home → questions → results
Phase 3: Advanced Features (Hours 14-22)
TaskOwnerTimeJourney planner algorithmBackend1.5hJourney timeline UIFrontend2hScheme optimizer algorithmBackend1.5hOptimizer view UIFrontend1.5hScheme detail page + tabsFrontend1.5h
Deliverable: All 4 result views working
Phase 4: Polish (Hours 22-28)
TaskOwnerTimeGraph visualization (React Flow)Frontend2hExplainability panelFrontend1.5hLeakage dashboardFrontend1.5hAnimation and transitionsFrontend1h
Deliverable: All features complete
Phase 5: Demo Prep (Hours 28-32)
TaskOwnerTimeDemo data validationAll1hBug fixes and edge casesAll1.5hDeployment (Vercel + Railway)Full Stack1hDemo script rehearsalAll0.5h
Deliverable: Production deployment + rehearsed demo
Gantt Chart (Visual)
HOUR:  0    4    8    12   16   20   24   28   32
       │    │    │    │    │    │    │    │    │
Phase 1: Foundation
       ████████
            │
Phase 2: Core Flow
            █████████████████
                        │
Phase 3: Advanced Features
                        ████████████████
                                    │
Phase 4: Polish
                                    ████████████
                                            │
Phase 5: Demo Prep
                                            ████████


13. Deployment Strategy
Infrastructure
┌─────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   USER BROWSER                                                  │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────────┐                                      │
│   │   Vercel Edge       │   ← Frontend (Next.js)               │
│   │   CDN + SSR         │                                      │
│   │                     │                                      │
│   │   schemegraph.vercel.app                                   │
│   └──────────┬──────────┘                                      │
│              │                                                  │
│              │ API Calls                                        │
│              ▼                                                  │
│   ┌─────────────────────┐                                      │
│   │   Railway/Render    │   ← Backend (FastAPI)                │
│   │   Container         │                                      │
│   │                     │                                      │
│   │   api.schemegraph.xyz                                      │
│   │   ┌─────────────┐   │                                      │
│   │   │  SQLite DB  │   │   ← Embedded in container            │
│   │   │  (seed.db)  │   │                                      │
│   │   └─────────────┘   │                                      │
│   └─────────────────────┘                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Environment Configuration
Frontend (.env.local):
envDownloadCopy codeNEXT_PUBLIC_API_URL=https://api.schemegraph.xyz
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Optional
Backend (.env):
envDownloadCopy codeDATABASE_URL=sqlite:///./data/schemes.db
CORS_ORIGINS=["https://schemegraph.vercel.app", "http://localhost:3000"]
DEBUG=false
Deployment Commands
Frontend (Vercel):
bashDownloadCopy code# Connect GitHub repo to Vercel
# Auto-deploys on push to main

# Or manual deploy:
vercel --prod
Backend (Railway):
bashDownloadCopy code# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Copy seed database
COPY data/schemes.db /app/data/schemes.db

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
bashDownloadCopy code# Deploy via Railway CLI or GitHub integration
railway up
Pre-Deployment Checklist

*  All API endpoints working locally
*  Seed database with demo data
*  Environment variables configured
*  CORS settings correct
*  Demo personas loading correctly
*  Leakage dashboard data present
*  Mobile responsiveness tested
*  Load time < 3 seconds


14. Risk Mitigation
Technical Risks
RiskProbabilityImpactMitigationAPI latency issuesMediumHighUse SQLite (no network DB); cache responsesGraph visualization performanceMediumMediumLimit visible nodes; use virtualizationMobile responsiveness issuesLowMediumUse Tailwind responsive utilities; test earlyDeployment failuresLowHighTest deployment before final hours
Demo Risks
RiskProbabilityImpactMitigationNetwork issues during demoMediumCriticalDeploy locally as backup; preload dataBug discovered during demoMediumHighStick to rehearsed demo flow; have fallback pathsQuestions about scale/securityHighLowAcknowledge hackathon scope; describe future roadmap
Fallback Plans
If Backend Fails:

* Embed mock API responses in frontend
* Use static JSON files for demo data

If Deployment Fails:

* Run demo from localhost
* Record video backup of working demo

If Feature Incomplete:

* Mark as "Coming Soon" in UI
* Focus demo on completed features


15. Post-Hackathon Roadmap
Immediate Improvements (Week 1)

* Real gazette parsing pipeline (LLM-based)
* More schemes (target: 200+)
* More states coverage
* User feedback collection

Short-Term (Month 1)

* User accounts and saved profiles
* WhatsApp bot integration
* DigiLocker OAuth
* Outcome tracking system

Medium-Term (Month 2-3)

* Mobile app (React Native)
* Voice interface (Bhashini)
* Government API integrations
* NGO partnership program

Long-Term (Month 6+)

* Production knowledge graph (Neo4j)
* Machine learning for eligibility prediction
* Real-time gazette monitoring
* Multi-language support (12+ Indian languages)


Appendix A: File Structure
schemegraph/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── questions/
│   │   │   └── page.tsx                # Question flow
│   │   ├── results/
│   │   │   └── page.tsx                # Results page
│   │   ├── schemes/
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Scheme detail
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Leakage dashboard
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ...
│   │   ├── SchemeCard.tsx
│   │   ├── JourneyTimeline.tsx
│   │   ├── GraphVisualization.tsx
│   │   ├── ExplainabilityPanel.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts                      # API client
│   │   ├── store.ts                    # Zustand store
│   │   ├── utils.ts
│   │   └── animations.ts
│   ├── hooks/
│   │   ├── useEligibility.ts
│   │   ├── useJourney.ts
│   │   └── useGraph.ts
│   ├── types/
│   │   └── index.ts                    # TypeScript types
│   ├── public/
│   │   └── images/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/
│   ├── main.py                         # FastAPI app entry
│   ├── routers/
│   │   ├── questions.py
│   │   ├── eligibility.py
│   │   ├── schemes.py
│   │   ├── journey.py
│   │   ├── optimizer.py
│   │   ├── graph.py
│   │   └── dashboard.py
│   ├── engine/
│   │   ├── eligibility.py              # Eligibility engine
│   │   ├── journey.py                  # Journey planner
│   │   ├── optimizer.py                # Scheme optimizer
│   │   └── graph_builder.py            # Graph construction
│   ├── models/
│   │   └── schemas.py                  # Pydantic models
│   ├── database/
│   │   ├── connection.py
│   │   └── queries.py
│   ├── data/
│   │   ├── schemes.db                  # SQLite database
│   │   ├── seed_schemes.sql
│   │   └── seed_questions.sql
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── docs/
│   ├── TDD.md                          # This document
│   ├── API.md                          # API documentation
│   └── DEMO_SCRIPT.md                  # Demo walkthrough
│
├── scripts/
│   ├── seed_database.py                # Database seeding script
│   └── export_demo_data.py
│
├── README.md
├── .gitignore
└── docker-compose.yml                  # Local development


Appendix B: Quick Reference Commands
bashDownloadCopy code# ===== LOCAL DEVELOPMENT =====

# Frontend
cd frontend
npm install
npm run dev                    # Runs on localhost:3000

# Backend
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/seed_database.py  # Seed database
uvicorn main:app --reload      # Runs on localhost:8000

# ===== DEPLOYMENT =====

# Frontend (Vercel)
cd frontend
vercel --prod

# Backend (Railway)
cd backend
railway up

# ===== TESTING =====

# API test
curl http://localhost:8000/api/v1/questions

# Eligibility test
curl -X POST http://localhost:8000/api/v1/eligibility \
  -H "Content-Type: application/json" \
  -d '{"attributes": {"state": "Jharkhand", "occupation": "Farmer", "bpl_status": true}}'