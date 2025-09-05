// API 기본 URL을 직접 설정합니다.
const API_BASE_URL = 'https://www.terning-farewell.p-e.kr';

// 공통 API 응답 인터페이스
interface ApiResponse {
  status: number;
  message: string;
}

/**
 * API 요청을 위한 범용 헬퍼 함수입니다.
 * 공통 헤더 설정, 응답 상태 확인, JSON 파싱을 자동으로 처리합니다.
 * @param endpoint API 경로 (예: '/api/auth/login')
 * @param options fetch에 전달할 추가 옵션
 * @returns 성공 시 서버 응답의 `result` 필드 또는 전체 응답
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  console.log('API 요청:', `${API_BASE_URL}${endpoint}`, options);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...options.headers,
      },
    });

    console.log('API 응답 상태:', response.status, response.statusText);
    
    const responseData = await response.json();
    console.log('API 응답 데이터:', responseData);

    if (!response.ok) {
      // 서버가 보낸 에러 메시지가 있다면 그것을 사용하고, 없다면 기본 에러 메시지를 생성합니다.
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }
    
    // API 명세에 따라 result 필드가 있으면 result, 없으면 전체 응답을 반환
    return responseData.result || responseData;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
}

// 1. 이메일 인증 코드 발송 API
export const sendVerificationCode = async (email: string): Promise<ApiResponse> => {
  return apiFetch('/api/auth/send-verification-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

// 2. 이메일 인증 코드 확인 API
interface AuthResponse {
  temporaryToken: string;
}
export const verifyCode = async (email: string, code: string): Promise<AuthResponse> => {
  const response = await apiFetch('/api/auth/verify-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
  
  // API 명세에 따라 temporaryToken 추출 (apiFetch가 이미 result를 반환함)
  if (response && response.temporaryToken) {
    return { temporaryToken: response.temporaryToken };
  }
  throw new Error('토큰을 받지 못했습니다.');
};

// 3. 선물 신청 API
export const applyForGift = async (authToken: string): Promise<ApiResponse> => {
  return apiFetch('/api/event/apply', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
};

// 4. 신청 상태 조회 API
interface StatusResponse {
  status: 'SUCCESS' | 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'NONE';
  message: string;
}
export const checkApplicationStatus = async (authToken: string): Promise<StatusResponse> => {
  return apiFetch('/api/event/status', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
};

// API 테스트 함수들
export const testSendCode = async (email: string) => {
  console.log('🧪 이메일 코드 발송 테스트:', email);
  try {
    await sendVerificationCode(email);
    console.log('✅ 이메일 코드 발송 성공');
    return true;
  } catch (error) {
    console.error('❌ 이메일 코드 발송 실패:', error);
    return false;
  }
};

export const testVerifyCode = async (email: string, code: string) => {
  console.log('🧪 코드 인증 테스트:', email, code);
  try {
    const result = await verifyCode(email, code);
    console.log('✅ 코드 인증 성공:', result);
    return result;
  } catch (error) {
    console.error('❌ 코드 인증 실패:', error);
    return null;
  }
};

export const testApplyGift = async (token: string) => {
  console.log('🧪 선물 신청 테스트:', token);
  try {
    await applyForGift(token);
    console.log('✅ 선물 신청 성공');
    return true;
  } catch (error) {
    console.error('❌ 선물 신청 실패:', error);
    return false;
  }
};

export const testCheckStatus = async (token: string) => {
  console.log('🧪 상태 조회 테스트:', token);
  try {
    const result = await checkApplicationStatus(token);
    console.log('✅ 상태 조회 성공:', result);
    return result;
  } catch (error) {
    console.error('❌ 상태 조회 실패:', error);
    return null;
  }
};

// 5. 이벤트 재고 확인 API (관리자용)
interface StockResponse {
  stock: number;
}
export const checkEventStock = async (adminKey: string): Promise<StockResponse> => {
  return apiFetch('/api/admin/event/stock', {
    method: 'POST',
    headers: {
      'X-ADMIN-KEY': adminKey,
    },
  });
};
