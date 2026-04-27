from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.schemas.presentation import PresentationCreate, PresentationOut, PresentationUpdate
from app.schemas.user import UserOut
from app.api.deps import get_current_user
import asyncio
from app.services.ai_service import generate_presentations_structure, generate_slide_image

router = APIRouter()

@router.post("/generate", response_model=PresentationOut)
async def generate_presentation(
    data: PresentationCreate, 
    db = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    enriched_prompt = (
        f"Topic Idea: {data.prompt}\n"
        f"Tone/Style: {data.tone}\n"
        f"Target Slide Count: {data.slide_count}"
    )
    slides = await generate_presentations_structure(
        prompt=enriched_prompt, 
        context_text=data.document_text
    )
    if not slides:
        raise HTTPException(status_code=500, detail="Failed to generate presentation content")
    
    # Generate images for each slide in parallel
    image_tasks = [generate_slide_image(slide["title"], slide["points"]) for slide in slides]
    image_urls = await asyncio.gather(*image_tasks)
    
    for i, slide in enumerate(slides):
        slide["image_url"] = image_urls[i]
        
    doc = {
        "user_id": current_user.id,
        "title": data.title,
        "content": slides,
        "created_at": datetime.utcnow()
    }
    result = await db["presentations"].insert_one(doc)
    doc["_id"] = result.inserted_id
    doc["id"] = str(doc["_id"])
    return PresentationOut(**doc)

@router.get("", response_model=List[PresentationOut])
async def get_presentations(
    db = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    cursor = db["presentations"].find({"user_id": current_user.id}).sort("created_at", -1)
    results = await cursor.to_list(length=100)
    
    out = []
    for r in results:
        r["id"] = str(r["_id"])
        out.append(PresentationOut(**r))
    return out

@router.get("/{id}", response_model=PresentationOut)
async def get_presentation(
    id: str,
    db = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid presentation ID format")
        
    pres = await db["presentations"].find_one({"_id": ObjectId(id), "user_id": current_user.id})
    if not pres:
        raise HTTPException(status_code=404, detail="Presentation not found")
        
    pres["id"] = str(pres["_id"])
    return PresentationOut(**pres)

@router.delete("/{id}", status_code=204)
async def delete_presentation(
    id: str,
    db = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid presentation ID format")
    result = await db["presentations"].delete_one(
        {"_id": ObjectId(id), "user_id": current_user.id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Presentation not found")

@router.patch("/{id}", response_model=PresentationOut)
async def update_presentation(
    id: str,
    data: PresentationUpdate,
    db = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    """Persist live slide edits made in the Preview editor."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid presentation ID format")

    update_fields: dict = {}
    if data.title is not None:
        update_fields["title"] = data.title
    if data.content is not None:
        update_fields["content"] = [s.model_dump() for s in data.content]

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = await db["presentations"].find_one_and_update(
        {"_id": ObjectId(id), "user_id": current_user.id},
        {"$set": update_fields},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Presentation not found")

    result["id"] = str(result["_id"])
    return PresentationOut(**result)
