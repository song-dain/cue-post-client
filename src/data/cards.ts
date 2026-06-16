export interface CardItem {
  id: number
  category: '개발' | '디자인' | '영상편집'
  title: string
  tags: string[]
  summary: string
  prompt: string
}

export const MAIN_CATEGORIES = ['개발', '디자인', '영상편집'] as const

export type MainCategory = (typeof MAIN_CATEGORIES)[number]

export const cards: CardItem[] = [
  {
    id: 1,
    category: '개발',
    title: '코드 오류 디버깅',
    tags: ['에러', '디버깅'],
    summary: '복잡한 런타임 에러 로그를 분석하여 원인과 해결책을 도출합니다.',
    prompt: '아래 에러 로그를 분석해서 원인과 해결 단계를 설명해줘: [에러로그]',
  },
  {
    id: 2,
    category: '개발',
    title: 'API 설계 리뷰',
    tags: ['REST', '백엔드'],
    summary: 'REST API 엔드포인트 구조와 응답 스키마를 검토하고 개선안을 제안받습니다.',
    prompt: '아래 API 명세를 검토하고 RESTful 원칙에 맞는 개선점을 알려줘: [API명세]',
  },
  {
    id: 3,
    category: '개발',
    title: 'SQL 쿼리 최적화',
    tags: ['데이터베이스', '성능'],
    summary: '느린 SQL 쿼리를 분석하고 인덱스·조인 최적화 방안을 도출합니다.',
    prompt: '아래 SQL 쿼리의 성능 병목을 분석하고 최적화된 쿼리를 작성해줘: [SQL]',
  },
  {
    id: 4,
    category: '개발',
    title: 'TypeScript 타입 설계',
    tags: ['타입', '프론트엔드'],
    summary: '복잡한 도메인 모델에 맞는 TypeScript 타입과 유틸리티 타입을 설계합니다.',
    prompt: '아래 데이터 구조에 맞는 TypeScript 타입과 discriminated union을 설계해줘: [데이터구조]',
  },
  {
    id: 5,
    category: '디자인',
    title: 'UI 컴포넌트 아이디어',
    tags: ['레이아웃', '웹디자인'],
    summary: '특정 테마에 맞는 웹 페이지의 컴포넌트 구조와 컬러 가이드를 제안받습니다.',
    prompt: '어두운 테마의 대시보드 웹 사이트에 어울리는 핵심 컬러 조합 3개와 컴포넌트 레이아웃을 추천해줘.',
  },
  {
    id: 6,
    category: '디자인',
    title: '타이포그래피 가이드',
    tags: ['폰트', '브랜딩'],
    summary: '브랜드 톤에 맞는 폰트 조합과 계층 구조를 설계합니다.',
    prompt: '모던하고 신뢰감 있는 SaaS 브랜드에 어울리는 제목·본문 폰트 조합 3가지를 추천해줘.',
  },
  {
    id: 7,
    category: '디자인',
    title: '모바일 UX 개선',
    tags: ['UX', '모바일'],
    summary: '모바일 화면의 사용성 문제를 분석하고 개선 방향을 제안받습니다.',
    prompt: '아래 모바일 앱 화면의 UX 문제점을 분석하고 개선안을 제시해줘: [화면설명]',
  },
  {
    id: 8,
    category: '영상편집',
    title: '쇼츠 편집 구성',
    tags: ['쇼츠', '구성'],
    summary: '짧은 영상의 훅·전개·CTA 구조를 기획하고 컷 리스트를 작성합니다.',
    prompt: '30초 쇼츠 영상의 훅 3초, 본문, 마무리 CTA 구성을 제안해줘. 주제: [주제]',
  },
  {
    id: 9,
    category: '영상편집',
    title: '자막 스타일 가이드',
    tags: ['자막', '모션'],
    summary: '영상 톤에 맞는 자막 폰트, 색상, 애니메이션 스타일을 정의합니다.',
    prompt: '유튜브 튜토리얼 영상에 어울리는 자막 스타일(폰트, 색상, 등장 효과)을 3가지 제안해줘.',
  },
  {
    id: 10,
    category: '영상편집',
    title: 'BGM 선곡 추천',
    tags: ['음악', '분위기'],
    summary: '영상 분위기와 길이에 맞는 배경음악 장르와 BPM을 추천받습니다.',
    prompt: '감성 브이로그 영상(5분)에 어울리는 BGM 장르, BPM, 분위기 키워드를 추천해줘.',
  },
  {
    id: 11,
    category: '영상편집',
    title: '컬러 그레이딩 프리셋',
    tags: ['색보정', '분위기'],
    summary: '영상 장르와 무드에 맞는 컬러 그레이딩 방향을 제안받습니다.',
    prompt: '여행 브이로그 영상에 어울리는 LUT/컬러 그레이딩 프리셋 3가지를 설명해줘.',
  },
]

export function getTagsByCategory(category: MainCategory): string[] {
  const tagSet = new Set<string>()
  for (const card of cards) {
    if (card.category === category) {
      for (const tag of card.tags) {
        tagSet.add(tag)
      }
    }
  }
  return [...tagSet].sort()
}
