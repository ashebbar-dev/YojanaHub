from fastapi import APIRouter, HTTPException, Query
from database.connection import query_db
from models.schemas import LeakageResponse, SchemeLeakage
import json

router = APIRouter(prefix="/api/v1", tags=["dashboard"])

@router.get("/dashboard/leakage", response_model=LeakageResponse)
async def get_leakage(
    district_id: str = Query(..., description="District ID")
):
    """Get leakage statistics for a district"""
    try:
        # Fetch district
        district_query = "SELECT * FROM districts WHERE id = ?"
        district_rows = query_db(district_query, (district_id,))

        if not district_rows:
            raise HTTPException(status_code=404, detail="District not found")

        district = district_rows[0]
        scheme_stats = json.loads(district['scheme_stats'])

        # Calculate leakage for each scheme
        scheme_leakages = []
        total_unclaimed = 0
        gap_percentages = []

        for scheme_id, stats in scheme_stats.items():
            eligible = stats['eligible']
            enrolled = stats['enrolled']
            gap = eligible - enrolled
            gap_pct = (gap / eligible * 100) if eligible > 0 else 0

            # Estimate unclaimed value
            scheme_query = "SELECT benefit_value, benefit_frequency FROM schemes WHERE id = ?"
            scheme_rows = query_db(scheme_query, (scheme_id,))

            unclaimed_value = 0
            if scheme_rows:
                value = scheme_rows[0]['benefit_value'] or 0
                freq = scheme_rows[0]['benefit_frequency']

                annual_value = value
                if freq == 'monthly':
                    annual_value = value * 12
                elif freq == 'quarterly':
                    annual_value = value * 4

                unclaimed_value = gap * annual_value

            total_unclaimed += unclaimed_value
            gap_percentages.append(gap_pct)

            # Get scheme name
            scheme_name_query = "SELECT name FROM schemes WHERE id = ?"
            name_rows = query_db(scheme_name_query, (scheme_id,))
            scheme_name = name_rows[0]['name'] if name_rows else scheme_id

            scheme_leakages.append(SchemeLeakage(
                scheme_id=scheme_id,
                scheme_name=scheme_name,
                eligible_count=eligible,
                enrolled_count=enrolled,
                gap_count=gap,
                gap_percentage=gap_pct,
                unclaimed_value=unclaimed_value
            ))

        avg_gap = sum(gap_percentages) / len(gap_percentages) if gap_percentages else 0

        return LeakageResponse(
            district=district['name'],
            state=district['state'],
            total_unclaimed_value=total_unclaimed,
            average_gap_percentage=avg_gap,
            scheme_leakages=scheme_leakages
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
