import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export type RsvpData = {
  name: string
  phone: string
  guestCount: number
  days: number[]
}

/**
 * Normalize an Indian phone number to 10 digits.
 * Strips non-digit characters, removes leading "91" (country code)
 * if 12 digits, removes leading "0" if 11 digits.
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2)
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1)
  }
  return digits
}

/**
 * Validate a phone number and return normalized form.
 */
export function validatePhone(raw: string): {
  valid: boolean
  normalized: string
  error?: string
} {
  const normalized = normalizePhone(raw)

  if (normalized.length !== 10) {
    return {
      valid: false,
      normalized,
      error:
        'Please enter a 10-digit phone number / कृपया 10 अंकों का फ़ोन नंबर दर्ज करें',
    }
  }

  return { valid: true, normalized }
}

/**
 * Submit RSVP data to Firestore.
 * Uses phone number as document ID for upsert behavior.
 */
export async function submitRsvp(data: RsvpData): Promise<string> {
  const { valid, normalized, error } = validatePhone(data.phone)

  if (!valid) {
    throw new Error(error)
  }

  const phoneId = normalized

  await setDoc(
    doc(db, 'rsvps', phoneId),
    {
      name: data.name,
      phone: phoneId,
      guestCount: data.guestCount,
      days: data.days,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )

  return phoneId
}
