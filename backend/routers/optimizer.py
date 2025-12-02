from fastapi import APIRouter, HTTPException
from engine.optimizer import SchemeOptimizer
from models.schemas import OptimizeRequest, OptimizeResponse, OptimizedPortfolio, SchemeBasic
from database.connection import query_db

router = APIRouter(prefix="/api/v1", tags=["optimizer"])

optimizer = SchemeOptimizer()

@router.post("/optimize", response_model=OptimizeResponse)
async def optimize_schemes(request: OptimizeRequest):
    """Optimize scheme portfolio with conflict resolution"""
    try:
        if not request.eligible_scheme_ids:
            return OptimizeResponse(
                optimized_portfolio=OptimizedPortfolio(
                    selected_schemes=[],
                    total_annual_value=0
                ),
                excluded_schemes=[]
            )

        placeholders = ','.join('?' * len(request.eligible_scheme_ids))
        query = f"SELECT * FROM schemes WHERE id IN ({placeholders})"
        scheme_rows = query_db(query, tuple(request.eligible_scheme_ids))

        # Convert to SchemeBasic
        eligible_schemes = []
        for row in scheme_rows:
            row_dict = dict(row)
            eligible_schemes.append(SchemeBasic(
                id=row_dict['id'],
                name=row_dict['name'],
                name_hindi=row_dict.get('name_hindi'),
                ministry=row_dict['ministry'],
                benefit_type=row_dict['benefit_type'],
                benefit_value=row_dict.get('benefit_value'),
                benefit_frequency=row_dict['benefit_frequency'],
                icon=row_dict['icon'],
                category=row_dict['category'],
                state=row_dict.get('state')
            ))

        # Optimize
        result = optimizer.optimize_portfolio(
            eligible_schemes,
            request.max_applications,
            request.prefer_online
        )

        portfolio = OptimizedPortfolio(**result)

        return OptimizeResponse(
            optimized_portfolio=portfolio,
            excluded_schemes=result['excluded_schemes']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
