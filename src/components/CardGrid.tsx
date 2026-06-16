import type { CardItem } from '../data/cards'

type CardGridProps = {
  cards: CardItem[]
  onCardClick: (card: CardItem) => void
}

export function CardGrid({ cards, onCardClick }: CardGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onCardClick(card)}
          className="group flex aspect-square flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <span className="text-2xl font-bold text-indigo-600 group-hover:scale-110 transition-transform">
            {card.id}
          </span>
          <span className="mt-2 text-sm font-medium text-gray-800">{card.title}</span>
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {card.tags.map((tag) => (
              <span key={tag} className="text-xs text-gray-400">
                #{tag}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  )
}
