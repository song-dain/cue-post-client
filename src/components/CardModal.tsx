import { useEffect, useState } from 'react'
import type { CardItem } from '../data/cards'

type CardModalProps = {
  card: CardItem | null
  onClose: () => void
}

export function CardModal({ card, onClose }: CardModalProps) {
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

  // 대괄호 변수([...])를 유저 입력값으로 실시간 치환
  const resolvedPrompt = userInput.trim()
    ? card.prompt.replace(/\[[^\]]+\]/g, userInput.trim())
    : card.prompt

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
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {card.category}
        </span>
        <h2 id="modal-title" className="mt-2 pr-8 text-xl font-semibold text-gray-900">
          {card.title}
        </h2>
        <p className="mt-3 text-gray-600 leading-relaxed">{card.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {card.tags.map((tag) => (
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
            내용 입력
          </label>
          <textarea
            id="user-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="여기에 검토할 API 명세나 코드를 입력하세요"
            rows={5}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
          />
        </div>

        {/* 프롬프트 미리보기 */}
        <div className="mt-3 rounded-xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-gray-500">완성된 프롬프트</p>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
            >
              {copied ? '복사됨!' : '복사하기'}
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
          닫기
        </button>
      </div>
    </div>
  )
}
