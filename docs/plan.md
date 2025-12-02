SchemeGraph: Step-by-Step Development Guide
Complete Build Checklist for Hackathon Demo

> **Important Notes:**
> - For detailed algorithm implementations (eligibility engine, journey planner, optimizer), see **TDD.md Section 7**
> - Demo uses 12 schemes (TDD target of 50+ is post-hackathon goal)
> - Three demo personas (Ramesh, Lakshmi, Arjun) provide quick-demo functionality

How to Use This Guide
Each step follows this format:
STEP X.X: [Name]
├── Time: XX minutes
├── Depends on: [Previous steps required]
├── Description: What you're building
├── Tasks: Specific things to do
├── Test: How to verify it works
└── Done when: Clear success criteria

Rules:

* Complete steps in order within each phase
* Don't skip the "Test" step
* Mark each step complete before moving on
* If stuck for >15 minutes, move to next step and return later


Phase Overview
| Phase | Name | Duration | Steps | Cumulative |
|-------|------|----------|-------|------------|
| 0 | Setup | 30 min | 0.1 - 0.2 | 30 min |
| 1 | Backend Foundation | 2.5 hrs | 1.1 - 1.8 | 3 hrs |
| 2 | Core API Endpoints | 2 hrs | 2.1 - 2.6 | 5 hrs |
| 3 | Frontend Foundation | 2 hrs | 3.1 - 3.6 | 7 hrs |
| 4 | Question Flow | 3 hrs | 4.1 - 4.6 (+4.1.1) | 10 hrs |
| 5 | Results Page | 3 hrs | 5.1 - 5.8 | 13 hrs |
| 6 | Journey & Optimizer | 3 hrs | 6.1 - 6.6 | 16 hrs |
| 7 | Scheme Detail Page | 2.5 hrs | 7.1 - 7.6 | 18.5 hrs |
| 8 | Graph Visualization | 2 hrs | 8.1 - 8.4 | 20.5 hrs |
| 9 | Dashboard & Polish | 3 hrs | 9.1 - 9.6 (+9.1.1) | 23.5 hrs |
| 10 | Demo Preparation | 1.5 hrs | 10.1 - 10.5 | 25 hrs |

Total: ~25 hours of focused development

**Key Demo Steps (CRITICAL):**
- Step 4.1.1: Persona Quick-Load (one-click demo for judges)
- Step 7.3: Explainability Panel (shows WHY user is eligible)
- Step 9.1.1: Leakage Demo Data (realistic dashboard numbers)

Phase 0: Setup (30 minutes)
STEP 0.1: Create Project Structure
Time: 15 minutes
Depends on: Nothing

Description:
Create the folder structure for both frontend and backend.

Tasks:
□ Create root project folder "schemegraph"
□ Initialize git repository
□ Create "frontend" folder
□ Create "backend" folder
□ Create "docs" folder
□ Create .gitignore file with node_modules, .env, __pycache__, venv, .next

Test:
- Run "ls" or "dir" and verify all folders exist
- Run "git status" and verify git is initialized

Done when:
- Empty folder structure exists
- Git is tracking the project

STEP 0.2: Verify Development Tools
Time: 15 minutes
Depends on: 0.1

Description:
Ensure all required tools are installed and working.

Tasks:
□ Verify Node.js v18+ installed (node --version)
□ Verify npm installed (npm --version)
□ Verify Python 3.11+ installed (python --version)
□ Verify pip installed (pip --version)
□ Install VS Code extensions: Python, ES7 React snippets, Tailwind CSS IntelliSense

Test:
- Each command returns a version number without errors

Done when:
- All tools verified working
- IDE ready for development


Phase 1: Backend Foundation (2.5 hours)
STEP 1.1: Initialize Python Environment
Time: 15 minutes
Depends on: 0.2

Description:
Set up Python virtual environment and install dependencies.

Tasks:
□ Navigate to backend folder
□ Create virtual environment (python -m venv venv)
□ Activate virtual environment
□ Create requirements.txt with: fastapi, uvicorn, pydantic, aiosqlite, python-dotenv
□ Install all dependencies (pip install -r requirements.txt)

Test:
- Run "pip list" and verify all packages installed
- Run "python -c 'import fastapi; print(fastapi.__version__)'"

Done when:
- Virtual environment active
- All packages installed without errors

STEP 1.2: Create Basic FastAPI Application
Time: 15 minutes
Depends on: 1.1

Description:
Create the main FastAPI application file with CORS and health check.

Tasks:
□ Create main.py in backend folder
□ Import FastAPI and CORSMiddleware
□ Create FastAPI app instance with title "SchemeGraph API"
□ Add CORS middleware allowing localhost:3000
□ Add root endpoint returning welcome message
□ Add /health endpoint returning status

Test:
- Run "uvicorn main:app --reload"
- Visit http://localhost:8000 in browser
- Visit http://localhost:8000/health
- Visit http://localhost:8000/docs (Swagger UI)

Done when:
- Server runs without errors
- All three URLs return expected responses
- Swagger documentation loads

STEP 1.3: Create Database Schema
Time: 20 minutes
Depends on: 1.2

Description:
Write the SQL schema file defining all tables.

Tasks:
□ Create "database" folder inside backend
□ Create schema.sql file
□ Define "schemes" table with all columns (id, name, name_hindi, ministry, description, benefit_type, benefit_value, etc.)
□ Define "scheme_rules" table (scheme_id, attribute, operator, value, is_hard_constraint)
□ Define "scheme_documents" table
□ Define "scheme_relations" table
□ Define "questions" table
□ Define "personas" table
□ Define "districts" table
□ Add necessary indexes

Test:
- Open schema.sql in SQLite viewer/editor
- Run syntax check (no SQL errors)

Done when:
- Schema file complete with all 7 tables
- No syntax errors when validated

STEP 1.4: Create Database Connection Module
Time: 15 minutes
Depends on: 1.3

Description:
Create Python module to handle database connections and queries.

Tasks:
□ Create __init__.py in database folder (empty file)
□ Create connection.py in database folder
□ Write get_db_connection() function returning SQLite connection
□ Write init_database() function that runs schema.sql
□ Write query_db() helper function for SELECT queries
□ Write execute_db() helper function for INSERT/UPDATE queries
□ Ensure "data" folder is created automatically

Test:
- Import connection module in Python REPL
- Run init_database() function
- Verify schemes.db file created in data folder

Done when:
- Database file created successfully
- All helper functions work without errors

STEP 1.5: Create Seed Data
Time: 45 minutes
Depends on: 1.4

Description:
Create comprehensive seed data for demo purposes.

Tasks:
□ Create seed_data.py in database folder
□ Define SCHEMES list with 12 schemes:
  - PM-KISAN
  - Ayushman Bharat
  - Ujjwala
  - PMAY-G
  - Post-Matric Scholarship
  - Widow Pension (Jharkhand)
  - Kisan Credit Card
  - PMFBY
  - MKAY (Jharkhand)
  - Atal Pension
  - PMSBY
  - Sukanya Samriddhi
□ Define SCHEME_RULES list (2-4 rules per scheme)
□ Define SCHEME_RELATIONS list (conflicts, stacks)
□ Define SCHEME_DOCUMENTS list (2-3 docs per major scheme)
□ Define QUESTIONS list (10 questions)
□ Define PERSONAS list (3 personas: Ramesh, Lakshmi, Arjun)
□ Define DISTRICTS list (2 districts with stats)
□ Write seed_database() function to insert all data

Test:
- Run seed script
- Query database to verify data inserted
- Count rows in each table

Done when:
- All tables populated with demo data
- Can query and see realistic data

STEP 1.6: Create Pydantic Models
Time: 20 minutes
Depends on: 1.5

Description:
Define all request/response models for API type safety.

Tasks:
□ Create "models" folder inside backend
□ Create schemas.py file
□ Define UserAttributes model with all possible attributes
□ Define EligibilityRequest model
□ Define SchemeBasic model (for list display)
□ Define SchemeDetail model (for detail page)
□ Define EligibilityResponse model
□ Define JourneyResponse model
□ Define OptimizeResponse model
□ Define GraphResponse model (nodes, edges)
□ Define LeakageResponse model

Test:
- Import models in Python REPL
- Create sample instances
- Verify validation works

Done when:
- All models defined
- Models can be instantiated without errors

STEP 1.7: Create Eligibility Engine
Time: 30 minutes
Depends on: 1.6

Description:
Build the core algorithm that matches users to schemes.

Tasks:
□ Create "engine" folder inside backend
□ Create eligibility.py file
□ Write EligibilityEngine class
□ Implement _load_data() to cache schemes and rules
□ Implement evaluate_rule() for single rule checking
□ Implement check_eligibility() for single scheme
□ Implement find_all_eligible() to get all matching schemes
□ Implement confidence scoring (1.0 for hard match, 0.5-0.9 for soft)
□ Implement _get_confidence_label() returning "Eligible", "Highly Likely", etc.

Test:
- Create engine instance
- Test with Ramesh's attributes
- Verify returns expected schemes (~10-12)

Done when:
- Engine returns correct schemes for test personas
- Confidence levels calculated correctly

STEP 1.8: Create Database Initialization Script
Time: 10 minutes
Depends on: 1.7

Description:
Create a script that initializes and seeds the database.

Tasks:
□ Create init_db.py in backend root
□ Import init_database from connection module
□ Import seed_database from seed_data module
□ Write main function that:
  - Initializes database schema
  - Seeds all data
  - Prints confirmation message
□ Add if __name__ == "__main__" block

Test:
- Delete existing schemes.db
- Run "python init_db.py"
- Verify database recreated with all data

Done when:
- Single command creates full database
- Script can be run repeatedly without errors


Phase 2: Core API Endpoints (2 hours)
STEP 2.1: Create Questions Router
Time: 15 minutes
Depends on: 1.8

Description:
Create API endpoint to fetch questions for the adaptive flow.

Tasks:
□ Create "routers" folder inside backend
□ Create questions.py router file
□ Create GET /questions endpoint
□ Query database for all questions ordered by priority
□ Format response with text in both languages
□ Parse options from JSON string to list
□ Register router in main.py

Test:
- Start server
- Visit http://localhost:8000/api/v1/questions
- Verify returns list of 10 questions with proper structure

Done when:
- Endpoint returns all questions
- Questions sorted by priority (highest first)
- Options parsed correctly

STEP 2.2: Create Eligibility Router
Time: 25 minutes
Depends on: 2.1

Description:
Create API endpoint for eligibility calculation.

Tasks:
□ Create eligibility.py router file
□ Create POST /eligibility endpoint
□ Accept UserAttributes in request body
□ Initialize EligibilityEngine
□ Call find_all_eligible() with user attributes
□ Calculate total annual value
□ Build summary counts (eligible, highly likely, conditional)
□ Return formatted EligibilityResponse
□ Register router in main.py

Test:
- Use Swagger UI or curl to POST Ramesh's attributes
- Verify returns 10+ schemes
- Verify total value calculation correct

Done when:
- Endpoint accepts attributes and returns schemes
- Response includes confidence levels and totals

STEP 2.3: Create Personas Router
Time: 15 minutes
Depends on: 2.2

Description:
Create endpoints to fetch demo personas.

Tasks:
□ Create personas.py router file
□ Create GET /personas endpoint (list all)
□ Create GET /personas/{id} endpoint (single persona with attributes)
□ Parse attributes from JSON string
□ Include persona story and expected scheme count
□ Register router in main.py

Test:
- Visit http://localhost:8000/api/v1/personas
- Visit http://localhost:8000/api/v1/personas/ramesh
- Verify attributes are properly parsed JSON

Done when:
- Can fetch all personas
- Can fetch single persona with parsed attributes

STEP 2.4: Create Schemes Router
Time: 20 minutes
Depends on: 2.3

Description:
Create endpoints for scheme details.

Tasks:
□ Create schemes.py router file
□ Create GET /schemes/{id} endpoint
□ Fetch scheme by ID from database
□ Fetch associated documents
□ Fetch related schemes (via relations table)
□ Fetch conflicting schemes
□ Build complete SchemeDetail response
□ Register router in main.py

Test:
- Visit http://localhost:8000/api/v1/schemes/pm_kisan
- Verify includes documents, relations, conflicts

Done when:
- Scheme detail includes all related data
- Documents list populated
- Conflicts and relations included

STEP 2.5: Create Journey Router
Time: 25 minutes
Depends on: 2.4

Description:
Create endpoint for life journey planning.

Tasks:
□ Create journey.py router file
□ Create POST /journey endpoint
□ Accept attributes and eligible scheme IDs
□ Create JourneyPlanner class in engine folder
□ Implement phase categorization (immediate, short-term, medium-term, long-term)
□ Implement life event prediction based on user age and family
□ Calculate total values per phase
□ Build timeline visualization data
□ Calculate lifetime potential
□ Register router in main.py

Test:
- POST with Ramesh's data and his eligible schemes
- Verify journey has all 4 phases
- Verify timeline data structure correct

Done when:
- Journey endpoint returns phased plan
- Life events predicted based on attributes
- Timeline visualization data included

STEP 2.6: Create Optimizer and Graph Routers
Time: 20 minutes
Depends on: 2.5

Description:
Create endpoints for optimization and graph visualization.

Tasks:
□ Create optimizer.py router file
□ Create POST /optimize endpoint
□ Implement conflict detection between selected schemes
□ Implement greedy selection favoring higher value
□ Return selected schemes, conflicts resolved, stacking benefits

□ Create graph.py router file
□ Create GET /graph endpoint with query params for attributes
□ Build nodes (user, attributes, schemes)
□ Build edges (has_attribute, qualifies_for, conflicts_with)
□ Include layout hints for visualization

□ Register both routers in main.py

Test:
- Test /optimize with schemes that include conflicts
- Verify conflict resolution in response
- Test /graph and verify node/edge structure

Done when:
- Optimizer detects and resolves conflicts
- Graph endpoint returns proper structure
- Both endpoints registered and working


Phase 3: Frontend Foundation (2 hours)
STEP 3.1: Initialize Next.js Project
Time: 15 minutes
Depends on: 2.6

Description:
Create the Next.js frontend application.

Tasks:
□ Navigate to frontend folder
□ Run "npx create-next-app@latest . --typescript --tailwind --app --src-dir=no --import-alias='@/*'"
□ Choose: ESLint=Yes, App Router=Yes
□ Verify folder structure created
□ Run "npm run dev" to test

Test:
- Visit http://localhost:3000
- See default Next.js welcome page

Done when:
- Next.js app running
- Tailwind CSS configured
- TypeScript configured

STEP 3.2: Install Additional Dependencies
Time: 10 minutes
Depends on: 3.1

Description:
Install all required npm packages.

Tasks:
□ Install UI dependencies:
  npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-progress
□ Install utility libraries:
  npm install clsx tailwind-merge class-variance-authority
□ Install data/state management:
  npm install @tanstack/react-query zustand axios
□ Install form handling:
  npm install react-hook-form @hookform/resolvers zod
□ Install visualization:
  npm install reactflow recharts
□ Install animation:
  npm install framer-motion
□ Install icons:
  npm install lucide-react

Test:
- Run "npm run dev" - no errors
- Check package.json has all dependencies

Done when:
- All packages installed
- App still runs without errors

STEP 3.3: Set Up shadcn/ui
Time: 15 minutes
Depends on: 3.2

Description:
Initialize and install shadcn/ui components.

Tasks:
□ Run "npx shadcn-ui@latest init"
□ Choose: Style=Default, Base color=Slate, CSS variables=Yes
□ Install required components:
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add tabs
  npx shadcn-ui@latest add progress
  npx shadcn-ui@latest add select
  npx shadcn-ui@latest add dialog
  npx shadcn-ui@latest add badge
□ Verify components folder created

Test:
- Import Button component in page.tsx
- Render a test button
- Verify styled correctly

Done when:
- shadcn/ui initialized
- Components available in components/ui folder

STEP 3.4: Create API Client
Time: 15 minutes
Depends on: 3.3

Description:
Set up axios client and API functions.

Tasks:
□ Create lib folder in frontend
□ Create api.ts file
□ Create axios instance with baseURL from environment variable
□ Create fetchQuestions() function
□ Create calculateEligibility(attributes) function
□ Create fetchPersonas() function
□ Create fetchPersona(id) function
□ Create fetchSchemeDetail(id) function
□ Create fetchJourney(attributes, schemeIds) function
□ Create fetchOptimized(schemeIds) function
□ Create fetchGraph(attributes) function
□ Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

Test:
- Import api functions
- Call fetchQuestions() and log result
- Verify data returned from backend

Done when:
- All API functions created
- Successfully fetching from backend

STEP 3.5: Create Global State Store
Time: 15 minutes
Depends on: 3.4

Description:
Set up Zustand store for application state.

Tasks:
□ Create store.ts in lib folder
□ Define AppState interface with:
  - language: 'en' | 'hi'
  - userAttributes: Record<string, any>
  - eligibleSchemes: Scheme[]
  - currentStep: number
  - isLoading: boolean
□ Define actions:
  - setLanguage
  - setUserAttributes
  - updateAttribute
  - setEligibleSchemes
  - setCurrentStep
  - reset
□ Create useAppStore hook

Test:
- Import store in a component
- Set and get values
- Verify reactivity works

Done when:
- Store created and exported
- Actions work correctly

STEP 3.6: Create TypeScript Types
Time: 15 minutes
Depends on: 3.5

Description:
Define all TypeScript interfaces for type safety.

Tasks:
□ Create types folder
□ Create index.ts with all interfaces:
  - Question
  - QuestionOption
  - Scheme
  - SchemeDetail
  - SchemeDocument
  - EligibilityResult
  - JourneyPhase
  - JourneyPlan
  - GraphNode
  - GraphEdge
  - Persona
  - UserAttributes
  - LeakageData

Test:
- Import types in api.ts
- Add return types to API functions
- No TypeScript errors

Done when:
- All types defined
- API functions typed
- No TypeScript errors in project


Phase 4: Question Flow (2.5 hours)
STEP 4.1: Create Home Page Layout
Time: 25 minutes
Depends on: 3.6

Description:
Build the landing page with hero section and persona cards.

Tasks:
□ Clear default content from app/page.tsx
□ Create Header component with logo and language toggle
□ Create LanguageToggle component:
  - Toggle between English and Hindi
  - Store preference in Zustand store
  - Persist in localStorage
□ Create HeroSection component with:
  - Title and subtitle (bilingual)
  - "Find My Schemes" CTA button
  - Stats bar (schemes indexed, benefits discovered)
□ Create PersonaCard component showing name, avatar emoji, location
□ Display 3 persona cards below hero with "Quick Demo" labels
□ Add "For Government/NGOs" link to dashboard
□ Style with Tailwind using government-blue primary color

Test:
- Visit localhost:3000
- Verify page looks professional
- Click language toggle and verify text changes
- Click persona cards (navigation comes later)

Done when:
- Home page visually complete
- Language toggle works and persists
- Responsive on mobile

STEP 4.1.1: Implement Persona Quick-Load (CRITICAL FOR DEMO)
Time: 20 minutes
Depends on: 4.1

Description:
Add one-click demo functionality using pre-built personas.

Tasks:
□ Fetch personas from /api/v1/personas endpoint
□ Create PersonaQuickStart component with 3 cards:
  - Ramesh: 👨‍🌾 Farmer, Jharkhand
  - Lakshmi: 👩 Widow, Karnataka  
  - Arjun: 🎓 Student, Bihar
□ On persona card click:
  - Load persona's pre-filled attributes into store
  - Skip questions flow entirely
  - Call eligibility API immediately
  - Navigate directly to /results
□ Add "Try Demo" button on each persona card
□ Show loading spinner during API call

Test:
- Click Ramesh card → See his 12 schemes in results
- Click Lakshmi card → See her 9 schemes
- Click Arjun card → See his 7 schemes
- Demo takes < 3 seconds total

Done when:
- One-click demo works for all 3 personas
- Judges can see full results instantly
- No need to answer questions for demo

STEP 4.2: Create Questions Page Route
Time: 15 minutes
Depends on: 4.1

Description:
Set up the questions page with basic structure.

Tasks:
□ Create app/questions/page.tsx
□ Add "use client" directive at top
□ Create basic layout with:
  - Back button
  - Step indicator
  - Content area for questions
  - Progress bar at bottom
□ Read persona ID from URL params if present
□ Initialize store with persona attributes if applicable

Test:
- Navigate to /questions
- See basic page structure
- Navigate to /questions?persona=ramesh
- Verify URL param readable

Done when:
- Questions page route works
- Basic layout visible
- Can read URL parameters

STEP 4.3: Fetch and Display Questions
Time: 20 minutes
Depends on: 4.2

Description:
Load questions from API and display current question.

Tasks:
□ Use React Query to fetch questions on page load
□ Store questions in local state
□ Display current question (index 0) with:
  - Question text (both languages)
  - Progress indicator (Step X of Y)
□ Create loading state while fetching
□ Create error state if API fails

Test:
- Load questions page
- See first question displayed
- Check both English and Hindi text visible

Done when:
- Questions fetched from API
- First question displayed correctly
- Loading state works

STEP 4.4: Create Question Input Components
Time: 30 minutes
Depends on: 4.3

Description:
Build components for each question input type.

Tasks:
□ Create components/questions folder
□ Create SelectQuestion component for dropdown questions
□ Create RadioQuestion component for yes/no/option questions
□ Create NumberQuestion component for age input
□ Create QuestionCard wrapper that renders correct type
□ Style options as large, tappable cards (mobile-friendly)
□ Add selection animation/feedback
□ Show help text below question when available

Test:
- See appropriate input type for each question
- Select an option and verify visual feedback
- Test number input for age question

Done when:
- All input types render correctly
- Selection provides visual feedback
- Accessible and mobile-friendly

STEP 4.5: Implement Question Navigation
Time: 25 minutes
Depends on: 4.4

Description:
Add logic to navigate between questions and save answers.

Tasks:
□ On answer selection:
  - Save answer to store (updateAttribute)
  - Animate out current question
  - Advance to next question (increment currentStep)
  - Animate in next question
□ Add Back button functionality
□ Update progress bar based on current step
□ Add Skip button for optional questions
□ Handle special logic (e.g., if occupation is Student, skip farming questions)

Test:
- Answer first question, see second appear
- Click back, return to first with answer preserved
- Progress bar updates correctly

Done when:
- Full flow from Q1 to Q10 works
- Answers saved in store
- Back navigation works
- Progress bar accurate

STEP 4.6: Complete Flow and Navigate to Results
Time: 25 minutes
Depends on: 4.5

Description:
Handle completion and transition to results page.

Tasks:
□ Detect when last question answered
□ Show "Finding your schemes..." loading state
□ Call calculateEligibility API with collected attributes
□ Store eligible schemes in global store
□ Navigate to /results page
□ Handle API errors gracefully
□ Add celebration animation on completion (confetti or checkmark)

Test:
- Complete all questions
- See loading state
- Navigate to results (results page can be placeholder)
- Verify schemes stored in state

Done when:
- Full question flow completes
- API called with correct attributes
- Navigation to results works
- Loading/error states handled


Phase 5: Results Page (3 hours)
STEP 5.1: Create Results Page Layout
Time: 20 minutes
Depends on: 4.6

Description:
Build the results page shell with summary and tabs.

Tasks:
□ Create app/results/page.tsx
□ Add "use client" directive
□ Create header with back button and share icon
□ Create SummaryCard showing:
  - Number of eligible schemes
  - Total annual value
  - Lifetime potential
□ Create TabBar with 4 tabs: List, Journey, Graph, Optimizer
□ Add content area below tabs
□ Get eligible schemes from store

Test:
- Navigate to results after completing questions
- See summary card with correct numbers
- See 4 tabs (content empty for now)

Done when:
- Results page structure complete
- Summary shows correct data from store
- Tabs visible and clickable

STEP 5.2: Create SchemeCard Component
Time: 25 minutes
Depends on: 5.1

Description:
Build the reusable card for displaying a scheme in lists.

Tasks:
□ Create components/SchemeCard.tsx
□ Include:
  - Scheme icon (emoji)
  - Name (both languages)
  - Benefit value and frequency
  - Confidence bar (visual percentage)
  - Confidence label badge
  - Category tag
  - State tag (if state-specific)
  - "View Details" button
□ Style confidence bar with colors:
  - Green for 100%
  - Light green for 80-99%
  - Yellow for 50-79%
□ Add hover effect and click handler

Test:
- Import component and render with mock data
- Verify all fields display correctly
- Test different confidence levels

Done when:
- Card displays all scheme info
- Confidence visualization works
- Clickable with proper styling

STEP 5.3: Implement List View
Time: 25 minutes
Depends on: 5.2

Description:
Build the scheme list view with filtering and sorting.

Tasks:
□ Create SchemeList component
□ Render SchemeCard for each eligible scheme
□ Add filter chips at top:
  - All
  - By category (Agriculture, Health, Education, etc.)
  - By confidence (Eligible only, Include probable)
□ Add sort dropdown:
  - Relevance (default)
  - Highest value
  - Name A-Z
□ Implement filter logic
□ Implement sort logic
□ Show "No schemes found" for empty filter results

Test:
- See all schemes listed
- Filter by category and verify list updates
- Sort by value and verify order changes

Done when:
- All schemes displayed as cards
- Filtering works correctly
- Sorting works correctly

STEP 5.4: Add Conflict Indicators to List
Time: 15 minutes
Depends on: 5.3

Description:
Show conflict warnings on scheme cards.

Tasks:
□ Check each scheme's conflicts from API data
□ If scheme conflicts with another eligible scheme:
  - Show warning badge/icon
  - Show tooltip or inline text: "Conflicts with [Other Scheme]"
□ Style warning distinctively (orange/yellow)
□ Make conflicts clickable to highlight the conflicting scheme

Test:
- Verify PM-KISAN shows conflict with MKAY-JH
- Click conflict link and verify highlights other card

Done when:
- Conflicts clearly visible
- Users understand they can't claim both

STEP 5.5: Create Results Page Shell for Other Tabs
Time: 20 minutes
Depends on: 5.4

Description:
Set up placeholder content for Journey, Graph, and Optimizer tabs.

Tasks:
□ Create tab switching logic in results page
□ Create JourneyView placeholder component
□ Create GraphView placeholder component
□ Create OptimizerView placeholder component
□ Show correct component based on active tab
□ Maintain scroll position when switching tabs
□ Show "Coming up next..." or skeleton for incomplete views

Test:
- Click each tab
- See different content for each
- State preserved when switching back to List

Done when:
- Tab switching works
- Placeholder components render
- No errors on tab switch

STEP 5.6: Connect Scheme Cards to Detail Page
Time: 15 minutes
Depends on: 5.5

Description:
Make scheme cards navigate to detail page.

Tasks:
□ Add onClick handler to SchemeCard
□ Navigate to /schemes/[id] on click
□ Pass scheme ID as URL parameter
□ Add visual feedback on click (ripple or scale)

Test:
- Click a scheme card
- Navigate to /schemes/pm_kisan (or similar)
- Back button returns to results

Done when:
- Cards are clickable
- Navigation works
- URL includes scheme ID

STEP 5.7: Persist State Across Navigation
Time: 15 minutes
Depends on: 5.6

Description:
Ensure state persists when navigating between pages.

Tasks:
□ Verify Zustand store persists during navigation
□ If store is empty on results page, redirect to home
□ Add sessionStorage backup for critical state
□ Restore state from sessionStorage on page reload
□ Clear state on "New Search" action

Test:
- Complete flow, go to results, click scheme, go back
- All data still present
- Refresh results page - redirect to home (or restore state)

Done when:
- Navigation doesn't lose state
- Proper handling of direct URL access

STEP 5.8: Add Share Functionality
Time: 15 minutes
Depends on: 5.7

Description:
Allow users to share their results.

Tasks:
□ Add Share button to results header
□ On click, generate shareable text:
  "I discovered X government schemes worth ₹Y/year using SchemeGraph!"
□ Use Web Share API if available
□ Fallback to copy-to-clipboard
□ Show toast/notification on successful share/copy

Test:
- Click share button
- On mobile: native share sheet appears
- On desktop: text copied to clipboard

Done when:
- Share functionality works
- Appropriate feedback shown


Phase 6: Journey & Optimizer Views (3 hours)
STEP 6.1: Create Journey Timeline Component
Time: 35 minutes
Depends on: 5.8

Description:
Build the visual timeline for life journey planning.

Tasks:
□ Create components/JourneyTimeline.tsx
□ Fetch journey data from API using user attributes and scheme IDs
□ Design horizontal timeline with 4 phases:
  - Immediate (Now)
  - Short-term (1-2 years)
  - Medium-term (3-5 years)
  - Long-term (5+ years)
□ Each phase shows:
  - Phase label with year range
  - Total value for that phase
  - List of scheme names
  - Life events (if any)
□ Connect phases with timeline line
□ Highlight current phase (Immediate)
□ Make phases clickable to expand

Test:
- Load journey view
- See 4 phases with correct data
- Verify lifetime potential shown

Done when:
- Timeline renders all phases
- Data matches API response
- Visually appealing and clear

STEP 6.2: Add Life Events to Timeline
Time: 20 minutes
Depends on: 6.1

Description:
Display predicted life events on the timeline.

Tasks:
□ Parse life_events from journey API response
□ Show events as markers/callouts on timeline
□ Style distinctively from schemes (different color/icon)
□ Examples:
  - "Daughter enters Class 9"
  - "Retirement age reached"
□ Tooltip or expandable detail for each event

Test:
- For Ramesh, see daughter's education events
- Events appear at correct timeline positions

Done when:
- Life events visible on timeline
- Clear visual distinction from schemes

STEP 6.3: Implement Journey View Interactivity
Time: 25 minutes
Depends on: 6.2

Description:
Make timeline interactive and informative.

Tasks:
□ Click phase to expand/collapse scheme list
□ Click individual scheme to navigate to detail
□ Add "Start Here" indicator on immediate phase
□ Add cumulative value counter (animated)
□ Add "View all X schemes" button per phase
□ Mobile: make timeline scrollable horizontally

Test:
- Click phases to expand
- Click scheme to navigate
- Works on mobile viewport

Done when:
- Full interactivity working
- Responsive on all screen sizes

STEP 6.4: Create Optimizer View Component
Time: 35 minutes
Depends on: 6.3

Description:
Build the optimization results view.

Tasks:
□ Create components/OptimizerView.tsx
□ Fetch optimized portfolio from API
□ Display "Conflicts Resolved" section:
  - Show each conflict pair
  - Show which was selected and why
  - Show value difference
□ Display "Benefit Stack" visualization:
  - Layered visual (Foundation → Income → Protection)
  - Each layer shows schemes and combined value
□ Display "Excluded Schemes" section:
  - List schemes not selected
  - Show reason for exclusion
□ Show total optimized value prominently

Test:
- See conflict between PM-KISAN and MKAY-JH resolved
- See benefit stack with layers
- Total value matches expected

Done when:
- Optimizer view complete
- Conflicts clearly explained
- Stack visualization works

STEP 6.5: Add Stacking Benefits Display
Time: 20 minutes
Depends on: 6.4

Description:
Show which schemes can be combined for maximum benefit.

Tasks:
□ Parse stacking_benefits from optimizer response
□ Create "Schemes That Stack" card
□ Show pairs/groups of schemes that complement each other
□ Show combined value of stacked schemes
□ Add explanatory text: "You can claim both of these!"
□ Visual connection between stacking schemes

Test:
- See PM-KISAN + PMFBY stacking benefit
- Combined value shown correctly

Done when:
- Stacking benefits clearly displayed
- Users understand they can claim multiple

STEP 6.6: Polish Journey and Optimizer Views
Time: 25 minutes
Depends on: 6.5

Description:
Add finishing touches and animations.

Tasks:
□ Add entry animations when switching to these views
□ Add number counting animation for values
□ Ensure loading states while fetching data
□ Add empty states if no data
□ Test with all 3 personas for different scenarios
□ Fix any layout issues on different screen sizes

Test:
- Switch between all 4 tabs smoothly
- Animations enhance experience
- All personas show meaningful data

Done when:
- Views polished and professional
- Works for all test personas
- No console errors


Phase 7: Scheme Detail Page (2.5 hours)
STEP 7.1: Create Scheme Detail Page Route
Time: 20 minutes
Depends on: 6.6

Description:
Set up the scheme detail page with basic structure.

Tasks:
□ Create app/schemes/[id]/page.tsx
□ Extract scheme ID from URL params
□ Fetch scheme detail from API
□ Create page layout:
  - Back button
  - Scheme header (icon, name, ministry)
  - Benefit card (value, frequency)
  - Eligibility status badge
  - Tab bar for sections
□ Handle loading state
□ Handle 404 if scheme not found

Test:
- Navigate to /schemes/pm_kisan
- See scheme details loaded
- Back button returns to previous page

Done when:
- Detail page loads correctly
- Shows basic scheme info
- Error handling works

STEP 7.2: Create About Tab Content
Time: 20 minutes
Depends on: 7.1

Description:
Build the main information section.

Tasks:
□ Create SchemeAbout component
□ Display:
  - Full description (both languages)
  - Key benefits as bullet points
  - Eligibility criteria summary
  - Application mode (online/offline/CSC)
  - Deadline (if any)
□ Add "Conflicts with" warning if applicable
□ Show "Related Schemes" at bottom
□ Make related schemes clickable

Test:
- Read full description
- See eligibility criteria
- Click related scheme to navigate

Done when:
- About section complete
- All information displayed clearly

STEP 7.3: Create Explainability Tab (WHY ELIGIBLE)
Time: 30 minutes
Depends on: 7.2

Description:
Build the "Why You're Eligible" section with graph path and rule matching.

Tasks:
□ Create components/ExplainabilityPanel.tsx
□ Create two-column layout:
  - Left: Graph path visualization
  - Right: Legal basis citations
□ Graph path shows:
  - User node at top
  - Attribute nodes that matched
  - Arrows connecting to scheme
  - Checkmarks (✓) for matched conditions
  - X marks (✗) for failed optional conditions
□ Rule-by-rule breakdown showing:
  - Each eligibility rule from scheme_rules table
  - User's attribute value vs required value
  - Pass/Fail status for each rule
  - Confidence score contribution
□ Legal basis shows:
  - legal_reference field from scheme
  - Quoted eligibility text from official source
  - "View full notification" link (external)
□ Generate plain-language explanation:
  - "You qualify because you are a farmer in Jharkhand with BPL status"

Test:
- See visual path from user to scheme
- Read legal citation (e.g., "PM-JAY Guidelines 2018")
- See rule breakdown with match indicators
- Understand why eligible in plain language

Done when:
- ExplainabilityPanel component complete
- Visual + textual + legal explanations all shown
- User understands exactly WHY they're eligible

STEP 7.4: Create Documents Tab
Time: 25 minutes
Depends on: 7.3

Description:
Build the document checklist section.

Tasks:
□ Create SchemeDocuments component
□ Fetch documents from scheme detail response
□ Display each document as checklist item:
  - Document name (both languages)
  - Mandatory/Optional badge
  - Status indicator (✓ Available, ⚠️ May need, ✗ Missing)
  - "How to obtain" expandable section
□ Infer status from user attributes where possible
  - If user said they have BPL card, mark BPL documents as ✓
□ Add "Common Issues" section at bottom

Test:
- See document checklist
- Appropriate status indicators
- Can expand "how to obtain"

Done when:
- Document checklist complete
- Status indicators logical

STEP 7.5: Create Apply Tab (Co-Pilot)
Time: 30 minutes
Depends on: 7.4

Description:
Build the application assistance section.

Tasks:
□ Create SchemeCoPilot component
□ Display:
  - Application mode prominently
  - Official portal link/button
  - "Download Pre-filled Form" button (mock functionality)
  - Step-by-step application guide
  - Nearest service center (mock location data)
□ Steps should be numbered and clear
□ Add estimated time for each step
□ Add "Need Help?" section with CSC info

Test:
- See clear application steps
- External links open correctly
- Pre-fill button shows feedback

Done when:
- Co-pilot section complete
- Clear call-to-action
- Helpful guidance provided

STEP 7.6: Implement Tab Navigation and Polish
Time: 25 minutes
Depends on: 7.5

Description:
Complete tab functionality and add polish.

Tasks:
□ Implement tab switching between 4 sections
□ Remember last active tab when returning to page
□ Add smooth transitions between tabs
□ Ensure deep linking works (/schemes/pm_kisan?tab=documents)
□ Test all schemes have adequate data for all tabs
□ Add loading skeletons for each section
□ Final styling pass for consistency

Test:
- Switch between all tabs
- Direct link to specific tab works
- All schemes display correctly

Done when:
- Scheme detail page fully functional
- All 4 tabs working
- Professional appearance


Phase 8: Graph Visualization (2 hours)
STEP 8.1: Set Up React Flow
Time: 20 minutes
Depends on: 7.6

Description:
Configure React Flow for the knowledge graph.

Tasks:
□ Create components/GraphVisualization.tsx
□ Import ReactFlow and required components
□ Set up basic ReactFlow container with:
  - Background grid
  - Controls (zoom in/out, fit)
  - MiniMap
□ Configure node and edge types
□ Add container with proper height (calc 100vh - header)

Test:
- Render empty graph container
- Zoom and pan controls work
- MiniMap visible

Done when:
- React Flow container renders
- Basic controls functional

STEP 8.2: Create Custom Node Components
Time: 30 minutes
Depends on: 8.1

Description:
Design custom nodes for different entity types.

Tasks:
□ Create UserNode component:
  - Circular shape
  - "You" label
  - Avatar/icon
  - Prominent styling
□ Create AttributeNode component:
  - Rounded rectangle
  - Attribute value (e.g., "Farmer")
  - Category label (e.g., "Occupation")
  - Muted styling
□ Create SchemeNode component:
  - Card-like shape
  - Scheme icon and name
  - Benefit value
  - Color based on eligibility (green/yellow)
  - Click handler to navigate to detail

Test:
- Render each node type with mock data
- Visual distinction between types clear
- Scheme nodes clickable

Done when:
- All 3 node types styled
- Visually distinct and clear

STEP 8.3: Fetch and Transform Graph Data
Time: 25 minutes
Depends on: 8.2

Description:
Get graph data from API and transform for React Flow.

Tasks:
□ In GraphView component, fetch from /graph endpoint
□ Pass user attributes as query params
□ Transform API nodes to React Flow nodes:
  - Add position from layout hints
  - Set node type based on API type
  - Add data object with display info
□ Transform API edges to React Flow edges:
  - Set edge style based on type (solid for qualifies, dashed for conflicts)
  - Add labels for conflict edges
  - Color code by relationship type
□ Handle loading state
□ Handle empty graph state

Test:
- Fetch graph for Ramesh's attributes
- See nodes and edges rendered
- Correct positions and connections

Done when:
- Graph fetches and renders
- Nodes positioned logically
- Edges connect correctly

STEP 8.4: Add Interactivity and Polish
Time: 25 minutes
Depends on: 8.3

Description:
Make the graph interactive and visually polished.

Tasks:
□ Add click handler on scheme nodes to open detail
□ Add hover effects on nodes (scale up, shadow)
□ Add legend explaining:
  - Node types (You, Attribute, Scheme)
  - Edge types (Qualifies, Conflicts)
□ Add "Fit View" button to reset zoom/pan
□ Highlight path from user to selected scheme on hover
□ Add entry animation when graph first renders
□ Test performance with full graph

Test:
- Click scheme node → navigates to detail
- Hover shows visual feedback
- Legend is clear and helpful
- Performance acceptable

Done when:
- Graph fully interactive
- Visual polish complete
- Performant with ~20 nodes


Phase 9: Dashboard & Polish (2.5 hours)
STEP 9.1: Create Leakage Dashboard Page
Time: 30 minutes
Depends on: 8.4

Description:
Build the government/NGO dashboard for leakage analysis.

Tasks:
□ Create app/dashboard/page.tsx
□ Add RegionSelector component:
  - State dropdown (Jharkhand selected by default)
  - District dropdown (Ranchi selected by default)
□ Create summary cards:
  - Total unclaimed value (₹167 Cr for Ranchi demo)
  - Average gap percentage (28.2% for demo)
□ Fetch leakage data from API (create endpoint if needed)
□ Display scheme-wise gap table:
  - Scheme name
  - Eligible count
  - Enrolled count
  - Gap count and percentage
  - Unclaimed value
  - Visual progress bar

Test:
- Navigate to /dashboard
- Select Jharkhand → Ranchi
- See leakage statistics

Done when:
- Dashboard displays data
- Region selection works

STEP 9.1.1: Seed Leakage Demo Data
Time: 15 minutes
Depends on: 9.1

Description:
Add realistic demo data for the leakage dashboard.

Tasks:
□ Add leakage_data table to schema if not exists
□ Seed demo data for Ranchi district:
  ```
  pm_kisan: eligible=124000, enrolled=89000, gap=35000, unclaimed=₹21Cr
  ayushman_bharat: eligible=450000, enrolled=320000, gap=130000, unclaimed=₹65Cr
  widow_pension: eligible=8200, enrolled=3100, gap=5100, unclaimed=₹3.6Cr
  ujjwala: eligible=45000, enrolled=41000, gap=4000, unclaimed=₹0.64Cr
  pmay_g: eligible=18000, enrolled=6200, gap=11800, unclaimed=₹14.16Cr
  ```
□ Add demographic gap data:
  - SC/ST: 42% gap
  - Female-headed households: 56% gap
  - Elderly (60+): 61% gap
□ Create /api/v1/dashboard/leakage endpoint if not exists

Test:
- Dashboard shows realistic numbers
- Total unclaimed sums correctly
- Percentages calculate properly

Done when:
- Demo data looks realistic for judges
- No placeholder or fake-looking values

STEP 9.2: Add Dashboard Visualizations
Time: 25 minutes
Depends on: 9.1

Description:
Add charts and visual elements to dashboard.

Tasks:
□ Add demographic gaps section:
  - Bar chart showing gap % by category
  - SC/ST, Female-headed, Elderly categories
□ Add block-wise heatmap (simplified):
  - List of blocks with color-coded gap severity
  - Red for high gap, green for low
□ Use Recharts for any bar/pie charts
□ Add data source attribution note

Test:
- See charts render with data
- Colors accurately represent severity
- Charts are readable

Done when:
- Dashboard visually complete
- Data clearly presented

STEP 9.3: Add Export Functionality
Time: 15 minutes
Depends on: 9.2

Description:
Allow downloading dashboard data.

Tasks:
□ Add "Export PDF" button (mock functionality - show toast)
□ Add "Export CSV" button:
  - Generate CSV string from table data
  - Trigger download
□ Add print-friendly styles

Test:
- Click Export CSV
- CSV file downloads with correct data
- PDF shows coming soon message

Done when:
- CSV export works
- User feedback on actions

STEP 9.4: Global UI Polish
Time: 30 minutes
Depends on: 9.3

Description:
Final pass on all UI elements for consistency.

Tasks:
□ Verify consistent spacing throughout app
□ Verify consistent typography (headings, body, captions)
□ Verify consistent color usage
□ Check all buttons have hover/active states
□ Check all links are styled consistently
□ Verify loading states on all pages
□ Verify error states show user-friendly messages
□ Add page transitions using Framer Motion
□ Test on mobile viewport (375px)
□ Test on tablet viewport (768px)

Test:
- Navigate through entire app
- No visual inconsistencies
- Smooth experience on all devices

Done when:
- Visually cohesive
- Professional appearance

STEP 9.5: Performance Optimization
Time: 20 minutes
Depends on: 9.4

Description:
Ensure app loads and runs quickly.

Tasks:
□ Check bundle size with "npm run build"
□ Lazy load heavy components:
  - Graph visualization
  - Charts
□ Add loading skeletons to prevent layout shift
□ Optimize images (if any)
□ Verify API calls are not duplicated
□ Add React Query caching for repeat fetches

Test:
- Build and check output size
- Lighthouse performance audit > 80
- No unnecessary re-renders

Done when:
- Build succeeds
- Page loads under 3 seconds
- No performance warnings

STEP 9.6: Accessibility Check
Time: 20 minutes
Depends on: 9.5

Description:
Ensure app is accessible to all users.

Tasks:
□ Run axe accessibility audit
□ Verify all images have alt text
□ Verify form inputs have labels
□ Verify sufficient color contrast (4.5:1 ratio)
□ Verify keyboard navigation works
□ Verify focus indicators visible
□ Add aria-labels where needed
□ Test with screen reader (basic check)

Test:
- Tab through app using keyboard only
- No accessibility errors in audit
- Focus visible on all interactive elements

Done when:
- No critical accessibility issues
- Keyboard navigation works


Phase 10: Demo Preparation (1.5 hours)
STEP 10.1: Deploy Application
Time: 25 minutes
Depends on: 9.6

Description:
Deploy frontend and backend to cloud platforms.

Tasks:
□ Deploy backend to Railway or Render:
  - Connect GitHub repo
  - Set environment variables
  - Deploy and get URL
  - Test /health endpoint
□ Update frontend .env with production API URL
□ Deploy frontend to Vercel:
  - Connect GitHub repo
  - Set environment variables
  - Deploy and get URL
□ Test full flow on production URLs

Test:
- Visit production frontend URL
- Complete full question flow
- All API calls succeed

Done when:
- Both services deployed
- Full app working on production URLs

STEP 10.2: Verify Demo Personas
Time: 15 minutes
Depends on: 10.1

Description:
Test all three demo personas end-to-end.

Tasks:
□ Test Ramesh persona:
  - Click persona card
  - Skip through questions (pre-filled)
  - Verify ~12 schemes returned
  - Check journey view makes sense
  - Verify MKAY-JH vs PM-KISAN conflict
□ Test Lakshmi persona:
  - Verify widow pension appears
  - Verify relevant education schemes
□ Test Arjun persona:
  - Verify scholarship schemes
  - Verify SC-specific schemes

Test:
- All 3 personas return expected schemes
- No errors during flow
- Data makes sense for each profile

Done when:
- All personas working correctly
- Expected schemes appearing

STEP 10.3: Prepare Demo Script
Time: 20 minutes
Depends on: 10.2

Description:
Write out the exact demo flow.

Tasks:
□ Write intro (30 seconds):
  - Problem statement
  - Meet Ramesh
□ Write Question Flow section (90 seconds):
  - Show adaptive questions
  - Point out minimal questions
□ Write Results section (60 seconds):
  - Show 12 schemes discovered
  - Highlight total value
□ Write Journey section (60 seconds):
  - Walk through timeline
  - Point out daughter's education path
□ Write Optimizer section (60 seconds):
  - Show conflict resolution
  - Explain stacking benefits
□ Write Scheme Detail section (60 seconds):
  - Show co-pilot
  - Show explainability
□ Write Graph section (45 seconds):
  - Show knowledge graph
  - Explain eligibility path
□ Write Dashboard section (45 seconds):
  - Show leakage for Ranchi
  - Impact numbers
□ Write closing (30 seconds):
  - Impact potential
  - Call to action

Test:
- Read through script
- Time it (should be 6-8 minutes)
- Practice once

Done when:
- Written demo script complete
- Timing verified

STEP 10.4: Prepare Backup Plans
Time: 15 minutes
Depends on: 10.3

Description:
Prepare for potential demo failures.

Tasks:
□ Take screenshots of key screens
□ Record a video backup of full demo flow
□ Prepare offline fallback:
  - Download demo data as JSON
  - Can show data even if API fails
□ Test on backup internet connection (mobile hotspot)
□ Have URLs ready to share:
  - Production URL
  - GitHub repo
  - Backup video link

Test:
- Screenshots captured
- Video recorded and accessible
- Can present even without live internet

Done when:
- All backups prepared
- Confidence in handling failures

STEP 10.5: Final Rehearsal
Time: 15 minutes
Depends on: 10.4

Description:
Do a complete run-through of the demo.

Tasks:
□ Close all unnecessary browser tabs
□ Clear browser cache
□ Start from home page
□ Follow demo script exactly
□ Time the full presentation
□ Practice answering likely questions:
  - "How does the graph work?"
  - "Where does the data come from?"
  - "How would you scale this?"
  - "What's the business model?"
□ Adjust script if timing is off

Test:
- Complete run-through without errors
- Within time limit
- Confident with answers

Done when:
- Smooth run-through completed
- Ready for actual presentation


Completion Checklist
Phase Completion Tracker
PhaseStatusTime SpentNotesPhase 0: Setup☐___ minPhase 1: Backend Foundation☐___ minPhase 2: Core API Endpoints☐___ minPhase 3: Frontend Foundation☐___ minPhase 4: Question Flow☐___ minPhase 5: Results Page☐___ minPhase 6: Journey & Optimizer☐___ minPhase 7: Scheme Detail Page☐___ minPhase 8: Graph Visualization☐___ minPhase 9: Dashboard & Polish☐___ minPhase 10: Demo Preparation☐___ min
Feature Completion Tracker
FeatureWorkingPolishedDemo-ReadyHome Page☐☐☐Language Toggle☐☐☐Persona Selection☐☐☐Question Flow☐☐☐Eligibility Calculation☐☐☐Results - List View☐☐☐Results - Journey View☐☐☐Results - Optimizer View☐☐☐Results - Graph View☐☐☐Scheme Detail - About☐☐☐Scheme Detail - Explain☐☐☐Scheme Detail - Documents☐☐☐Scheme Detail - Co-Pilot☐☐☐Leakage Dashboard☐☐☐Deployment☐☐☐
Pre-Demo Checklist

*  Production deployment working
*  All 3 personas tested
*  Demo script prepared
*  Backup video recorded
*  Questions answers prepared
*  Browser cleared and ready
*  Confidence level: HIGH


Quick Reference
Key URLs During Development

* Frontend: http://localhost:3000
* Backend: http://localhost:8000
* API Docs: http://localhost:8000/docs

Key Commands
bashDownloadCopy code# Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev

# Build Frontend
npm run build

# Initialize Database
python init_db.py
If You Get Stuck

1. Check browser console for errors
2. Check terminal for backend errors
3. Verify API is running (visit /health)
4. Check network tab for failed requests
5. Google the exact error message
6. Move to next step, return later


Good luck with your hackathon! You've got this! 🚀