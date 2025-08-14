import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export type EventState = 'logout' | 'login-ready' | 'loading' | 'success' | 'sold-out' | 'already-applied';

interface EventStatusProps {
  state: EventState;
  userName?: string;
  onLogin: () => void;
  onApply: () => void;
}

export function EventStatus({ state, userName, onLogin, onApply }: EventStatusProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    setIsLoading(true);
    await onApply();
    setIsLoading(false);
  };

  const renderContent = () => {
    switch (state) {
      case 'logout':
        return (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">이벤트 참여를 위해 로그인해주세요.</p>
            <Button onClick={onLogin} size="lg" className="bg-primary hover:bg-primary-dark">
              로그인
            </Button>
          </div>
        );

      case 'login-ready':
        return (
          <div className="text-center space-y-4">
            <p className="text-lg font-medium">
              {userName}님, 참여해주셔서 감사해요!
            </p>
            <Button 
              onClick={handleApply} 
              size="lg" 
              className="bg-primary hover:bg-primary-dark"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '선물 신청하기'}
            </Button>
          </div>
        );

      case 'loading':
        return (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">신청 처리 중입니다...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="text-2xl">🎉</div>
            <p className="text-lg font-medium text-primary">
              신청이 완료되었습니다!
            </p>
            <p className="text-muted-foreground">
              terning이 당신의 모든 여정을 응원할게요.
            </p>
          </div>
        );

      case 'sold-out':
        return (
          <div className="text-center space-y-4">
            <div className="text-2xl">😔</div>
            <p className="text-lg font-medium">
              아쉽지만 선물이 모두 소진되었어요.
            </p>
            <p className="text-muted-foreground">
              참여해주신 마음에 감사드립니다.
            </p>
          </div>
        );

      case 'already-applied':
        return (
          <div className="text-center space-y-4">
            <div className="text-2xl">✅</div>
            <p className="text-lg font-medium">
              이미 신청이 완료되었어요.
            </p>
            <p className="text-muted-foreground">
              곧 만나뵐 수 있기를 기대해요!
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      {renderContent()}
    </Card>
  );
}