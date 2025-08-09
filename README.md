# LinkedNote

LinkedNote는 클립보드에서 웹 URL을 자동으로 감지하고, 해당 URL의 콘텐츠를 요약하여 제공하는 데스크톱 애플리케이션입니다. OpenAI API를 사용하여 요약 기능을 제공하며, 시스템 트레이에서 편리하게 접근할 수 있습니다.

## 기능

- **클립보드 모니터링**: 클립보드에 복사된 웹 URL을 실시간으로 감지합니다.
- **시스템 트레이 통합**: 백그라운드에서 실행되며 시스템 트레이 아이콘을 통해 접근할 수 있습니다.
- **URL 감지 알림**: 새로운 URL이 감지되면 OS 알림을 통해 사용자에게 알립니다.
- **다양한 요약 모드**: 빠른 요약, 자세한 요약, 태그 추출, 전체 텍스트 보기 등 다양한 요약 모드를 제공합니다.
- **OpenAI API 연동**: OpenAI의 강력한 언어 모델을 활용하여 정확하고 유용한 요약을 생성합니다.
- **API 키 관리**: 설정 창을 통해 OpenAI API 키를 안전하게 저장하고 관리할 수 있습니다.
- **요약 기록**: 생성된 요약 내용을 로컬 데이터베이스에 저장하여 기록을 관리합니다.

## 설치 및 실행

### 개발 환경 설정

1.  **리포지토리 클론**: 
    ```bash
    git clone https://github.com/CatPope/LinkedNote.git
    cd LinkedNote
    ```

2.  **백엔드 설정 (FastAPI)**:
    ```bash
    cd backend
    pip install -r requirements.txt
    cd ./..
    python -m alembic upgrade head
    ```

3.  **환경 변수 설정**: `.env.example` 파일을 `.env`로 복사하고 필요한 API 키를 입력합니다.
    ```bash
    cp .env.example .env
    # .env 파일에 OpenAI API 키와 암호화 키를 추가합니다.
    # SECRET_KEY="your-super-secret-key"
    # ALGORITHM="HS256"
    # OPENAI_API_KEY="your-openai-api-key"
    # ENCRYPTION_KEY="your-encryption-key" (python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())" 로 생성)
    ```

4.  **백엔드 서버 실행**: 
    ```bash
    uvicorn main:app --reload --port 8000
    ```

5.  **프론트엔드 설정 (Electron)**:
    ```bash
    cd electron-app
    npm install
    ```

6.  **Electron 애플리케이션 실행**: 
    ```bash
    npm start
    ```

### 배포 버전 설치 (Windows)

Windows용 설치 프로그램은 `dist` 폴더에 `.exe` 파일로 제공됩니다. 해당 파일을 다운로드하여 실행하면 LinkedNote가 설치됩니다.

## 사용법

1.  LinkedNote 애플리케이션을 실행합니다. 애플리케이션은 시스템 트레이에 아이콘으로 나타납니다.
2.  웹 브라우저나 다른 애플리케이션에서 요약하고 싶은 웹 페이지의 URL을 클립보드에 복사합니다.
3.  LinkedNote가 URL을 감지하면 시스템 알림이 나타납니다. 알림을 클릭하면 요약 모드 선택 팝업이 나타납니다.
4.  원하는 요약 모드(빠른 요약, 자세한 요약, 태그 추출, 전체 텍스트)를 선택합니다.
5.  선택한 모드에 따라 요약된 내용이 새로운 창에 표시됩니다. 요약된 내용은 자동으로 클립보드에 복사됩니다.

## 기여

기여를 환영합니다! 버그 보고, 기능 제안, 코드 기여 등 어떤 형태의 기여든 환영합니다. 자세한 내용은 `CONTRIBUTING.md` 파일을 참조해주세요.

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조해주세요.
