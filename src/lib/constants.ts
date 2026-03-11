export const EVENT_COLORS = {
  tilak: '#C41E3A',
  mehndi: '#228B22',
  sangeet: '#9B59B6',
  haldi: '#F4C430',
  shadi: '#800020',
} as const

export const COUPLE = {
  nameHindi: 'योगी & सुधा',
  nameEnglish: 'Yogi & Sudha',
  weddingDate: '28 April 2026',
} as const

export const EVENTS = [
  { name: 'Tilak', nameHindi: 'तिलक', date: '26 April 2026', colorKey: 'tilak' as const },
  { name: 'Mehndi', nameHindi: 'मेहंदी', date: '27 April 2026', colorKey: 'mehndi' as const },
  { name: 'Sangeet', nameHindi: 'संगीत', date: '27 April 2026', colorKey: 'sangeet' as const },
  { name: 'Haldi', nameHindi: 'हल्दी', date: '28 April 2026', colorKey: 'haldi' as const },
  { name: 'Shadi', nameHindi: 'शादी', date: '28 April 2026', colorKey: 'shadi' as const },
] as const
