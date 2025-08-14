import { Card } from '@/components/ui/card';

export function MemoryGallery() {
  const memories = [
    {
      title: "내 계획에 딱 맞는 대학생 인턴의 시작",
      description: "대학생들의 인턴 여정이 시작되었습니다",
      icon: "🎯"
    },
    {
      title: "곧 마감되는 관심 공고",
      description: "놓치고 싶지 않은 기회들을 알려드렸어요",
      icon: "⏰"
    },
    {
      title: "맞춤형 공고 추천",
      description: "여러분의 관심사에 맞는 인턴십을 찾아드렸어요",
      icon: "💡"
    },
    {
      title: "간편한 지원 과정",
      description: "복잡한 절차 없이 쉽게 지원할 수 있었어요",
      icon: "📝"
    },
    {
      title: "커뮤니티와 함께",
      description: "같은 꿈을 가진 사람들과 소통했어요",
      icon: "🤝"
    },
    {
      title: "성장하는 여정",
      description: "모든 경험이 성장의 밑거름이 되었어요",
      icon: "🌱"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">함께여서 행복했던, 우리의 발자취</h2>
          <p className="text-muted-foreground text-lg">
            terning과 함께한 모든 순간들이 소중한 추억이 되었어요
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 border-primary/10">
              <div className="text-center space-y-4">
                <div className="text-4xl">{memory.icon}</div>
                <h3 className="text-lg font-semibold">{memory.title}</h3>
                <p className="text-muted-foreground">{memory.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}