import { Card } from '@/components/ui/card';

export function MemoryGallery() {
  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-4">
          <h2 className="text-lg font-bold text-primary">함께여서 행복했던, 우리의 발자취</h2>
          <p className="text-sm text-muted-foreground">
            terning과 함께한 소중한 순간들
          </p>

          {/* Simple memory showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="p-3 border-primary/10">
              <div className="text-center space-y-2">
                <div className="text-2xl">🚀</div>
                <h3 className="text-sm font-medium">새로운 시작</h3>
                <p className="text-xs text-muted-foreground">꿈을 향한 첫걸음</p>
              </div>
            </Card>
            <Card className="p-3 border-primary/10">
              <div className="text-center space-y-2">
                <div className="text-2xl">💼</div>
                <h3 className="text-sm font-medium">성장의 여정</h3>
                <p className="text-xs text-muted-foreground">함께한 모든 순간</p>
              </div>
            </Card>
            <Card className="p-3 border-primary/10">
              <div className="text-center space-y-2">
                <div className="text-2xl">🌟</div>
                <h3 className="text-sm font-medium">밝은 미래</h3>
                <p className="text-xs text-muted-foreground">계속될 여러분의 이야기</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}