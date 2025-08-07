import requests
from bs4 import BeautifulSoup
from typing import Optional
from backend.utils.logger import setup_logger
import os

# Setup logger for this module
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)
scraper_logger = setup_logger('scraper_logger', os.path.join(log_dir, 'scraper.log'))

class ScraperService:
    def __init__(self):
        pass

    def fetch_and_parse(self, url: str, timeout: int = 5) -> Optional[str]:
        """
        Fetches the content from a given URL and parses it to extract main text content.
        """
        scraper_logger.info(f"Attempting to fetch and parse URL: {url}")
        try:
            response = requests.get(url, timeout=timeout)
            response.raise_for_status()  # Raise an HTTPError for bad responses (4xx or 5xx)
            scraper_logger.info(f"Successfully fetched URL: {url}")

            soup = BeautifulSoup(response.text, 'html.parser')

            # Prioritize common article content tags
            article_content = soup.find('article')
            if article_content:
                scraper_logger.debug("Found <article> tag. Extracting content.")
                return self._extract_text_from_element(article_content)

            # Fallback to body if no article tag is found
            scraper_logger.debug("No <article> tag found. Falling back to <body> content.")
            return self._extract_text_from_element(soup.body)

        except requests.exceptions.RequestException as e:
            scraper_logger.error(f"Error fetching or parsing URL {url}: {e}")
            return None
        except Exception as e:
            scraper_logger.error(f"An unexpected error occurred during scraping: {e}")
            return None

    def _extract_text_from_element(self, element) -> str:
        """
        Extracts text from an element, focusing on common text-containing tags.
        """
        if not element:
            return ""

        texts = []
        for tag in element.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'div']):
            texts.append(tag.get_text(separator=' ', strip=True))
        return '\n'.join(filter(None, texts))