import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export type VerificationState = 
  | 'initial' 
  | 'email-form'
  | 'submitting' 
  | 'application-received'
  | 'success' 
  | 'sold-out' 
  | 'already-applied';

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
        onClick={() => window.location.hash = 'email-form'}
        className="w-full h-20 text-3xl font-bold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
        size="lg"
      >
        선물 신청하기
      </Button>
    </div>
  );

  const renderEmailForm = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold">선착순 참여를 위해 이메일을 남겨주세요!</h3>
      </div>
      
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="이메일 주소를 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-center h-14 text-lg"
        />
        <Button
          onClick={handleSubmitEmail}
          disabled={!isEmailValid || state === 'submitting'}
          className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-xl"
          size="lg"
        >
          {state === 'submitting' ? (
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/c311e70c-2e83-43fe-835f-4287b4e5fe34.png" 
                alt="terning character" 
                className="h-6 w-6 animate-bounce"
              />
              <span>접수 중...</span>
            </div>
          ) : '신청 접수하기'}
        </Button>
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
            <span className="font-bold text-primary">잠시 후, 입력하신 이메일로 선착순 결과를 안내해 드릴게요.</span>
          </p>
          <p className="text-sm text-muted-foreground italic">
            성공하신 분들께는 참여 확정을 위한 인증 메일이 발송됩니다.
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
      'already-applied': '이미 참여가 완료된 이메일 주소입니다.'
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
        {state === 'initial' ? renderInitialState() :
         state === 'email-form' || state === 'submitting' ? renderEmailForm() :
         state === 'application-received' ? renderApplicationReceived() :
         state === 'success' ? renderSuccessState() :
         renderErrorState()}
      </Card>
    </div>
  );
}