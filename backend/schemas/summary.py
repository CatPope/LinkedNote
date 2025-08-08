from pydantic import BaseModel, HttpUrl

class SummaryRequest(BaseModel):
    url: HttpUrl
    mode: str # 요약 모드 (예: 'quick', 'detailed')

class SummaryResponse(BaseModel):
    summary: str
