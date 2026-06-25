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
  const [language, setLanguage] = useState<'ko' | 'en'>('ko')
  const [selectedCategory, setSelectedCategory] = useState<string>('marketer')
  const [selectedTag, setSelectedTag] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null)

  const [cards, setCards] = useState<CardItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const limit = 12;

  // 로컬 컴퓨터 환경과 클라우드 배포 환경 주소 자동 전환
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://cue-post-server.onrender.com';

  const subTags = useMemo(() => {
    if (!cards) return []
    const allTags = cards.flatMap(card => language === 'ko' ? card.tags_ko : card.tags_en)
    return Array.from(new Set(allTags))
  }, [cards, language])

  const filteredCards = useMemo(() => {
    if (!cards) return []
    return cards.filter((card) => {
      if (selectedTag.length === 0) return true
      const currentCardTags = language === 'ko' ? card.tags_ko : card.tags_en
      return selectedTag.every(tag => currentCardTags.includes(tag))
    })
  }, [cards, selectedTag, language])

  // 언어나 카테고리가 바뀌면 탭 필터만 클린하게 대사 처리
  useEffect(() => {
    setSelectedTag([])
    setPage(1)
  }, [language, selectedCategory])

  // 로컬/운영 분기 주소를 들고 데이터를 호출하는 일원화된 단일 파이프라인
  useEffect(() => {
    setIsLoading(true)
    fetch(`${API_BASE_URL}/api/cards?page=${page}&limit=${limit}&category=${selectedCategory}`)
    .then((res) => res.json())
    .then((data) => {
      setCards(data.cards || [])
      setTotalPages(data.totalPages || 1)
      setIsLoading(false)
    })
    .catch((err) => {
      console.error('데이터 가져오기 실패:', err)
      setCards([])
      setIsLoading(false)
    })
  }, [page, selectedCategory, API_BASE_URL])

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
    <div className="min-h-screen bg-gray-50 relative">
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

        <section className="mb-6">
          <CategoryTabs
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

        <section className="mb-10">
          {filteredCards.length > 0 ? (
            <CardGrid cards={filteredCards} language={language} onCardClick={setSelectedCard} />
          ) : (
            <p className="py-12 text-center text-sm text-gray-400">
              {language === 'ko' ? '해당 조건에 맞는 카드가 없습니다.' : 'No AI tools found matching this criteria.'}
            </p>
          )}
        </section>

        <footer className="flex justify-center items-center space-x-1 border-t border-gray-200 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {language === 'ko' ? '이전' : 'Prev'}
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`rounded px-3 py-1 text-sm font-semibold transition ${
                  page === pageNum
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            className="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {language === 'ko' ? '다음' : 'Next'}
          </button>
        </footer>
      </div>

      <CardModal card={selectedCard} language={language} onClose={() => setSelectedCard(null)} />
    </div>
  )
}

export default App