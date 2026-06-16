type TagFilterProps = {
  tags: string[]
  selectedTags: string[]
  onToggle: (tag: string) => void
  onClear: () => void
}

export function TagFilter({ tags, selectedTags, onToggle, onClear }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onClear}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selectedTags.length === 0
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
        }`}
        >전체</button>
      {tags.map((tag) => {
        const isActive = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
