import { useMemo, useState, useEffect } from 'react'
import { CardGrid } from './components/CardGrid'
import { CardModal } from './components/CardModal'
import { CategoryTabs } from './components/CategoryTabs'
import { TagFilter } from './components/TagFilter'
import {
  getTagsByCategory,
  MAIN_CATEGORIES,
  type CardItem,
  type MainCategory,
} from './data/cards'

function App() {
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>('개발')
  const [selectedTag, setSelectedTag] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null)

  const [cards, setCards] = useState<CardItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const subTags = useMemo(() => {
    return getTagsByCategory(selectedCategory)
  }, [selectedCategory])

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (card.category !== selectedCategory) return false
      if (selectedTag.length === 0) return true
      return selectedTag.every(tag => card.tags.includes(tag))
    })
  }, [selectedCategory, selectedTag])

  useEffect(() => {
    fetch('http://localhost:5001/api/cards')
    .then((res) => res.json())
    .then((data) => {
      setCards(data)
      setIsLoading(false)
    })
    .catch((err) => {
      console.error('데이터 가져오기 실패:', err)
      setIsLoading(false)
    })
  }, [])

  const handleToggleTag = (tag: string) => {
    setSelectedTag((prev) =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleClearTags = () => {
    setSelectedTag([])
  }

  if(isLoading){
    return (
  <div className="flex h-screen items-center justify-center">
          <p className="text-xl font-semibold text-gray-600 animate-pulse">
            ⏳ 데이터 로딩 중...
          </p>
        </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">CuePost</h1>
          <p className="mt-1 text-sm text-gray-500">
            대분류를 선택하고 소분류 태그로 필터링하세요
          </p>
        </header>

        <section className="mb-6">
          <CategoryTabs
            categories={MAIN_CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>

        <section className="mb-8">
          <p className="mb-3 text-sm font-medium text-gray-500">소분류 태그</p>
          <TagFilter tags={subTags} selectedTags={selectedTag} onToggle={handleToggleTag} onClear={handleClearTags}/>
        </section>

        <section>
          {filteredCards.length > 0 ? (
            <CardGrid cards={filteredCards} onCardClick={setSelectedCard} />
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">
              해당 태그에 맞는 카드가 없습니다.
            </p>
          )}
        </section>
      </div>

      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  )
}

export default App
