
# Terning's Final Gift - Client

[](https://www.google.com/search?q=https://github.com/terning-farewell-thanks/terning-farewell-client/actions)
[](https://react.dev/)
[](https://www.typescriptlang.org/)
[](https://vitejs.dev/)

'터닝의 마지막 선물' 이벤트 플랫폼의 프론트엔드 클라이언트입니다. 사용자에게 쾌적하고 직관적인 이벤트 참여 경험을 제공하는 것을 목표로 합니다.

## 📖 프로젝트 소개

이 프로젝트는 '터닝의 마지막 선물' 이벤트의 사용자 인터페이스를 담당합니다. 백엔드 서버와 비동기 통신하며, 이벤트 참여를 위한 이메일 인증, 선물 신청, 실시간 결과 확인 등의 기능을 제공합니다. 현대적인 기술 스택을 기반으로 뛰어난 개발 경험(DX)과 사용자 경험(UX)을 모두 고려하여 구축되었습니다.

## 주요 기능

  * **이메일 인증**: 이벤트 참여 전, 이메일 인증을 통해 유효한 사용자인지 확인합니다.
  * **동적 UI**: 이벤트 재고 상태에 따라 '신청 가능', '선착순 마감' 등 UI가 동적으로 변경됩니다.
  * **비동기 상태 처리**: `TanStack Query`를 활용하여 서버 요청 상태(로딩, 성공, 실패)를 직관적으로 사용자에게 보여줍니다.
  * **폼 유효성 검사**: `React Hook Form`과 `Zod`를 이용해 사용자 입력값에 대한 실시간 유효성 검사를 제공합니다.
  * **반응형 디자인**: 데스크톱과 모바일 환경 모두에 최적화된 UI를 제공합니다.

## 기술 스택 및 주요 선택 이유

| Category | Stack | Rationale |
| --- | --- | --- |
| **Core** | React, TypeScript, Vite | 컴포넌트 기반 UI, 타입 안정성, 그리고 빠른 빌드 속도로 생산성과 안정성을 모두 확보했습니다. |
| **UI & Styling** | Tailwind CSS, shadcn/ui | Utility-First 방식의 빠른 스타일링과 재사용성 높은 고품질 UI 컴포넌트로 개발 효율을 극대화했습니다. |
| **Server State** | TanStack Query (React Query) | 서버 데이터 페칭, 캐싱, 동기화 로직을 효율적으로 관리하여 API 통신의 복잡도를 낮추고 성능을 개선했습니다. |
| **Forms** | React Hook Form, Zod | 비제어 폼(Uncontrolled) 방식으로 렌더링 성능을 최적화하고, 스키마 기반의 강력한 유효성 검사를 구현했습니다. |
| **Routing** | React Router DOM | React 생태계의 표준 라우팅 라이브러리로, 선언적인 페이지 라우팅을 구현했습니다. |
| **Tooling** | Bun, ESLint | 빠른 패키지 관리 및 스크립트 실행을 위해 Bun을 사용하고, ESLint로 코드 컨벤션을 유지했습니다. |
