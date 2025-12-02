from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional
import os
from pathlib import Path

router = APIRouter(prefix="/api/v1", tags=["forms"])

# Get template directory
TEMPLATES_DIR = Path(__file__).parent.parent / "templates"

class FormRequest(BaseModel):
    scheme_id: str
    user_data: dict

@router.post("/forms/generate", response_class=HTMLResponse)
async def generate_form(request: FormRequest):
    """Generate a pre-filled form for a scheme"""
    try:
        # Map scheme IDs to template files
        template_map = {
            "pm_kisan": "pm_kisan_form.html",
            "pm-kisan": "pm_kisan_form.html",
            # Add more mappings as templates are created
        }
        
        template_name = template_map.get(request.scheme_id.lower())
        
        if not template_name:
            raise HTTPException(
                status_code=404,
                detail=f"Form template not available for scheme: {request.scheme_id}"
            )
        
        template_path = TEMPLATES_DIR / template_name
        
        if not template_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Template file not found: {template_name}"
            )
        
        # Read template
        with template_path.open('r', encoding='utf-8') as f:
            template_content = f.read()
        
        # Replace placeholders with user data
        filled_form = fill_template(template_content, request.user_data)
        
        return HTMLResponse(content=filled_form)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def fill_template(template: str, user_data: dict) -> str:
    """Fill template placeholders with user data"""
    # Define default values
    defaults = {
        "name": "N/A",
        "age": "N/A",
        "gender": "N/A",
        "aadhaar": "XXXX-XXXX-XXXX",
        "state": "N/A",
        "district": "N/A",
        "block": "N/A",
        "village": "N/A",
        "pincode": "N/A",
        "bank_name": "N/A",
        "account_number": "XXXX-XXXX-XXXX",
        "ifsc_code": "N/A",
    }
    
    # Merge user data with defaults
    data = {**defaults, **user_data}
    
    # Replace placeholders
    filled = template
    for key, value in data.items():
        placeholder = f"{{{{{key}}}}}"
        filled = filled.replace(placeholder, str(value))
    
    return filled
