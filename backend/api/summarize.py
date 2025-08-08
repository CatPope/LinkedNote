from fastapi import APIRouter, Depends, HTTPException
from ..schemas import summary as summary_schemas
from ..services import summarizer as summarizer_service
from ..services import scraper as scraper_service

router = APIRouter()

@router.post("/summarize", response_model=summary_schemas.SummaryResponse)
async def summarize_url(request: summary_schemas.SummaryRequest):
    scraped_content = scraper_service.scrape_url(str(request.url))
    if not scraped_content:
        raise HTTPException(status_code=400, detail="Failed to scrape content from URL.")

    summary = summarizer_service.summarize_text_with_openai(scraped_content, request.mode)
    return {"summary": summary}