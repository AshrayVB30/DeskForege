from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, presentations, upload, export

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(presentations.router, prefix="/presentations", tags=["presentations"])
app.include_router(upload.router, prefix="/upload", tags=["upload"])
app.include_router(export.router, prefix="/export", tags=["export"])

@app.get("/")
def read_root():
    return {"message": "Welcome to DeckForge API"}
