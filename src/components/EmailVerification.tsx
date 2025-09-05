import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export type VerificationState = 
  | 'initial' 
  | 'email-verification'
  | 'code-verification'
  | 'verified'
  | 'applying'
  | 'application-received'
  | 'success' 
  | 'sold-out' 
  | 'already-applied'
  | 'error';

interface EmailVerificationProps {
  state: VerificationState;
  onSendCode: (email: string) => Promise<void>;
  onVerifyCode: (email: string, code: string) => Promise<void>;
  onApply: () => Promise<void>;
  onStartApplication: () => void;
  email: string;
  setEmail: (email: string) => void;
}

export function EmailVerification({ 
  state, 
  onSendCode, 
  onVerifyCode, 
  onApply, 
  onStartApplication,
  email, 
  setEmail 
}: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();

  // 쿨다운 타이머 효과
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isEmailValid = isValidEmail(email);
  const isCodeValid = verificationCode.length === 6;

  const handleSendCode = async () => {
    if (isLoading || cooldownTime > 0) return;
    
    setIsLoading(true);
    try {
      await onSendCode(email);
      // 성공 시 60초 쿨다운 시작
      setCooldownTime(60);
      toast({
        title: "인증번호가 발송되었습니다",
        description: "이메일을 확인해주세요.",
      });
    } catch (error) {
      console.error('Failed to send verification code:', error);
      toast({
        title: "전송 실패",
        description: "요청에 실패했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onVerifyCode(email, verificationCode);
      toast({
        title: "인증이 완료되었습니다",
        description: "이제 선물을 신청할 수 있습니다.",
      });
    } catch (error) {
      console.error('Failed to verify code:', error);
      toast({
        title: "인증 실패",
        description: "인증번호를 다시 확인해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await onApply();
    } catch (error) {
      console.error('Failed to apply:', error);
      toast({
        title: "신청 실패",
        description: "신청에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInitialState = () => (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
            alt="terning character" 
            className="h-24 w-24"
          />
        </div>
        <p className="text-muted-foreground text-lg">
          마지막 선물을 준비했어요
        </p>
      </div>
      
      <Button
        onClick={onStartApplication}
        className="w-full h-20 text-3xl font-bold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
        size="lg"
      >
        선물 신청하기
      </Button>
    </div>
  );

  const renderEmailVerification = () => {
    const getButtonText = () => {
      if (isLoading) return "전송 중...";
      if (cooldownTime > 0) return `재전송 (${cooldownTime}초)`;
      if (state === 'code-verification') return "재전송";
      return "인증 코드 요청";
    };

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold">이메일 인증을 진행해주세요!</h3>
          <p className="text-muted-foreground">입력하신 이메일로 인증 코드를 발송해 드립니다.</p>
        </div>
        
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="이메일 주소를 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center h-14 text-lg"
            disabled={state === 'code-verification'}
            readOnly={state === 'code-verification'}
          />
          <Button
            onClick={handleSendCode}
            disabled={!isEmailValid || isLoading || cooldownTime > 0}
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-xl"
            size="lg"
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {getButtonText()}
          </Button>
        </div>
      </div>
    );
  };

  const renderCodeVerification = () => {
    const getButtonText = () => {
      if (isLoading) return "재전송 중...";
      if (cooldownTime > 0) return `재전송 (${cooldownTime}초)`;
      return "재전송";
    };

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold">인증 코드를 입력해주세요</h3>
          <p className="text-muted-foreground">
            <strong>{email}</strong>으로 발송된 6자리 인증 코드를 입력해주세요.
          </p>
        </div>
        
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            className="text-center h-14 text-2xl tracking-widest"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleSendCode}
              disabled={isLoading || cooldownTime > 0}
              variant="outline"
              className="h-16 text-lg"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getButtonText()}
            </Button>
            <Button
              onClick={handleVerifyCode}
              disabled={!isCodeValid || isLoading}
              className="h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-xl"
              size="lg"
            >
              {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              확인
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderVerified = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
            alt="terning character celebrating" 
            className="h-20 w-20"
          />
        </div>
        <h3 className="text-2xl font-bold text-primary">인증이 완료되었습니다!</h3>
        <p className="text-muted-foreground">이제 선물을 신청할 수 있습니다.</p>
      </div>
      
      <Button
        onClick={handleApply}
        disabled={isLoading}
        className="w-full h-20 text-3xl font-bold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
        size="lg"
      >
        {isLoading && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
        {isLoading ? "신청 중..." : "선물 신청하기"}
      </Button>
    </div>
  );

  const renderApplying = () => (
    <div className="space-y-6">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
            alt="terning character applying" 
            className="h-20 w-20 animate-bounce"
          />
        </div>
        <h3 className="text-2xl font-bold text-primary">신청 중...</h3>
        <p className="text-muted-foreground">잠시만 기다려주세요.</p>
      </div>
    </div>
  );

  const renderApplicationReceived = () => (
    <div className="space-y-6">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
            alt="terning character waiting" 
            className="h-20 w-20"
          />
        </div>
        <h3 className="text-2xl font-bold text-primary">
          신청이 정상적으로 접수되었습니다!
        </h3>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-3">
          <p className="text-lg font-medium">
            <span className="font-bold text-primary">최종 결과는 이메일로 안내됩니다.</span>
          </p>
          <p className="text-sm text-muted-foreground italic">
            선착순에 성공하신 분들께만 참여 확정 메일이 발송됩니다.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSuccessState = () => (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <img 
            src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
            alt="terning character celebrating" 
            className="h-20 w-20 animate-bounce"
          />
          <span className="text-2xl">🎉</span>
        </div>
        <h3 className="text-xl font-semibold text-primary">
          신청이 완료되었습니다!
        </h3>
        <p className="text-muted-foreground">
          <span className="font-medium">terning</span>과 함께한 모든 순간에 감사드립니다.
        </p>
      </div>
    </div>
  );

  const renderErrorState = () => {
    const messages = {
      'sold-out': '아쉽지만 모든 선물이 소진되었어요. 참여해주신 마음에 진심으로 감사드립니다.',
      'already-applied': '이미 참여가 완료된 이메일 주소입니다.',
      'error': '오류가 발생했습니다. 다시 시도해주세요.'
    };

    return (
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
              alt="terning character" 
              className="h-16 w-16 opacity-75"
            />
          </div>
          <p className="text-muted-foreground text-lg">
            {messages[state as keyof typeof messages]}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 md:p-12 border-primary/20 shadow-2xl">
        {state === 'initial' && renderInitialState()}
        {state === 'email-verification' && renderEmailVerification()}
        {state === 'code-verification' && renderCodeVerification()}
        {state === 'verified' && renderVerified()}
        {state === 'applying' && renderApplying()}
        {state === 'application-received' && renderApplicationReceived()}
        {state === 'success' && renderSuccessState()}
        {(state === 'sold-out' || state === 'already-applied' || state === 'error') && renderErrorState()}
      </Card>
    </div>
  );
}