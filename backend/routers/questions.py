from fastapi import APIRouter, HTTPException
from database.connection import query_db
from models.schemas import Question, QuestionOption, QuestionsResponse
import json

router = APIRouter(prefix="/api/v1", tags=["questions"])

@router.get("/questions", response_model=QuestionsResponse)
async def get_questions():
    """Get all questions ordered by priority"""
    try:
        # Query database
        query = "SELECT * FROM questions ORDER BY priority DESC"
        rows = query_db(query)

        # Transform to Question objects
        questions = []
        for row in rows:
            # Parse options from JSON string
            options = None
            if row['options']:
                option_list = json.loads(row['options'])
                options = [
                    QuestionOption(
                        value=opt,
                        label={"en": opt, "hi": opt}  # Simplified for now
                    ) for opt in option_list
                ]

            question = Question(
                id=row['id'],
                attribute=row['attribute'],
                text={"en": row['text_en'], "hi": row['text_hi']},
                input_type=row['input_type'],
                options=options,
                priority=row['priority']
            )
            questions.append(question)

        return QuestionsResponse(
            questions=questions,
            total_questions=len(questions)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
