from fastapi import APIRouter, HTTPException
from engine.journey import JourneyPlanner
from models.schemas import JourneyResponse, UserAttributes
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api/v1", tags=["journey"])

# Initialize planner
journey_planner = JourneyPlanner()

class JourneyRequest(BaseModel):
    """Request for journey planning"""
    user_age: int
    eligible_scheme_ids: List[str]
    has_school_children: bool = False
    occupation: str = None

@router.post("/journey", response_model=JourneyResponse)
async def generate_journey(request: JourneyRequest):
    """Generate life journey plan"""
    try:
        # Create UserAttributes from request
        user_attrs = UserAttributes(
            age=request.user_age,
            has_school_children=request.has_school_children,
            occupation=request.occupation
        )

        journey_data = journey_planner.generate_journey(
            user_attrs,
            request.eligible_scheme_ids
        )

        return JourneyResponse(**journey_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
