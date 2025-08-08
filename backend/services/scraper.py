import requests
from bs4 import BeautifulSoup

def scrape_url(url: str) -> str:
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()  # HTTP 오류 발생 시 예외 발생
        soup = BeautifulSoup(response.text, 'html.parser')

        # 여기서는 간단히 모든 텍스트를 추출합니다. 실제로는 더 정교한 파싱이 필요합니다.
        text_content = soup.get_text(separator=' ', strip=True)
        return text_content
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""
