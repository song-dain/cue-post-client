import { useEffect, useState } from 'react'
import type { CardItem } from '../data/cards'

type CardModalProps = {
  card: CardItem | null
  language: 'ko' | 'en' // 👈 부모(App.tsx)로부터 언어 상태 수신
  onClose: () => void
}

export function CardModal({ card, language, onClose }: CardModalProps) {
  const [copied, setCopied] = useState(false)
  const [userInput, setUserInput] = useState('')

  useEffect(() => {
    if (!card) return
    setCopied(false)
    setUserInput('')

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

  // 🌐 1. 현재 언어 상태에 맞는 프롬프트 원문 선택
  // 만약 백엔드에서 프롬프트를 아직 안 긁어와서 null이면 영어 설명이나 기본 텍스트로 폴백(Fallback) 처리
  const currentPrompt = (language === 'ko' ? card.prompt_ko : card.prompt_en) || card.summary_en

  // 🎯 2. 대괄호 변수([...])를 유저 입력값으로 실시간 치환
  const resolvedPrompt = userInput.trim()
    ? currentPrompt.replace(/\[[^\]]+\]/g, userInput.trim())
    : currentPrompt

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

        {/* 🌐 3. 카테고리 ID를 다국어 라벨로 매핑해서 노출해도 좋고, 직무 ID 그대로 노출해도 좋습니다. */}
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 uppercase tracking-wider">
          {card.category}
        </span>
        
        <h2 id="modal-title" className="mt-2 pr-8 text-xl font-semibold text-gray-900">
          {card.title}
        </h2>
        
        {/* 🌐 4. 언어별 설명 스위칭 */}
        <p className="mt-3 text-gray-600 leading-relaxed">
          {language === 'ko' ? card.summary_ko : card.summary_en}
        </p>

        {/* 🌐 5. 언어별 태그 스위칭 */}
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

        {/* 사용자 입력 textarea */}
        <div className="mt-5">
          <label
            htmlFor="user-input"
            className="block text-xs font-medium text-gray-500 mb-1.5"
          >
            {language === 'ko' ? '내용 입력' : 'Input Content'}
          </label>
          <textarea
            id="user-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={
              language === 'ko' 
                ? '여기에 검토할 내용이나 키워드를 입력하세요' 
                : 'Enter context or keywords to customize the prompt'
            }
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
        </div>

        {/* 프롬프트 미리보기 */}
        <div className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-gray-500">
              {language === 'ko' ? '완성된 프롬프트' : 'Generated Prompt'}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
            >
              {copied 
                ? (language === 'ko' ? '복사됨!' : 'Copied!') 
                : (language === 'ko' ? '복사하기' : 'Copy')}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {resolvedPrompt}
          </p>
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