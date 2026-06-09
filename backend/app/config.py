from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "JobGuard API"
    secret_key: str = "change-this-in-production-use-env-var"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    database_url: str = "sqlite:///./jobguard.db"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    admin_email: str = "admin@jobguard.app"
    admin_password: str = "admin123"

    class Config:
        env_file = ".env"


settings = Settings()
