import { useState, useEffect } from 'react';
import { TerningLogo } from '@/components/TerningLogo';
import { EmailVerification, VerificationState } from '@/components/EmailVerification';
import { MemoryGallery } from '@/components/MemoryGallery';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = 'https://your-api-server.com'; // Replace with actual API URL

export default function FarewellEvent() {
  const [verificationState, setVerificationState] = useState<VerificationState>('initial');
  const [email, setEmail] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();

  // API call functions
  const sendVerificationCode = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setVerificationState('code-verification');
        toast({
          title: "인증 코드 발송 완료",
          description: "이메일로 인증 코드가 발송되었습니다.",
        });
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      setVerificationState('error');
      toast({
        title: "발송 실패",
        description: "인증 코드 발송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const verifyCode = async (email: string, code: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token || data.access_token;
        setAuthToken(token);
        setVerificationState('verified');
        toast({
          title: "인증 완료",
          description: "이메일 인증이 완료되었습니다.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "인증 실패",
        description: "인증 코드가 올바르지 않습니다.",
        variant: "destructive",
      });
    }
  };

  const applyForGift = async (): Promise<void> => {
    if (!authToken) {
      toast({
        title: "인증 오류",
        description: "먼저 이메일 인증을 완료해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      setVerificationState('applying');

      const response = await fetch(`${API_BASE_URL}/api/event/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 202) {
        setVerificationState('application-received');
        toast({
          title: "신청 접수 완료",
          description: "선물 신청이 정상적으로 접수되었습니다.",
        });
      } else if (response.status === 409) {
        const errorData = await response.json();
        if (errorData.message?.includes('already applied')) {
          setVerificationState('already-applied');
        } else {
          setVerificationState('sold-out');
        }
        toast({
          title: "신청 불가",
          description: errorData.message || "신청에 실패했습니다.",
          variant: "destructive",
        });
      } else {
        throw new Error('Application failed');
      }
    } catch (error) {
      console.error('Error applying for gift:', error);
      setVerificationState('error');
      toast({
        title: "신청 실패",
        description: "신청 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  const checkEventStatus = async () => {
    try {
      // Mock API call to check event status
      // const response = await fetch('/api/event/status');
      // const data = await response.json();
      
      // For demo purposes, start with initial state
      setVerificationState('initial');
    } catch (error) {
      console.error('Failed to check event status:', error);
    }
  };

  useEffect(() => {
    checkEventStatus();
    
    // Check if we need to show email verification based on URL hash
    if (window.location.hash === '#email-verification') {
      setVerificationState('email-verification');
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === '#email-verification') {
        setVerificationState('email-verification');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-light text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/97fee445-49bc-4323-8e28-e4d9f2d6c973.png" 
              alt="terning logo" 
              className="h-10 md:h-12"
            />
            <img 
              src="/lovable-uploads/8facd738-0863-4ac2-9b15-1d70d1159e3c.png" 
              alt="terning" 
              className="h-8 md:h-10"
            />
          </div>
          <div className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center space-x-2">
            <span className="font-bold text-white">terning</span>
            <span>과의 마지막 여정</span>
          </div>
          <p className="text-lg opacity-90">
            함께해주셔서 고마워요!
          </p>
        </div>
      </header>

      {/* Thank You Letter */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-6 border-primary/20">
            <div className="text-center space-y-4">
              <h2 className="text-lg font-bold text-primary">감사의 마음을 전합니다</h2>
              <div className="prose mx-auto text-muted-foreground text-sm">
                <p>
                  대학생 여러분들의 꿈과 함께했던 terning의 여정이 마무리됩니다.
                  비록 서비스는 끝나지만, 여러분이 꿈꿔온 모든 것들이 
                  현실이 될 수 있기를 진심으로 응원하겠습니다.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Event Info */}
      <section className="py-8 bg-primary/5">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center space-y-4">
            <h2 className="text-lg font-bold">선착순 감사 선물 이벤트</h2>
            <div className="bg-white p-4 rounded-lg border border-primary/20 text-sm">
              <div className="space-y-2 text-left">
                <div className="flex items-start space-x-2">
                  <span className="text-primary font-bold text-xs">🎁</span>
                  <div className="text-xs">
                    <strong>선물 내용:</strong> terning 굿즈와 함께하는 특별한 기념품
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary font-bold text-xs">⚡</span>
                  <div className="text-xs">
                    <strong>참여 방법:</strong> 선착순으로 신청 가능
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Action Area */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <EmailVerification
            state={verificationState}
            onSendCode={sendVerificationCode}
            onVerifyCode={verifyCode}
            onApply={applyForGift}
            email={email}
            setEmail={setEmail}
          />
        </div>
      </section>

      {/* Memory Gallery - Smaller */}
      <MemoryGallery />

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/97fee445-49bc-4323-8e28-e4d9f2d6c973.png" 
              alt="terning logo" 
              className="h-6"
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              terning과 함께한 모든 순간에 감사드립니다
            </p>
            <div className="pt-4 border-t border-white/20">
              <p className="text-xs opacity-60">
                © 2024 terning. 모든 추억이 소중합니다.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}