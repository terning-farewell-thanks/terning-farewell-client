import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import * as api from '@/services/api';

export function ApiTester() {
  const [email, setEmail] = useState('jsoonworld@gmail.com');
  const [code, setCode] = useState('225864');
  const [token, setToken] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const addResult = (test: string, success: boolean, data?: any) => {
    const result = {
      test,
      success,
      data,
      timestamp: new Date().toLocaleTimeString()
    };
    setResults(prev => [result, ...prev]);
    return result;
  };

  const test1SendCode = async () => {
    toast({ title: "🧪 테스트 1", description: "이메일 코드 발송 테스트 중..." });
    const success = await api.testSendCode(email);
    addResult('1. 이메일 코드 발송', success);
    if (success) {
      toast({ title: "✅ 성공", description: "이메일 코드 발송 성공!" });
    } else {
      toast({ title: "❌ 실패", description: "이메일 코드 발송 실패", variant: "destructive" });
    }
  };

  const test2VerifyCode = async () => {
    toast({ title: "🧪 테스트 2", description: "코드 인증 테스트 중..." });
    const result = await api.testVerifyCode(email, code);
    const success = !!result;
    addResult('2. 코드 인증', success, result);
    if (success && result?.token) {
      setToken(result.token);
      toast({ title: "✅ 성공", description: "코드 인증 성공! 토큰 저장됨" });
    } else {
      toast({ title: "❌ 실패", description: "코드 인증 실패", variant: "destructive" });
    }
  };

  const test3ApplyGift = async () => {
    if (!token) {
      toast({ title: "❌ 오류", description: "토큰이 없습니다. 먼저 코드 인증을 해주세요.", variant: "destructive" });
      return;
    }
    toast({ title: "🧪 테스트 3", description: "선물 신청 테스트 중..." });
    const success = await api.testApplyGift(token);
    addResult('3. 선물 신청', success);
    if (success) {
      toast({ title: "✅ 성공", description: "선물 신청 성공!" });
    } else {
      toast({ title: "❌ 실패", description: "선물 신청 실패", variant: "destructive" });
    }
  };

  const test4CheckStatus = async () => {
    if (!token) {
      toast({ title: "❌ 오류", description: "토큰이 없습니다. 먼저 코드 인증을 해주세요.", variant: "destructive" });
      return;
    }
    toast({ title: "🧪 테스트 4", description: "상태 조회 테스트 중..." });
    const result = await api.testCheckStatus(token);
    const success = !!result;
    addResult('4. 상태 조회', success, result);
    if (success) {
      toast({ title: "✅ 성공", description: `상태 조회 성공! 상태: ${result.status}` });
    } else {
      toast({ title: "❌ 실패", description: "상태 조회 실패", variant: "destructive" });
    }
  };

  const testAll = async () => {
    toast({ title: "🚀 전체 테스트", description: "모든 API를 순차적으로 테스트합니다..." });
    await test1SendCode();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await test2VerifyCode();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await test3ApplyGift();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await test4CheckStatus();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">🧪 API 테스트 도구</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">테스트 데이터</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">이메일</label>
                <Input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                />
              </div>
              <div>
                <label className="text-sm font-medium">인증 코드</label>
                <Input 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6자리 코드"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium">토큰</label>
                <Input 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="JWT 토큰 (자동 입력됨)"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">API 테스트</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={test1SendCode} variant="outline" size="sm">
                1️⃣ 코드 발송
              </Button>
              <Button onClick={test2VerifyCode} variant="outline" size="sm">
                2️⃣ 코드 인증
              </Button>
              <Button onClick={test3ApplyGift} variant="outline" size="sm">
                3️⃣ 선물 신청
              </Button>
              <Button onClick={test4CheckStatus} variant="outline" size="sm">
                4️⃣ 상태 조회
              </Button>
            </div>
            <Separator />
            <Button onClick={testAll} className="w-full" size="lg">
              🚀 전체 테스트 실행
            </Button>
          </div>
        </div>
      </Card>

      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">테스트 결과</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "✅ 성공" : "❌ 실패"}
                  </Badge>
                  <span className="font-medium">{result.test}</span>
                  <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                </div>
                {result.data && (
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {JSON.stringify(result.data, null, 2).slice(0, 50)}...
                  </code>
                )}
              </div>
            ))}
          </div>
          <Button 
            onClick={() => setResults([])} 
            variant="outline" 
            size="sm" 
            className="mt-4"
          >
            결과 초기화
          </Button>
        </Card>
      )}
    </div>
  );
}