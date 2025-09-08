import { useState } from 'react';
import { TerningLogo } from '@/components/TerningLogo';
import { EmailVerification, VerificationState } from '@/components/EmailVerification';
import { MemoryGallery } from '@/components/MemoryGallery';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import * as api from '@/services/api';

export default function FarewellEvent() {
  const [verificationState, setVerificationState] = useState<VerificationState>('initial');
  const [email, setEmail] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { toast } = useToast();

  // 이메일 인증 코드 발송 핸들러
  const handleSendCode = async (emailToSend: string) => {
    try {
      await api.sendVerificationCode(emailToSend);
      setVerificationState('code-verification');
      toast({
        title: "인증 코드 발송 완료",
        description: "이메일로 인증 코드가 발송되었습니다.",
      });
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast({
        title: "발송 실패",
        description: "인증 코드 발송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  // 인증 코드 확인 핸들러
  const handleVerifyCode = async (emailToVerify: string, code: string) => {
    try {
      const response = await api.verifyCode(emailToVerify, code);
      setAuthToken(response.temporaryToken); // API 명세에 맞게 temporaryToken 사용
      setVerificationState('verified');
      toast({
        title: "인증 완료",
        description: "이메일 인증이 완료되었습니다.",
      });
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "인증 실패",
        description: "인증 코드가 올바르지 않습니다.",
        variant: "destructive",
      });
    }
  };

  // 신청 시작 핸들러
  const handleStartApplication = () => {
    setVerificationState('email-verification');
  };

  // 선물 신청 핸들러
  const handleApplyForGift = async () => {
    if (!authToken) {
      toast({ title: "인증 오류", description: "인증이 필요합니다.", variant: "destructive" });
      return;
    }
    try {
      setVerificationState('applying');
      await api.applyForGift(authToken);
      setVerificationState('application-received');
      toast({
        title: "신청 접수 완료",
        description: "선물 신청이 정상적으로 접수되었습니다.",
      });
    } catch (error: any) {
      console.error('Error applying for gift:', error);
      toast({
        title: "신청 실패",
        description: error.message || "신청 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      
      // 서버가 보내준 에러 메시지에 따라 상태를 분기합니다.
      if (error.message?.includes('already applied')) {
        setVerificationState('already-applied');
      } else { // 예: 품절 등 다른 409 에러
        setVerificationState('sold-out');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-light text-white py-10 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <TerningLogo className="h-28 md:h-36 lg:h-44" />
          </div>
          <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <div className="flex flex-wrap items-center justify-center gap-x-4">
              <span className="font-bold text-white">terning 과의</span>
              <span>마지막 여정</span>
            </div>
          </div>
          <p className="text-2xl md:text-3xl opacity-90">함께해주셔서 고마워요!</p>
        </div>
      </header>

      {/* Thank You Letter */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-8 md:p-12 border-primary/20 shadow-lg">
            <div className="text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">감사의 마음을 전합니다</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="text-base md:text-lg leading-relaxed">
                  <span className="hidden md:inline">대학생 여러분들의 꿈과 함께했던 terning의 여정이 마무리됩니다.</span>
                  <span className="md:hidden">대학생 여러분들의 꿈과 함께했던<br />terning의 여정이 마무리됩니다.</span>
                </p>
                <p className="text-base md:text-lg leading-relaxed">
                  <span className="hidden md:inline">비록 서비스는 끝나지만, 여러분이 꿈꿔온 모든 것들이 현실이 될 수 있기를 진심으로 응원하겠습니다.</span>
                  <span className="md:hidden">비록 서비스는 끝나지만,<br />여러분이 꿈꿔온 모든 것들이<br />현실이 될 수 있기를<br />진심으로 응원하겠습니다.</span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Event Action Area - Moved up to be main CTA */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <EmailVerification
            state={verificationState}
            onSendCode={handleSendCode}
            onVerifyCode={handleVerifyCode}
            onApply={handleApplyForGift}
            onStartApplication={handleStartApplication}
            email={email}
            setEmail={setEmail}
          />
        </div>
      </section>

      {/* Event Info - Moved below main CTA */}
      <section className="py-12 md:py-16 bg-primary/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">선착순 감사 선물 이벤트</h2>
            <div className="bg-white p-6 md:p-8 rounded-xl border border-primary/20 shadow-md">
              <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                  <span className="text-primary font-bold text-lg">🎁</span>
                  <div className="text-sm md:text-base">
                    <strong>선물 내용:</strong> terning 굿즈와 함께하는 특별한 기념품
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary font-bold text-lg">⚡</span>
                  <div className="text-sm md:text-base">
                    <div><strong>참여 방법:</strong></div>
                    <div className="mt-2 space-y-1 pl-4">
                      <div>1. 상단의 '선물 신청하기' 버튼을 클릭합니다.</div>
                      <div>2. 메일 주소를 입력하고 인증번호를 요청합니다.</div>
                      <div>3. 수신된 인증번호를 입력하여 본인 인증을 완료합니다.</div>
                      <div>4. 모든 정보 입력 및 인증 완료 후 '신청하기' 버튼을 눌러 최종 제출합니다.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Memory Gallery */}
      <MemoryGallery />

      {/* Footer */}
      <footer className="bg-primary text-white py-8 md:py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/lovable-uploads/97fee445-49bc-4323-8e28-e4d9f2d6c973.png" 
              alt="terning logo" 
              className="h-6 md:h-7"
            />
            <img 
              src="/lovable-uploads/8facd738-0863-4ac2-9b15-1d70d1159e3c.png" 
              alt="terning" 
              className="h-5 md:h-6"
            />
          </div>
          <div className="space-y-4">
            <p className="text-base md:text-lg font-medium">terning과 함께한 모든 순간에 감사드립니다</p>
            <div className="pt-6 border-t border-white/20">
              <p className="text-sm opacity-60">© 2025 terning. 모든 추억이 소중합니다.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
