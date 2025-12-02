import sqlite3
import os
from pathlib import Path
from typing import List, Tuple, Any, Optional

# Database file path
DATABASE_PATH = Path(__file__).parent.parent / "data" / "schemes.db"

def ensure_data_folder():
    """Ensure data folder exists"""
    data_folder = DATABASE_PATH.parent
    data_folder.mkdir(parents=True, exist_ok=True)

def get_db_connection() -> sqlite3.Connection:
    """
    Returns SQLite database connection

    Returns:
        sqlite3.Connection: Database connection
    """
    ensure_data_folder()
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # Enable column access by name
    return conn

def init_database():
    """
    Initialize database by executing schema.sql
    Creates all tables and indexes
    """
    ensure_data_folder()

    # Read schema file
    schema_path = Path(__file__).parent / "schema.sql"
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    # Execute schema
    conn = get_db_connection()
    try:
        conn.executescript(schema_sql)
        conn.commit()
        print(f"[OK] Database initialized at {DATABASE_PATH}")
    except Exception as e:
        print(f"[ERROR] Database initialization failed: {e}")
        raise
    finally:
        conn.close()

def query_db(query: str, params: Tuple = ()) -> List[sqlite3.Row]:
    """
    Execute SELECT query and return results

    Args:
        query: SQL SELECT query
        params: Query parameters (tuple)

    Returns:
        List[sqlite3.Row]: Query results
    """
    conn = get_db_connection()
    try:
        cursor = conn.execute(query, params)
        results = cursor.fetchall()
        return results
    except Exception as e:
        print(f"[ERROR] Query failed: {e}")
        raise
    finally:
        conn.close()

def execute_db(query: str, params: Tuple = ()) -> int:
    """
    Execute INSERT/UPDATE/DELETE query

    Args:
        query: SQL INSERT/UPDATE/DELETE query
        params: Query parameters (tuple)

    Returns:
        int: Number of affected rows or lastrowid
    """
    conn = get_db_connection()
    try:
        cursor = conn.execute(query, params)
        conn.commit()
        return cursor.lastrowid or cursor.rowcount
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Execute failed: {e}")
        raise
    finally:
        conn.close()

def execute_many_db(query: str, data: List[Tuple]) -> int:
    """
    Execute INSERT query with multiple rows

    Args:
        query: SQL INSERT query
        data: List of tuples with data

    Returns:
        int: Number of inserted rows
    """
    conn = get_db_connection()
    try:
        cursor = conn.executemany(query, data)
        conn.commit()
        return cursor.rowcount
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Execute many failed: {e}")
        raise
    finally:
        conn.close()

def clear_database():
    """Delete and recreate the database"""
    if DATABASE_PATH.exists():
        DATABASE_PATH.unlink()
        print(f"[OK] Deleted existing database")
    init_database()
