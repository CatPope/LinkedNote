from pydantic import BaseModel, HttpUrl
from datetime import datetime

class SummaryRequest(BaseModel):
    url: HttpUrl
    mode: str # 요약 모드 (예: 'quick', 'detailed')

class SummaryResponse(BaseModel):
    summary: str

class SummaryInDB(BaseModel):
    id: int
    url: str
    mode: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True