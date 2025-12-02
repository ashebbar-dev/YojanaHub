from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from routers import questions, personas, eligibility, schemes, journey, optimizer, graph, dashboard

# Create FastAPI app
app = FastAPI(
    title="YojanaHub API",
    description="Government welfare schemes discovery and eligibility matching platform",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],  # Next.js frontend (multiple ports for dev)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(questions.router)
app.include_router(personas.router)
app.include_router(eligibility.router)
app.include_router(schemes.router)
app.include_router(journey.router)
app.include_router(optimizer.router)
app.include_router(graph.router)
app.include_router(dashboard.router)

@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "Welcome to YojanaHub API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "YojanaHub API",
        "version": "1.0.0"
    }
