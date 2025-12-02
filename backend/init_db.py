#!/usr/bin/env python3
"""
Database Initialization Script for YojanaHub
Initializes database schema and seeds with demo data
"""

import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from database.connection import clear_database
from database.seed_data import seed_database

def main():
    """Initialize and seed the database"""
    print("=" * 60)
    print("YojanaHub Database Initialization")
    print("=" * 60)

    try:
        # Clear and initialize database
        print("\n[STEP 1/2] Initializing database schema...")
        clear_database()

        # Seed with data
        print("\n[STEP 2/2] Seeding database with demo data...")
        seed_database()

        print("\n" + "=" * 60)
        print("[SUCCESS] Database initialized successfully!")
        print("=" * 60)
        print("\nDatabase location: backend/data/schemes.db")
        print("\nYou can now start the API server:")
        print("  cd backend")
        print("  uvicorn main:app --reload")
        print("\nAPI will be available at: http://localhost:8000")
        print("API docs will be at: http://localhost:8000/docs")
        print("\n" + "=" * 60)

    except Exception as e:
        print("\n" + "=" * 60)
        print(f"[ERROR] Database initialization failed: {e}")
        print("=" * 60)
        sys.exit(1)

if __name__ == "__main__":
    main()
