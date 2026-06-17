type CategoryTabsProps = {
  categories: { id: string; label: string }[] // App.tsx에서 JOB_CATEGORIES를 매핑해서 넘겨준 구조
  selected: string // 현재 선택된 카테고리의 ID ('marketer', 'developer' 등)
  onSelect: (id: string) => void
}

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="grid grid-cols-5 gap-2 rounded-xl bg-gray-100 p-1">
      {categories.map((category) => {
        const isActive = category.id === selected
        
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}