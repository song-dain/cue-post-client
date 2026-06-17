export interface CardItem {
  id: number
  category: 'marketer' | 'developer' | 'designer' | 'pm-hr' | 'individual'
  title: string
  tags_en: string[]
  tags_ko: string[]
  summary_en: string
  summary_ko: string
  prompt_ko: string | null
  prompt_en: string | null
  image_url: string | null
}

// 🌐 화면 상단 탭메뉴 렌더링을 위한 다국어 지원 카테고리 마스터 데이터
export const JOB_CATEGORIES = [
  { id: 'all', ko: '전체 보기', en: 'All Tools' },
  { id: 'marketer', ko: '마케터', en: 'For Marketers' },
  { id: 'developer', ko: '개발자', en: 'For Developers' },
  { id: 'designer', ko: '디자이너', en: 'For Designers' },
  { id: 'pm-hr', ko: '기획 및 인사', en: 'For PM & HR' },
  { id: 'individual', ko: '개인 생산성', en: 'For Individuals' }
] as const;