# 보고서 1: 프로젝트에서의 Gemini CLI 활용

## 1. Gemini CLI 개요

Gemini CLI는 AI 기반의 대화형 명령줄 인터페이스(Command-Line Interface)입니다. 이 도구는 단순한 명령어 실행을 넘어, 개발자가 자연어를 통해 복잡한 개발 작업을 수행할 수 있도록 지원합니다. 본 프로젝트에서는 Gemini CLI를 핵심 개발 도구로 사용하여 다음과 같은 작업을 자동화하고 효율성을 극대화했습니다.

- **파일 시스템 관리**: 파일 및 디렉토리 생성, 읽기, 수정, 삭제
- **코드 생성 및 수정**: 새로운 코드 파일 작성, 기존 코드 리팩토링 및 수정
- **명령어 실행**: `npm`, `pip`, `git`, `alembic` 등 다양한 CLI 도구 실행
- **오류 분석 및 디버깅**: 발생한 오류의 원인을 분석하고 해결책 제안
- **웹 리서치**: 필요한 라이브러리나 API 정보를 웹 검색을 통해 수집

## 2. 주요 활용 사례

### 2.1. 프로젝트 초기 설정 및 구조화

프로젝트 초기 단계에서 필요한 디렉토리 구조와 기본 파일들을 Gemini CLI를 통해 신속하게 생성했습니다.

- **디렉토리 생성**:
  ```bash
  # backend 및 electron-app 디렉토리 생성
  mkdir C:\Users\user\Documents\GitHub\LinkedNote\backend
  mkdir C:\Users\user\Documents\GitHub\LinkedNote\electron-app
  ```

- **파일 생성 및 작성**:
  ```python
  # FastAPI의 기본 requirements.txt 파일 생성
  default_api.write_file(
      content = "fastapi\nuvicorn\nsa\nalembic", 
      file_path = "C:\\Users\\user\\Documents\\GitHub\\LinkedNote\\backend\\requirements.txt"
  )
  
  # Electron의 package.json 파일 초기화
  default_api.run_shell_command(command = "cd electron-app && npm init -y")
  ```

### 2.2. 코드 생성 및 수정

Gemini CLI의 `write_file` 및 `replace` 기능을 사용하여 새로운 코드를 작성하고 기존 코드를 수정했습니다. 이를 통해 반복적인 코딩 작업을 줄이고 개발 속도를 높일 수 있었습니다.

- **FastAPI 모델 생성**:
  ```python
  # backend/models.py 파일에 User 및 Summary 모델 스키마 작성
  default_api.write_file(
      content = "from sqlalchemy import Column, Integer, String, DateTime...", 
      file_path = "C:\\Users\\user\\Documents\\GitHub\\LinkedNote\\backend\\models.py"
  )
  ```

- **코드 리팩토링**:
  ```python
  # main.js의 Tray 아이콘 경로를 절대 경로로 수정
  default_api.replace(
      file_path = "C:\\Users\\user\\Documents\\GitHub\\LinkedNote\\electron-app\\main.js", 
      new_string = "tray = new Tray(path.join(__dirname, 'assets', 'icons', 'icon.png'))", 
      old_string = "tray = new Tray('assets/icons/icon.png')"
  )
  ```

### 2.3. 명령어 실행 및 자동화

프로젝트에 필요한 라이브러리 설치, 데이터베이스 마이그레이션, 서버 실행 등 다양한 명령어를 Gemini CLI를 통해 직접 실행했습니다.

- **라이브러리 설치**:
  ```bash
  # Python 라이브러리 설치
  pip install -r backend/requirements.txt
  
  # Node.js 라이브러리 설치
  cd electron-app && npm install axios
  ```

- **데이터베이스 마이그레이션**:
  ```bash
  # Alembic 마이그레이션 스크립트 생성 및 적용
  python -m alembic -c alembic.ini revision --autogenerate -m "Create summaries table"
  python -m alembic -c alembic.ini upgrade head
  ```

### 2.4. 오류 분석 및 디버깅

개발 과정에서 발생한 다양한 오류들을 Gemini CLI의 분석 능력을 통해 해결했습니다. 오류 로그를 입력하면 Gemini CLI가 원인을 분석하고, 해결을 위한 코드 수정이나 명령어 실행을 제안했습니다.

- **`ModuleNotFoundError` 해결**: Python의 임포트 경로 문제를 분석하고, `uvicorn` 실행 방식을 변경하여 해결했습니다.
- **`Failed to load image` 오류 해결**: Electron의 Tray 아이콘 로딩 문제를 분석하고, `path.join`, `nativeImage` 사용 등 다양한 해결책을 시도하며 문제를 해결했습니다.

## 3. 결론

Gemini CLI는 본 프로젝트에서 단순한 코드 작성 도구를 넘어, 프로젝트의 전반적인 흐름을 주도하고 문제를 해결하는 핵심적인 역할을 수행했습니다. 자연어 기반의 상호작용을 통해 복잡한 작업을 간단하게 처리하고, 오류 발생 시 신속하게 원인을 파악하여 개발 생산성을 크게 향상시킬 수 있었습니다. 이는 AI 기반 개발 도구가 실제 프로젝트에서 어떻게 활용될 수 있는지 보여주는 좋은 사례입니다.
