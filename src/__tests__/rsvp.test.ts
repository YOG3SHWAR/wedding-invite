import { describe, it, expect, vi, beforeEach } from 'vitest'
import { normalizePhone, validatePhone, submitRsvp } from '../lib/rsvp'
import { setDoc } from 'firebase/firestore'

describe('normalizePhone', () => {
  it('returns 10-digit number as-is', () => {
    expect(normalizePhone('9876543210')).toBe('9876543210')
  })

  it('strips +91 prefix from 12-digit number', () => {
    expect(normalizePhone('+919876543210')).toBe('9876543210')
  })

  it('strips leading 0 from 11-digit number', () => {
    expect(normalizePhone('09876543210')).toBe('9876543210')
  })

  it('strips 91 country code from 12-digit number', () => {
    expect(normalizePhone('919876543210')).toBe('9876543210')
  })

  it('strips non-digit characters', () => {
    expect(normalizePhone('98-765-43210')).toBe('9876543210')
  })
})

describe('validatePhone', () => {
  it('returns valid for 10-digit number', () => {
    const result = validatePhone('9876543210')
    expect(result.valid).toBe(true)
    expect(result.normalized).toBe('9876543210')
    expect(result.error).toBeUndefined()
  })

  it('returns invalid for 8-digit number with error message', () => {
    const result = validatePhone('98765432')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('10')
  })

  it('error message contains both Hindi and English', () => {
    const result = validatePhone('12345')
    expect(result.error).toContain('कृपया')
    expect(result.error).toContain('Please')
  })
})

describe('submitRsvp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls setDoc with normalized phone as document ID and merge option', async () => {
    const phoneId = await submitRsvp({
      name: 'Test User',
      phone: '+919876543210',
      guestCount: 3,
      days: [1, 2, 3],
    })

    expect(phoneId).toBe('9876543210')
    expect(setDoc).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'rsvps', id: '9876543210' }),
      expect.objectContaining({
        name: 'Test User',
        phone: '9876543210',
        guestCount: 3,
        days: [1, 2, 3],
      }),
      { merge: true }
    )
  })

  it('throws error for invalid phone number', async () => {
    await expect(
      submitRsvp({
        name: 'Test User',
        phone: '12345',
        guestCount: 1,
        days: [1],
      })
    ).rejects.toThrow('10')
  })
})
