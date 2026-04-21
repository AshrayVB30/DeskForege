from pydantic import BaseModel
from datetime import datetime
from typing import List, Any, Optional

class PresentationBase(BaseModel):
    title: str

class PresentationCreate(PresentationBase):
    prompt: str
    document_text: str = ""
    slide_count: int = 10
    tone: str = "Professional"

class SlideOut(BaseModel):
    title: str
    points: List[str]

class PresentationUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[List[SlideOut]] = None

class PresentationOut(PresentationBase):
    id: str
    user_id: str
    content: List[SlideOut]
    created_at: datetime
    
    class Config:
        from_attributes = True
