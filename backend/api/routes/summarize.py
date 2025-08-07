from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, HttpUrl
from sqlalchemy.orm import Session

from backend.services.scraper import ScraperService
from backend.services.summarizer import SummarizerService
from backend.config.settings import OPENAI_API_KEY
from backend.config.database import get_db
from backend.models.summary import Summary
from backend.utils.logger import setup_logger
import os

router = APIRouter()

# Setup logger for this module
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
summarize_logger = setup_logger('summarize_logger', os.path.join(log_dir, 'summarize.log'))

class SummarizeRequest(BaseModel):
    url: HttpUrl
    mode: str # This will be an Enum later

@router.post("/summarize")
async def summarize_url(request: SummarizeRequest, scraper: ScraperService = Depends(), db: Session = Depends(get_db)):
    summarize_logger.info(f"Summarize request received for URL: {request.url} with mode: {request.mode}")
    if not OPENAI_API_KEY:
        summarize_logger.error("OpenAI API key not configured.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="OpenAI API key not configured.")

    scraped_content = scraper.fetch_and_parse(str(request.url))

    if not scraped_content:
        summarize_logger.error(f"Failed to scrape content from URL: {request.url}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to scrape content from the URL.")

    summarizer = SummarizerService(api_key=OPENAI_API_KEY)
    summary_text = summarizer.summarize_text(scraped_content, request.mode)

    if not summary_text:
        summarize_logger.error(f"Failed to generate summary for URL: {request.url}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate summary.")

    # Save summary to database
    # For simplicity, assuming user ID 1 for now. In a real app, this would be authenticated user.
    try:
        db_summary = Summary(
            user_id=1, # Placeholder user_id
            url=str(request.url),
            original_content=scraped_content,
            summary_content=summary_text,
            mode=request.mode
        )
        db.add(db_summary)
        db.commit()
        db.refresh(db_summary)
        summarize_logger.info(f"Summary saved to DB for URL: {request.url}")
    except Exception as e:
        summarize_logger.error(f"Error saving summary to DB for URL {request.url}: {e}")
        # Decide if you want to raise HTTPException here or just log

    return {"success": True, "content": summary_text}