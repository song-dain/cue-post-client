import { useMemo, useState, useEffect } from 'react'
import { CardGrid } from './components/CardGrid'
import { CardModal } from './components/CardModal'
import { CategoryTabs } from './components/CategoryTabs'
import { TagFilter } from './components/TagFilter'
import {
  JOB_CATEGORIES, 
  type CardItem,
} from './data/cards'

function App() {
  // 🌐 다국어 상태 추가 ('ko' = 한국어, 'en' = 영어)
  const [language, setLanguage] = useState<'ko' | 'en'>('ko')
  
  // 🎯 카테고리 초기값을 영어 ID로 변경
  const [selectedCategory, setSelectedCategory] = useState<string>('marketer')
  const [selectedTag, setSelectedTag] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null)

  const [cards, setCards] = useState<CardItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 🏷️ 소분류 태그 동적 추출
  // 현재 카테고리에 속한 카드들이 가진 tags_ko 또는 tags_en 배열을 중복 없이 묶어냅니다.
  const subTags = useMemo(() => {
    const targetCards = cards.filter(card => card.category === selectedCategory)
    const allTags = targetCards.flatMap(card => language === 'ko' ? card.tags_ko : card.tags_en)
    return Array.from(new Set(allTags))
  }, [cards, selectedCategory, language])

  // 🎯 필터링된 카드 계산 (다국어 스키마 반영)
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // 1. 직무 카테고리 매칭 검사 ('marketer', 'developer' 등)
      if (card.category !== selectedCategory) return false
      if (selectedTag.length === 0) return true
      
      // 2. 다국어 상태에 맞는 태그 필터 검사
      const currentCardTags = language === 'ko' ? card.tags_ko : card.tags_en
      return selectedTag.every(tag => currentCardTags.includes(tag))
    })
  }, [cards, selectedCategory, selectedTag, language])

  // 🔄 언어가 바뀔 때 선택되어 있던 소분류 태그 초기화 (한영 태그 글자가 다르므로)
  useEffect(() => {
    setSelectedTag([])
  }, [language, selectedCategory])

  useEffect(() => {
    fetch('https://cue-post-server.onrender.com/api/cards')
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
          {language === 'ko' ? '⏳ 데이터 로딩 중...' : '⏳ Loading data...'}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🌐 우측 상단 플로팅 다국어 토글 버튼 */}
      <div className="absolute top-4 right-6">
        <button
          onClick={() => setLanguage(prev => prev === 'ko' ? 'en' : 'ko')}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition"
        >
          {language === 'ko' ? '🌐 English' : '🌐 한국어'}
        </button>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">CuePost AI</h1>
          <p className="mt-1 text-sm text-gray-500">
            {language === 'ko' 
              ? '실무 직무별 카테고리를 선택하고 필터링하세요' 
              : 'Select a job-role category and filter down with tags'}
          </p>
        </header>

        {/* 🎛️ 직무 분류 탭 컴포넌트 */}
        <section className="mb-6">
          <CategoryTabs
            // 언어에 맞게 카테고리 표시 이름 배열을 런타임 가공하여 주입
            categories={JOB_CATEGORIES.map(cat => ({
              id: cat.id,
              label: language === 'ko' ? cat.ko : cat.en
            }))}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>

        <section className="mb-8">
          <p className="mb-3 text-sm font-medium text-gray-500">
            {language === 'ko' ? '소분류 태그' : 'Sub Tags'}
          </p>
          <TagFilter tags={subTags} selectedTags={selectedTag} onToggle={handleToggleTag} onClear={handleClearTags}/>
        </section>

        <section>
          {filteredCards.length > 0 ? (
            <CardGrid cards={filteredCards} language={language} onCardClick={setSelectedCard} />
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">
              {language === 'ko' ? '해당 조건에 맞는 카드가 없습니다.' : 'No AI tools found matching this criteria.'}
            </p>
          )}
        </section>
      </div>

      <CardModal card={selectedCard} language={language} onClose={() => setSelectedCard(null)} />
    </div>
  )
}

export default App