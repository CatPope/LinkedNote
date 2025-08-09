import requests
from bs4 import BeautifulSoup

def scrape_url(url: str) -> str:
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()  # HTTP 오류 발생 시 예외 발생
        soup = BeautifulSoup(response.text, 'html.parser')

        # 주요 콘텐츠를 찾기 위한 태그 우선순위
        # 실제 웹사이트 구조에 따라 더 많은 태그나 클래스를 추가할 수 있습니다.
        for tag_name in ['article', 'main', 'div', 'p']:
            main_content = soup.find(tag_name)
            if main_content:
                # 스크립트, 스타일, 내비게이션, 푸터 등 불필요한 요소 제거
                for unwanted_tag in ['script', 'style', 'nav', 'footer', 'header', 'aside']:
                    for tag in main_content.find_all(unwanted_tag):
                        tag.decompose()
                return main_content.get_text(separator=' ', strip=True)

        # 적절한 태그를 찾지 못하면 전체 텍스트 반환
        return soup.get_text(separator=' ', strip=True)

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return ""
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""