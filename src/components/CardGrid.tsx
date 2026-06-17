import type { CardItem } from '../data/cards'

type CardGridProps = {
  cards: CardItem[]
  language: 'ko' | 'en'
  onCardClick: (card: CardItem) => void
}

export function CardGrid({ cards, language, onCardClick }: CardGridProps) {
  // 🛡️ 추상 테크 그래픽
  const defaultImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60";

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onCardClick(card)}
          className="group flex aspect-square flex-col items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div className="w-full flex flex-col items-center flex-1 justify-center">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform duration-200">
              {card.image_url ? (
                <img 
                  src={card.image_url} 
                  alt={card.title} 
                  className="w-full h-full object-cover"
                  // 🛡️ 크롤링 주소의 유실이나 구글 보안 차단으로 이미지가 깨지면 엑스박스 대신 디폴트 이미지로 치환하는 방어망
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage;
                  }}
                />
              ) : (
                // 이미지 데이터 자체가 없을 때 작동하는 폴백
                <img 
                  src={defaultImage} 
                  alt="Default AI" 
                  className="w-full h-full object-cover opacity-50"
                />
              )}
            </div>

            {/* 타이틀 명 */}
            <span className="mt-3 text-sm font-semibold text-gray-800 text-center line-clamp-1">
              {card.title}
            </span>
          </div>

          {/* 하단 태그 클러스터 영역 */}
          <div className="mt-2 flex flex-wrap justify-center gap-1 max-h-[40px] overflow-hidden">
            {(language === 'ko' ? card.tags_ko : card.tags_en).map((tag) => (
              <span key={tag} className="text-xs text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  )
}