# LinkedNote

## 개요

LinkedNote는 클립보드에 복사된 웹 링크를 자동으로 감지하고, AI 기반 요약 기능을 제공하는 데스크톱 애플리케이션입니다. 이 애플리케이션은 사용자가 웹 콘텐츠를 빠르고 효율적으로 소비하고 관리할 수 있도록 돕습니다.

## 기술 스택

LinkedNote는 다음과 같은 기술 스택으로 구성되어 있습니다:

### 백엔드 (FastAPI)
- **FastAPI**: 빠르고 현대적인 웹 프레임워크.
- **SQLAlchemy**: ORM (Object Relational Mapper)을 통한 데이터베이스 상호작용.
- **PyJWT & passlib[bcrypt]**: JWT 기반 인증 및 비밀번호 해싱.
- **requests & BeautifulSoup4**: 웹 스크래핑.
- **openai**: OpenAI API를 통한 AI 요약.
- **cryptography**: API 키 암호화.
- **uvicorn**: ASGI 서버.

### 프론트엔드 (Electron + React)
- **Electron**: 크로스 플랫폼 데스크톱 애플리케이션 개발.
- **React**: 사용자 인터페이스 구축.
- **electron-builder**: 애플리케이션 패키징 및 배포.
- **electron-log**: 로깅.
- **node-fetch**: 백엔드 API 통신.

### 개발 및 배포
- **Docker & Docker Compose**: 컨테이너화된 개발 및 배포 환경.

## 설정

LinkedNote를 로컬 환경에서 설정하고 실행하는 방법입니다.

### 1. 환경 변수 설정

`backend` 디렉토리와 프로젝트 루트에 있는 `.env.example` 파일을 `.env`로 복사하고 필요한 환경 변수를 설정합니다.

**`./.env` (프로젝트 루트):**
```env
# Electron 앱 관련 환경 변수 (필요시)
```

**`./backend/.env` (백엔드 디렉토리):**
```env
DATABASE_URL="sqlite:///./sql_app.db"
SECRET_KEY="YOUR_SUPER_SECRET_KEY"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
ENCRYPTION_KEY="YOUR_32_BYTE_ENCRYPTION_KEY" # 32바이트 길이의 임의의 문자열 (예: openssl rand -hex 16)
```

### 2. Docker Compose를 사용한 실행 (권장)

프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 백엔드와 Electron 앱을 함께 빌드하고 실행합니다.

```bash
docker-compose up --build
```

이 명령어는 백엔드 서비스를 `http://localhost:8000`에서 시작하고, Electron 앱을 빌드하여 실행합니다.

### 3. 수동 실행

#### 백엔드 (FastAPI)

1.  `backend` 디렉토리로 이동합니다:
    ```bash
    cd backend
    ```
2.  가상 환경을 생성하고 활성화합니다:
    ```bash
    python -m venv venv
    ./venv/Scripts/activate # Windows
    source venv/bin/activate # macOS/Linux
    ```
3.  종속성을 설치합니다:
    ```bash
    pip install -r requirements.txt
    ```
4.  애플리케이션을 실행합니다:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    ```
    백엔드는 `http://localhost:8000`에서 실행됩니다.

#### 프론트엔드 (Electron)

1.  `electron-app` 디렉토리로 이동합니다:
    ```bash
    cd electron-app
    ```
2.  종속성을 설치합니다:
    ```bash
    npm install
    ```
3.  Electron 앱을 개발 모드로 실행합니다:
    ```bash
    npm start
    ```

## 사용법

1.  **URL 감지**: LinkedNote 앱이 실행 중인 동안, 웹 브라우저에서 URL을 클립보드에 복사하면 앱이 이를 자동으로 감지합니다.
2.  **알림**: URL이 감지되면 시스템 트레이 알림이 나타납니다.
3.  **요약 모드 선택**: 알림을 클릭하면 작은 팝업 창이 나타나며, 여기서 요약, 태그, 전체 내용 중 원하는 요약 모드를 선택할 수 있습니다.
4.  **결과 표시**: 선택한 모드에 따라 AI가 웹 페이지를 분석하고 요약 결과를 새 창에 표시합니다. 요약된 내용은 자동으로 클립보드에 복사됩니다.
5.  **설정**: 시스템 트레이 아이콘을 우클릭하여 설정 메뉴에 접근할 수 있습니다. 설정 창에서는 OpenAI API 키를 입력하고 저장할 수 있으며, 이전 요약 기록을 확인할 수 있습니다.

## 빌드 및 배포

Electron 앱은 `electron-builder`를 사용하여 다양한 플랫폼용 설치 파일을 생성할 수 있습니다.

1.  `electron-app` 디렉토리로 이동합니다:
    ```bash
    cd electron-app
    ```
2.  빌드 명령어를 실행합니다:
    ```bash
    npm run build
    ```
    이 명령어는 `dist` 디렉토리에 플랫폼별 설치 파일을 생성합니다.

## 기여

기여를 환영합니다! 버그 리포트, 기능 요청 또는 코드 기여를 통해 프로젝트에 참여할 수 있습니다. 자세한 내용은 `CONTRIBUTING.md` (아직 생성되지 않음) 파일을 참조해주세요.

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.
