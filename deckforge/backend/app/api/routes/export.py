from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from bson import ObjectId
import io

from app.db.session import get_db
from app.schemas.user import UserOut
from app.api.deps import get_current_user
from app.services.ppt_service import create_ppt_from_json

router = APIRouter()

async def _get_pres_for_export(id: str, db, current_user: UserOut):
    """Shared helper: fetch and validate a presentation for export."""
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid presentation ID format")
    pres = await db["presentations"].find_one({"_id": ObjectId(id), "user_id": current_user.id})
    if not pres:
        raise HTTPException(status_code=404, detail="Presentation not found")
    return pres

@router.get("/ppt/{id}")
async def export_ppt(
    id: str,
    db = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    pres = await _get_pres_for_export(id, db, current_user)
    ppt_stream = create_ppt_from_json(pres.get("content", []))
    headers = {
        'Content-Disposition': f'attachment; filename="presentation_{id}.pptx"'
    }
    return StreamingResponse(
        ppt_stream,
        headers=headers,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

@router.get("/pdf/{id}")
async def export_pdf(
    id: str,
    db = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    """
    PDF export is not yet implemented — returns the PPTX file as a fallback.
    Replace create_ppt_from_json with a real PDF renderer when ready.
    """
    pres = await _get_pres_for_export(id, db, current_user)
    ppt_stream = create_ppt_from_json(pres.get("content", []))
    headers = {
        'Content-Disposition': f'attachment; filename="presentation_{id}.pptx"'
    }
    return StreamingResponse(
        ppt_stream,
        headers=headers,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
