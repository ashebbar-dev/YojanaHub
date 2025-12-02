from fastapi import APIRouter, HTTPException
from database.connection import query_db
from models.schemas import SchemeDetail, SchemeDocument
import json

router = APIRouter(prefix="/api/v1", tags=["schemes"])

@router.get("/schemes/{scheme_id}", response_model=SchemeDetail)
async def get_scheme_detail(scheme_id: str):
    """Get detailed scheme information"""
    try:
        # Fetch scheme
        scheme_query = "SELECT * FROM schemes WHERE id = ?"
        scheme_rows = query_db(scheme_query, (scheme_id,))

        if not scheme_rows:
            raise HTTPException(status_code=404, detail="Scheme not found")

        # Convert Row to dict for easier access
        scheme = dict(scheme_rows[0])

        # Fetch documents
        doc_query = "SELECT * FROM scheme_documents WHERE scheme_id = ?"
        doc_rows = query_db(doc_query, (scheme_id,))
        documents = [
            SchemeDocument(
                document_name=dict(row)['document_name'],
                document_name_hindi=dict(row).get('document_name_hindi'),
                is_mandatory=bool(dict(row)['is_mandatory']),
                how_to_obtain=dict(row).get('how_to_obtain'),
                typical_time=dict(row).get('typical_time')
            ) for row in doc_rows
        ]

        # Fetch related schemes (via relations)
        relations_query = """
            SELECT scheme_id_2, relation_type
            FROM scheme_relations
            WHERE scheme_id_1 = ? AND relation_type IN ('stacks', 'unlocks')
        """
        relation_rows = query_db(relations_query, (scheme_id,))
        related_schemes = [row['scheme_id_2'] for row in relation_rows]

        # Fetch conflicting schemes
        conflicts_query = """
            SELECT scheme_id_2
            FROM scheme_relations
            WHERE scheme_id_1 = ? AND relation_type = 'conflicts'
        """
        conflict_rows = query_db(conflicts_query, (scheme_id,))
        conflicts_with = [row['scheme_id_2'] for row in conflict_rows]

        # Parse JSON fields
        life_stages = json.loads(scheme['life_stages']) if scheme.get('life_stages') else None
        trigger_events = json.loads(scheme['trigger_events']) if scheme.get('trigger_events') else None

        return SchemeDetail(
            id=scheme['id'],
            name=scheme['name'],
            name_hindi=scheme.get('name_hindi'),
            ministry=scheme['ministry'],
            description=scheme['description'],
            description_hindi=scheme.get('description_hindi'),
            benefit_type=scheme['benefit_type'],
            benefit_value=scheme.get('benefit_value'),
            benefit_frequency=scheme['benefit_frequency'],
            life_stages=life_stages,
            trigger_events=trigger_events,
            application_url=scheme.get('application_url'),
            application_mode=scheme['application_mode'],
            deadline=scheme.get('deadline'),
            legal_citation=scheme.get('legal_citation'),
            icon=scheme['icon'],
            category=scheme['category'],
            state=scheme.get('state'),
            documents=documents,
            related_schemes=related_schemes,
            conflicts_with=conflicts_with
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
