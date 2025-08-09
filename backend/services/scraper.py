import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")

def scrape_url(url: str) -> str:
    try:
        payload = {'api_key': SCRAPER_API_KEY, 'url': url}
        response = requests.get('http://api.scraperapi.com', params=payload, timeout=60)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        for tag_name in ['article', 'main', 'div', 'p']:
            main_content = soup.find(tag_name)
            if main_content:
                for unwanted_tag in ['script', 'style', 'nav', 'footer', 'header', 'aside']:
                    for tag in main_content.find_all(unwanted_tag):
                        tag.decompose()
                return main_content.get_text(separator=' ', strip=True)

        return soup.get_text(separator=' ', strip=True)

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""