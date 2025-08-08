from fastapi import APIRouter, Depends
from ..schemas import summary as summary_schemas
from ..services import summarizer as summarizer_service

router = APIRouter()

@router.post("/summarize", response_model=summary_schemas.SummaryResponse)
async def summarize_url(request: summary_schemas.SummaryRequest):
    summary = summarizer_service.get_mock_summary(request.url, request.mode)
    return {"summary": summary}
