export function WeddingJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yogiandsudha.com'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: "Yogi & Sudha's Wedding Celebration",
    startDate: '2026-04-26',
    endDate: '2026-04-28',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    description:
      'Join Yogi & Sudha for their wedding celebration. Events include Tilak (26 Apr), Mehndi & Sangeet (27 Apr), and Haldi & Shadi (28 Apr 2026).',
    image: `${siteUrl}/images/og-image.jpg`,
    organizer: {
      '@type': 'Person',
      name: 'Yogi & Sudha',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
