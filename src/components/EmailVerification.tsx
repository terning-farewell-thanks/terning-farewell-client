import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export type VerificationState = 
  | 'initial' 
  | 'sending' 
  | 'verification' 
  | 'applying' 
  | 'success' 
  | 'expired' 
  | 'sold-out' 
  | 'already-applied';

interface EmailVerificationProps {
  state: VerificationState;
  onSendCode: (email: string) => Promise<void>;
  onVerifyAndApply: (email: string, code: string) => Promise<void>;
}

export function EmailVerification({ state, onSendCode, onVerifyAndApply }: EmailVerificationProps) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const { toast } = useToast();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isEmailValid = isValidEmail(email);
  const isCodeComplete = verificationCode.length === 6;

  useEffect(() => {
    if (state === 'verification' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && state === 'verification') {
      toast({
        variant: "destructive",
        title: "인증 시간 만료",
        description: "인증 시간이 만료되었어요.",
      });
    }
  }, [timeLeft, state, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendCode = async () => {
    try {
      await onSendCode(email);
      setTimeLeft(180); // Reset timer
    } catch (error) {
      console.error('Failed to send verification code:', error);
    }
  };

  const handleVerifyAndApply = async () => {
    try {
      await onVerifyAndApply(email, verificationCode);
    } catch (error) {
      console.error('Failed to verify and apply:', error);
    }
  };

  const renderInitialState = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">감사 선물을 받을 이메일 주소를 알려주세요</h3>
        <div className="flex items-center justify-center space-x-4">
          <img 
            src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
            alt="terning character" 
            className="h-16 w-16"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="이메일 주소를 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-center"
        />
        <Button
          onClick={handleSendCode}
          disabled={!isEmailValid || state === 'sending'}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {state === 'sending' ? '전송 중...' : '인증번호 받기'}
        </Button>
      </div>
    </div>
  );

  const renderVerificationState = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">
          <span className="text-primary font-bold">{email}</span>(으)로<br />
          인증번호를 보냈어요
        </h3>
        <div className="flex items-center justify-center space-x-4">
          <img 
            src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
            alt="terning character" 
            className="h-16 w-16"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <Input
          type="email"
          value={email}
          readOnly
          className="text-center bg-muted"
        />
        <div className="relative">
          <Input
            type="text"
            placeholder="인증번호 6자리"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(value);
            }}
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className={`text-sm font-mono ${timeLeft <= 30 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        {timeLeft === 0 && (
          <p className="text-destructive text-sm text-center">
            인증 시간이 만료되었어요. 다시 시도해주세요.
          </p>
        )}
        <Button
          onClick={handleVerifyAndApply}
          disabled={!isCodeComplete || timeLeft === 0 || state === 'applying'}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {state === 'applying' ? '신청 중...' : '신청 완료하기'}
        </Button>
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
      'sold-out': '아쉽지만 선물이 모두 소진되었어요. 참여해주신 마음에 감사드립니다.',
      'already-applied': '이미 참여가 완료된 이메일 주소입니다.',
      'expired': '인증 시간이 만료되었어요. 다시 시도해주세요.'
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
        {state === 'expired' && (
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            다시 시도하기
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className="p-8 border-primary/20 max-w-md mx-auto">
      {state === 'initial' || state === 'sending' ? renderInitialState() :
       state === 'verification' || state === 'applying' ? renderVerificationState() :
       state === 'success' ? renderSuccessState() :
       renderErrorState()}
    </Card>
  );
}