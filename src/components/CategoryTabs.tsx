import type { MainCategory } from '../data/cards'

type CategoryTabsProps = {
  categories: readonly MainCategory[]
  selected: MainCategory
  onSelect: (category: MainCategory) => void
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-100 p-1">
      {categories.map((category) => {
        const isActive = category === selected
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={`rounded-lg py-3 text-base font-semibold transition-all ${
              isActive
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
