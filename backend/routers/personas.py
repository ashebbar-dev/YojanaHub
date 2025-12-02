from fastapi import APIRouter, HTTPException
from database.connection import query_db
from models.schemas import Persona, PersonasResponse, UserAttributes
import json

router = APIRouter(prefix="/api/v1", tags=["personas"])

@router.get("/personas", response_model=PersonasResponse)
async def get_personas():
    """Get all demo personas"""
    try:
        query = "SELECT * FROM personas"
        rows = query_db(query)

        personas = []
        for row in rows:
            # Convert Row to dict for easier access
            row_dict = dict(row)
            attributes_dict = json.loads(row_dict['attributes'])
            persona = Persona(
                id=row_dict['id'],
                name=row_dict['name'],
                name_hindi=row_dict.get('name_hindi'),
                age=row_dict['age'],
                attributes=UserAttributes(**attributes_dict),
                story=row_dict['story'],
                story_hindi=row_dict.get('story_hindi'),
                expected_scheme_count=row_dict['expected_scheme_count']
            )
            personas.append(persona)

        return PersonasResponse(personas=personas)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/personas/{persona_id}", response_model=Persona)
async def get_persona(persona_id: str):
    """Get single persona by ID"""
    try:
        query = "SELECT * FROM personas WHERE id = ?"
        rows = query_db(query, (persona_id,))

        if not rows:
            raise HTTPException(status_code=404, detail="Persona not found")

        row = rows[0]
        # Convert Row to dict for easier access
        row_dict = dict(row)
        attributes_dict = json.loads(row_dict['attributes'])

        return Persona(
            id=row_dict['id'],
            name=row_dict['name'],
            name_hindi=row_dict.get('name_hindi'),
            age=row_dict['age'],
            attributes=UserAttributes(**attributes_dict),
            story=row_dict['story'],
            story_hindi=row_dict.get('story_hindi'),
            expected_scheme_count=row_dict['expected_scheme_count']
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
