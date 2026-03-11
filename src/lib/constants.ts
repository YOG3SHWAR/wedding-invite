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

/** ISO 8601 target date for the countdown timer (IST timezone) */
export const WEDDING_TARGET_DATE = '2026-04-28T00:00:00+05:30'

export const EVENTS = [
  {
    name: 'Tilak',
    nameHindi: 'तिलक',
    date: '26 April 2026',
    time: '10:00 AM', // placeholder
    venue: 'Venue TBD, City', // placeholder
    mapUrl: 'https://maps.google.com/?q=Venue+Name+City', // placeholder
    dressCode: 'Traditional / Kurta Pajama',
    description:
      'The groom is formally welcomed and honored by the bride\'s family with a sacred tilak ceremony.',
    colorKey: 'tilak' as const,
  },
  {
    name: 'Mehndi',
    nameHindi: 'मेहंदी',
    date: '27 April 2026',
    time: '4:00 PM', // placeholder
    venue: 'Venue TBD, City', // placeholder
    mapUrl: 'https://maps.google.com/?q=Venue+Name+City', // placeholder
    dressCode: 'Colorful / Lehenga or Saree',
    description:
      'An evening of intricate henna art, music, and celebration as the bride is adorned with beautiful mehndi designs.',
    colorKey: 'mehndi' as const,
  },
  {
    name: 'Sangeet',
    nameHindi: 'संगीत',
    date: '27 April 2026',
    time: '7:00 PM', // placeholder
    venue: 'Venue TBD, City', // placeholder
    mapUrl: 'https://maps.google.com/?q=Venue+Name+City', // placeholder
    dressCode: 'Glamorous / Party Wear',
    description:
      'A night of dance, music, and Bollywood performances celebrating the union of two families.',
    colorKey: 'sangeet' as const,
  },
  {
    name: 'Haldi',
    nameHindi: 'हल्दी',
    date: '28 April 2026',
    time: '9:00 AM', // placeholder
    venue: 'Venue TBD, City', // placeholder
    mapUrl: 'https://maps.google.com/?q=Venue+Name+City', // placeholder
    dressCode: 'Yellow / Casual Indian',
    description:
      'A joyous morning ritual where turmeric paste is applied to bless the couple with radiance and prosperity.',
    colorKey: 'haldi' as const,
  },
  {
    name: 'Shadi',
    nameHindi: 'शादी',
    date: '28 April 2026',
    time: '7:00 PM', // placeholder
    venue: 'Venue TBD, City', // placeholder
    mapUrl: 'https://maps.google.com/?q=Venue+Name+City', // placeholder
    dressCode: 'Grand / Sherwani or Saree',
    description:
      'The sacred wedding ceremony where two souls unite in the presence of family, friends, and divine blessings.',
    colorKey: 'shadi' as const,
  },
] as const

export const STORY_MILESTONES = [
  {
    id: 'how-we-met',
    title: 'How We Met',
    titleHindi: 'हम कैसे मिले',
    year: '2020',
    description:
      'Two paths crossed and the universe smiled. A chance meeting that would change everything forever.',
    imageKey: 'how-we-met',
  },
  {
    id: 'first-adventure',
    title: 'First Adventure Together',
    titleHindi: 'पहला साहस साथ में',
    year: '2021',
    description:
      'Our first journey together — exploring new places, sharing laughter, and discovering how perfectly our worlds fit together.',
    imageKey: 'first-adventure',
  },
  {
    id: 'the-moment',
    title: 'The Moment We Knew',
    titleHindi: 'वो खास पल',
    year: '2022',
    description:
      'Sometimes you just know. A quiet moment when we looked at each other and realized this was forever.',
    imageKey: 'the-moment',
  },
  {
    id: 'the-proposal',
    title: 'The Proposal',
    titleHindi: 'प्रस्ताव',
    year: '2024',
    description:
      'One question, one answer, infinite joy. The beginning of our forever journey together.',
    imageKey: 'the-proposal',
  },
  {
    id: 'beginning-forever',
    title: 'Beginning Forever',
    titleHindi: 'हमेशा की शुरुआत',
    year: '2026',
    description:
      'Two families, two hearts, one celebration. Our wedding marks the beautiful beginning of a lifetime together.',
    imageKey: 'beginning-forever',
  },
] as const
