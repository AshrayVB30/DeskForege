from fastapi import APIRouter, Depends, UploadFile, File
from app.schemas.user import UserOut
from app.api.deps import get_current_user
from app.services.file_service import extract_text_from_file

router = APIRouter()

@router.post("")
async def upload_document(
    file: UploadFile = File(...),
    current_user: UserOut = Depends(get_current_user)
):
    contents = await file.read()
    extracted_text = await extract_text_from_file(file.filename, contents)
    
    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "message": "Upload successful"
    }
