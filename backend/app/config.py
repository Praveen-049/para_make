from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path=Path(__file__).parent.parent / '.env')

class Settings:
    DATABASE_URL: str = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/parachute_platform')
    SECRET_KEY: str = os.getenv('SECRET_KEY', 'supersecretkey')
    ALGORITHM: str = os.getenv('ALGORITHM', 'HS256')
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '60'))

settings = Settings()
