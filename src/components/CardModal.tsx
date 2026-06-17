import { useEffect, useState } from 'react'
import type { CardItem } from '../data/cards'

type CardModalProps = {
  card: CardItem | null
  language: 'ko' | 'en'
  onClose: () => void
}

export function CardModal({ card, language, onClose }: CardModalProps) {
  const [copied, setCopied] = useState(false)
  const [dynamicPrompt, setDynamicPrompt] = useState<{ ko: string | null; en: string | null }>({
    ko: null,
    en: null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!card) return
    setCopied(false)
    
    setDynamicPrompt({
      ko: card.prompt_ko,
      en: card.prompt_en
    })

    if (!card.prompt_ko || !card.prompt_en) {
      setLoading(true)
      fetch(`http://localhost:5001/api/cards/${card.id}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
        .then((res) => res.json())
        .then((data) => {
          setDynamicPrompt({
            ko: data.prompt_ko,
            en: data.prompt_en
          })
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [card, onClose])

  if (!card) return null

  const resolvedPrompt = (language === 'ko' ? dynamicPrompt.ko : dynamicPrompt.en) || card.summary_en

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={language === 'ko' ? '닫기' : 'Close'}
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label={language === 'ko' ? '닫기' : 'Close'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 uppercase tracking-wider">
          {card.category}
        </span>
        
        <h2 id="modal-title" className="mt-2 pr-8 text-xl font-semibold text-gray-900">
          {card.title}
        </h2>
        
        <p className="mt-3 text-gray-600 leading-relaxed">
          {language === 'ko' ? card.summary_ko : card.summary_en}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(language === 'ko' ? card.tags_ko : card.tags_en).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4 min-h-[120px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-gray-500">
                {language === 'ko' ? '마스터 프롬프트' : 'Master Prompt'}
              </p>
              {!loading && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {copied 
                    ? (language === 'ko' ? '복사됨!' : 'Copied!') 
                    : (language === 'ko' ? '복사하기' : 'Copy')}
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center pt-6 gap-2">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">
                  {language === 'ko' ? 'AI가 프롬프트 기획하는 중...' : 'AI is structuring your prompt...'}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {resolvedPrompt}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {language === 'ko' ? '닫기' : 'Close'}
        </button>
      </div>
    </div>
  )
}