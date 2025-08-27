// Vite 환경 변수에서 API 기본 URL을 가져옵니다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * API 요청을 위한 범용 헬퍼 함수입니다.
 * 공통 헤더 설정, 응답 상태 확인, JSON 파싱을 자동으로 처리합니다.
 * @param endpoint API 경로 (예: '/api/auth/login')
 * @param options fetch에 전달할 추가 옵션
 * @returns 성공 시 서버 응답의 `data` 필드
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    // 서버가 보낸 에러 메시지가 있다면 그것을 사용하고, 없다면 기본 에러 메시지를 생성합니다.
    throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
  }
  
  // Spring Boot의 SuccessResponse 형식에 맞춰 실제 데이터는 `data` 필드에 담겨있으므로 `data`를 반환합니다.
  return responseData.data;
}

// 1. 이메일 인증 코드 발송 API
export const sendVerificationCode = (email: string): Promise<void> => {
  return apiFetch('/api/auth/send-verification-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

// 2. 이메일 인증 코드 확인 API
interface AuthResponse {
  token: string;
}
export const verifyCode = (email: string, code: string): Promise<AuthResponse> => {
  return apiFetch('/api/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
};

// 3. 선물 신청 API
export const applyForGift = (authToken: string): Promise<void> => {
  return apiFetch('/api/event/apply', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
};

// 4. 신청 상태 조회 API (필요 시 사용)
interface StatusResponse {
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'NONE';
}
export const checkApplicationStatus = (authToken: string): Promise<StatusResponse> => {
    return apiFetch('/api/event/status', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    });
};
