/**
 * --- CONTENT CHECKLIST ---
 * Update these items before sharing the invitation link:
 *
 * [ ] EVENTS[*].time -- Real times for all 5 events
 * [ ] EVENTS[*].venue -- Real venue names
 * [ ] EVENTS[*].mapUrl -- Real Google Maps links
 * [ ] STORY_MILESTONES[*].description -- Real relationship milestones
 * [ ] GIFT_ITEMS[*].buyUrl -- Real purchase links (or remove section)
 * [x] public/images/og-couple.jpg -- Real couple photo for WhatsApp preview
 * [x] Gallery photos -- Replace placeholder SVGs with real photos
 * [ ] Video -- Replace placeholder with real pre-wedding video URL
 */

export const EVENT_COLORS = {
  tilak: '#9A031E',
  mehndi: '#0F4C5C',
  sangeet: '#9B2D8B',
  haldi: '#FB8B24',
  shadi: '#9A031E',
} as const

export const EVENT_COLORS_LIGHT = {
  tilak: '#E84258',
  mehndi: '#3A9BAD',
  sangeet: '#C490D1',
  haldi: '#FB8B24',
  shadi: '#E84258',
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
    time: '7:00 PM',
    venue: 'Agrasen Dham, Kotma',
    mapUrl: 'https://maps.app.goo.gl/uK27iNcTgJBssRb19',
    dressCode: 'Traditional / Kurta Pajama',
    description:
      'The groom is formally welcomed and honored by the bride\'s family with a sacred tilak ceremony.',
    colorKey: 'tilak' as const,
  },
  {
    name: 'Mehndi',
    nameHindi: 'मेहंदी',
    date: '27 April 2026',
    time: '4:00 PM',
    venue: 'Shreyash Resort',
    mapUrl: 'https://maps.app.goo.gl/3cfPmTPmurVXm3Sw7',
    dressCode: 'Colorful / Lehenga or Saree',
    description:
      'An evening of intricate henna art, music, and celebration as the bride is adorned with beautiful mehndi designs.',
    colorKey: 'mehndi' as const,
  },
  {
    name: 'Sangeet',
    nameHindi: 'संगीत',
    date: '27 April 2026',
    time: '7:00 PM',
    venue: 'Shreyash Resort',
    mapUrl: 'https://maps.app.goo.gl/3cfPmTPmurVXm3Sw7',
    dressCode: 'Glamorous / Party Wear',
    description:
      'A night of dance, music, and Bollywood performances celebrating the union of two families.',
    colorKey: 'sangeet' as const,
  },
  {
    name: 'Haldi',
    nameHindi: 'हल्दी',
    date: '28 April 2026',
    time: '10:00 AM',
    venue: 'Shreyash Resort',
    mapUrl: 'https://maps.app.goo.gl/3cfPmTPmurVXm3Sw7',
    dressCode: 'Yellow / Casual Indian',
    description:
      'A joyous morning ritual where turmeric paste is applied to bless the couple with radiance and prosperity.',
    colorKey: 'haldi' as const,
  },
  {
    name: 'Shadi',
    nameHindi: 'शादी',
    date: '28 April 2026',
    time: '7:00 PM',
    venue: 'Shreyash Resort',
    mapUrl: 'https://maps.app.goo.gl/3cfPmTPmurVXm3Sw7',
    dressCode: 'Grand / Sherwani or Saree',
    description:
      'The sacred wedding ceremony where two souls unite in the presence of family, friends, and divine blessings.',
    colorKey: 'shadi' as const,
  },
] as const

export const RSVP_DAYS = [
  {
    label: 'Day 1',
    labelHindi: 'पहला दिन',
    date: '26 April',
    events: ['Tilak'],
    colorKey: 'tilak' as const,
  },
  {
    label: 'Day 2',
    labelHindi: 'दूसरा दिन',
    date: '27 April',
    events: ['Mehndi', 'Sangeet'],
    colorKey: 'mehndi' as const,
  },
  {
    label: 'Day 3',
    labelHindi: 'तीसरा दिन',
    date: '28 April',
    events: ['Haldi', 'Shadi'],
    colorKey: 'haldi' as const,
  },
] as const

export const GIFT_ITEMS = [
  {
    id: 'gift-1',
    name: 'Silver Pooja Thali Set',
    nameHindi: 'चांदी की पूजा थाली सेट',
    priceRange: '₹2,000 - ₹5,000',
    image: '/images/gifts/placeholder.webp',
    buyUrl: 'https://example.com',
  },
  {
    id: 'gift-2',
    name: 'Brass Diya Set',
    nameHindi: 'पीतल दीया सेट',
    priceRange: '₹1,000 - ₹3,000',
    image: '/images/gifts/placeholder.webp',
    buyUrl: 'https://example.com',
  },
  {
    id: 'gift-3',
    name: 'Silk Bedsheet Set',
    nameHindi: 'सिल्क बेडशीट सेट',
    priceRange: '₹3,000 - ₹7,000',
    image: '/images/gifts/placeholder.webp',
    buyUrl: 'https://example.com',
  },
  {
    id: 'gift-4',
    name: 'Kitchen Appliance Set',
    nameHindi: 'किचन उपकरण सेट',
    priceRange: '₹5,000 - ₹10,000',
    image: '/images/gifts/placeholder.webp',
    buyUrl: 'https://example.com',
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
    title: 'Our Dream Takes Shape',
    titleHindi: 'सपना साकार होता है',
    year: '2024',
    description:
      'From stolen glances to shared dreams — planning a future together, one beautiful step at a time.',
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
