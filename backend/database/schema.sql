-- YojanaHub Database Schema
-- SQLite database for government welfare schemes

-- Core Schemes Table
CREATE TABLE IF NOT EXISTS schemes (
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
CREATE TABLE IF NOT EXISTS scheme_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheme_id TEXT NOT NULL REFERENCES schemes(id),
    attribute TEXT NOT NULL, -- e.g., 'income', 'gender', 'state'
    operator TEXT NOT NULL CHECK(operator IN ('eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in', 'not_in', 'exists')),
    value TEXT NOT NULL, -- JSON-encoded value
    is_hard_constraint INTEGER DEFAULT 1, -- 0 for soft/probabilistic
    description TEXT
);

-- Required Documents
CREATE TABLE IF NOT EXISTS scheme_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheme_id TEXT NOT NULL REFERENCES schemes(id),
    document_name TEXT NOT NULL,
    document_name_hindi TEXT,
    is_mandatory INTEGER DEFAULT 1,
    how_to_obtain TEXT,
    typical_time TEXT -- e.g., "3-5 days"
);

-- Scheme Relationships (Conflicts, Dependencies, etc.)
CREATE TABLE IF NOT EXISTS scheme_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scheme_id_1 TEXT NOT NULL REFERENCES schemes(id),
    scheme_id_2 TEXT NOT NULL REFERENCES schemes(id),
    relation_type TEXT NOT NULL CHECK(relation_type IN ('conflicts', 'depends', 'stacks', 'unlocks', 'supersedes')),
    description TEXT
);

-- Questions for Adaptive Flow
CREATE TABLE IF NOT EXISTS questions (
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
CREATE TABLE IF NOT EXISTS personas (
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
CREATE TABLE IF NOT EXISTS districts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    population INTEGER,
    bpl_population INTEGER,
    farmer_population INTEGER,
    scheme_stats TEXT -- JSON: {"scheme_id": {"eligible": 1000, "enrolled": 500}}
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_scheme_rules_scheme ON scheme_rules(scheme_id);
CREATE INDEX IF NOT EXISTS idx_scheme_rules_attribute ON scheme_rules(attribute);
CREATE INDEX IF NOT EXISTS idx_scheme_docs_scheme ON scheme_documents(scheme_id);
CREATE INDEX IF NOT EXISTS idx_scheme_relations_scheme1 ON scheme_relations(scheme_id_1);
CREATE INDEX IF NOT EXISTS idx_scheme_relations_scheme2 ON scheme_relations(scheme_id_2);
CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
