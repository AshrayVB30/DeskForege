from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "DeckForge API"
    SECRET_KEY: str = "supersecretkey_please_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # MongoDB Config
    DATABASE_URL: str = "mongodb://localhost:27017/deckforge"
    
    # AI Settings
    GEMINI_API_KEY: str = ""
    azure_openai_api_key: str = ""
    azure_openai_endpoint: str = ""
    api_version: str = ""
    azure_deployment: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
