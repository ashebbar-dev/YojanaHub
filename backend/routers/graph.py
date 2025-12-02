from fastapi import APIRouter, HTTPException, Query
from engine.graph_builder import GraphBuilder
from models.schemas import GraphResponse
from typing import Optional

router = APIRouter(prefix="/api/v1", tags=["graph"])

graph_builder = GraphBuilder()

@router.get("/graph", response_model=GraphResponse)
async def get_graph(
    state: Optional[str] = Query(None),
    occupation: Optional[str] = Query(None),
    age: Optional[int] = Query(None),
    bpl_status: Optional[bool] = Query(None),
    eligible_scheme_ids: Optional[str] = Query(None)
):
    """Get knowledge graph visualization data"""
    try:
        # Build user attributes from query params
        user_attrs = {}
        if state:
            user_attrs['state'] = state
        if occupation:
            user_attrs['occupation'] = occupation
        if age:
            user_attrs['age'] = age
        if bpl_status is not None:
            user_attrs['bpl_status'] = bpl_status

        # Parse scheme IDs
        scheme_ids = None
        if eligible_scheme_ids:
            scheme_ids = eligible_scheme_ids.split(',')

        graph_data = graph_builder.build_graph(user_attrs, scheme_ids)

        return GraphResponse(**graph_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
