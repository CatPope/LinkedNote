# 보고서 2: 프로젝트에서의 MCP(Multi-Tool Control Plane) 활용

## 1. MCP 개요

MCP(Multi-Tool Control Plane)는 Gemini CLI가 다양한 외부 도구 및 시스템과 상호작용할 수 있도록 지원하는 통합 제어 시스템입니다. 본 프로젝트에서는 TaskMaster와 Git을 MCP를 통해 연동하여, 프로젝트 관리와 버전 제어를 자동화하고 체계적인 개발 워크플로우를 구축했습니다.

## 2. TaskMaster MCP 활용

TaskMaster는 프로젝트의 요구사항을 작업(Task) 단위로 분해하고, 진행 상황을 추적 및 관리하는 도구입니다. Gemini CLI는 TaskMaster MCP를 통해 다음과 같은 작업을 수행했습니다.

### 2.1. 작업 관리 및 진행

- **요구사항 분석 및 작업 생성**: 초기 요구사항 문서(PRD)를 바탕으로 `expand_task` 명령을 사용하여 전체 프로젝트를 주요 기능별 Task로 분해하고, 각 Task를 다시 세부적인 Subtask로 나누었습니다.
  ```python
  # Task 2를 세부 Subtask로 분해
  default_api.expand_task(id = "2", projectRoot = "C:\\Users\\user\\Documents\\GitHub\\LinkedNote")
  ```

- **다음 작업 확인**: `next_task` 명령을 통해 현재 진행 가능한 다음 작업을 자동으로 확인하고, 개발의 우선순위를 결정했습니다.
  ```python
  # 다음에 수행할 작업 확인
  default_api.next_task(projectRoot = "C:\\Users\\user\\Documents\\GitHub\\LinkedNote")
  ```

- **상태 업데이트**: 각 Subtask가 완료될 때마다 `set_task_status` 명령을 사용하여 상태를 `done`으로 변경했습니다. 이를 통해 프로젝트의 전체 진행률을 실시간으로 파악할 수 있었습니다.
  ```python
  # Subtask 2.1의 상태를 'done'으로 변경
  default_api.set_task_status(id = "2.1", projectRoot = "C:\\Users\\user\\Documents\\GitHub\\LinkedNote", status = "done")
  ```

### 2.2. 동적 작업 관리

- **중복 작업 제거**: `expand_task`로 자동 생성된 Subtask 중 중복되거나 불필요한 작업들은 `remove_subtask` 명령으로 제거하여 워크플로우를 간소화했습니다.
- **작업 재정의**: 초기 계획과 다른 방향으로 진행되거나, 더 나은 구현 방법이 발견되었을 때 `clear_subtasks`와 `add_subtask`를 사용하여 기존 하위 작업을 제거하고 새로운 목표에 맞는 하위 작업을 동적으로 추가했습니다.

## 3. Git MCP 활용

Git은 프로젝트의 버전 관리를 위한 핵심 도구입니다. Gemini CLI는 Git MCP를 통해 코드 변경 사항을 체계적으로 관리하고, 각 작업 단위별로 명확한 커밋 히스토리를 남겼습니다.

### 3.1. 버전 관리 워크플로우

- **상태 확인**: `git status` 명령을 통해 로컬 변경 사항을 수시로 확인했습니다.
- **스테이징**: `git add` 명령으로 커밋할 파일들을 스테이징 영역에 추가했습니다.
- **커밋**: 하나의 Subtask가 완료될 때마다, 해당 작업 내용을 요약한 한국어 커밋 메시지와 함께 `git commit` 명령을 실행했습니다. 이는 작업 단위별 변경 내역을 명확하게 추적할 수 있게 했습니다.
  ```bash
  # 한국어 커밋 메시지 예시
  git commit -m "feat: Electron 트레이 메뉴 구현"
  ```
- **푸시**: 로컬 커밋은 `git push` 명령을 통해 원격 저장소(GitHub)에 즉시 푸시하여 팀원들과 진행 상황을 공유했습니다.

### 3.2. 문제 해결 사례

- **GitHub Push Protection 오류**: `.env` 파일에 민감한 정보(API 키)가 포함된 커밋을 푸시하려다 GitHub의 푸시 보호 기능에 의해 차단되는 문제가 발생했습니다. 이는 Git MCP를 통해 `git revert`를 시도했으나, 로컬 변경 사항과의 충돌로 실패했습니다. 이 과정을 통해 `.gitignore`의 중요성과 Git 히스토리 관리의 필요성을 학습하고, 최종적으로는 `.env` 파일의 내용을 지우고 `.env.example` 파일을 통해 환경 변수 설정을 안내하는 방식으로 문제를 해결했습니다.

## 4. 결론

TaskMaster와 Git을 MCP로 연동하여 사용함으로써, 본 프로젝트는 **Task 중심의 체계적인 개발 워크플로우**를 구축할 수 있었습니다. TaskMaster로 작업을 계획하고 진행 상황을 추적했으며, Git으로 각 작업의 결과물을 명확한 버전 히스토리로 남겼습니다. 이러한 방식은 프로젝트의 투명성을 높이고, 문제 발생 시 원인을 추적하는 데 큰 도움이 되었습니다. MCP를 통한 도구 통합은 개발 프로세스를 자동화하고, 개발자가 실제 코드 구현에 더 집중할 수 있는 환경을 제공하는 강력한 방법임을 확인할 수 있었습니다.
