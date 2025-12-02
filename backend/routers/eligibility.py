from fastapi import APIRouter, HTTPException
from engine.eligibility import EligibilityEngine
from models.schemas import (
    EligibilityRequest,
    EligibilityResponse,
    EligibilitySummary
)

router = APIRouter(prefix="/api/v1", tags=["eligibility"])

# Initialize engine once (singleton pattern)
eligibility_engine = EligibilityEngine()

@router.post("/eligibility", response_model=EligibilityResponse)
async def calculate_eligibility(request: EligibilityRequest):
    """Calculate eligible schemes for given user attributes"""
    try:
        # Find eligible schemes using engine
        eligible_schemes = eligibility_engine.find_all_eligible(
            request.attributes,
            request.include_probabilistic
        )

        # Calculate summary statistics
        eligible_count = sum(1 for s in eligible_schemes if s.confidence >= 0.9)
        highly_likely_count = sum(1 for s in eligible_schemes if 0.7 <= s.confidence < 0.9)
        conditional_count = sum(1 for s in eligible_schemes if s.confidence < 0.7)

        # Calculate total annual value
        total_annual_value = 0
        for scheme in eligible_schemes:
            if scheme.benefit_value:
                # Convert to annual value based on frequency
                if scheme.benefit_frequency == 'annual':
                    total_annual_value += scheme.benefit_value
                elif scheme.benefit_frequency == 'monthly':
                    total_annual_value += scheme.benefit_value * 12
                elif scheme.benefit_frequency == 'quarterly':
                    total_annual_value += scheme.benefit_value * 4
                # one_time not included in annual calculation

        summary = EligibilitySummary(
            eligible_count=eligible_count,
            highly_likely_count=highly_likely_count,
            conditional_count=conditional_count,
            total_annual_value=total_annual_value
        )

        return EligibilityResponse(
            eligible_schemes=eligible_schemes,
            total_count=len(eligible_schemes),
            summary=summary
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
