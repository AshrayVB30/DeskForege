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
    
    # Azure OpenAI (Primary)
    AZURE_OPENAI_API_KEY: str = ""
    AZURE_OPENAI_ENDPOINT: str = ""
    API_VERSION: str = "2024-05-01-preview"
    AZURE_DEPLOYMENT: str = "gpt-4o"
    
    # LLM Farm
    LLMFARM_API_URL: str = ""
    LLMFARM_API_KEY: str = ""
    LLMFARM_CHAT_DEPLOYMENT_OPENAI: str = ""
    LLMFARM_CHAT_VERSION: str = ""
    
    # Super OPL
    SUPER_OPL_KEY: str = ""
    
    # DALL-E
    DALLE_OPENAI_ENDPOINT: str = ""
    DALLE_OPENAI_ENDPOINT_2: str = ""
    DALLE_AZURE_DEPLOYMENT: str = "dall-e-3"
    DALLE_API_VERSION: str = "2024-02-01"
    DALLE_OPENAI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
