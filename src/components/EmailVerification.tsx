import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export type VerificationState = 
  | 'initial' 
  | 'email-form'
  | 'submitting' 
  | 'pending-verification'
  | 'success' 
  | 'sold-out' 
  | 'already-applied'
  | 'verification-expired';

interface EmailVerificationProps {
  state: VerificationState;
  onApply: (email: string) => Promise<void>;
}

export function EmailVerification({ state, onApply }: EmailVerificationProps) {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isEmailValid = isValidEmail(email);

  const handleSubmitEmail = async () => {
    try {
      await onApply(email);
    } catch (error) {
      console.error('Failed to submit application:', error);
    }
  };

  const renderInitialState = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <img 
            src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
            alt="terning character" 
            className="h-20 w-20"
          />
        </div>
      </div>
      
      <Button
        onClick={() => window.location.hash = 'email-form'}
        className="w-full h-14 text-xl font-bold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white"
        size="lg"
      >
        선물 신청하기
      </Button>
    </div>
  );

  const renderEmailForm = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">선착순 참여를 위해 이메일을 남겨주세요!</h3>
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
          onClick={handleSubmitEmail}
          disabled={!isEmailValid || state === 'submitting'}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {state === 'submitting' ? '접수 중...' : '신청 접수하고 인증 메일 받기'}
        </Button>
      </div>
    </div>
  );

  const renderPendingVerification = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <img 
            src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
            alt="terning character" 
            className="h-16 w-16"
          />
          <span className="text-2xl">💌</span>
        </div>
        <h3 className="text-xl font-semibold text-primary">
          신청이 정상적으로 접수되었습니다!
        </h3>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-left space-y-2">
          <p className="text-sm">
            <span className="font-medium text-primary">{email}</span>으로 발송된 메일을 확인하여
          </p>
          <p className="text-sm font-bold text-primary">
            10분 내에 참여를 확정해주세요.
          </p>
          <p className="text-xs text-muted-foreground">
            최종 확정하셔야 선착순 순위가 안전하게 인정됩니다.
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
      'verification-expired': '인증 시간이 만료되었어요. 다시 신청해주세요.'
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
        {state === 'verification-expired' && (
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            다시 신청하기
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className="p-8 border-primary/20 max-w-md mx-auto">
      {state === 'initial' ? renderInitialState() :
       state === 'email-form' || state === 'submitting' ? renderEmailForm() :
       state === 'pending-verification' ? renderPendingVerification() :
       state === 'success' ? renderSuccessState() :
       renderErrorState()}
    </Card>
  );
}