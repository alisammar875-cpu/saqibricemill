'use client'

import { useState } from 'react'
import Link from 'next/link'

const ANNOUNCEMENTS = [
  '🌾 Free shipping on orders above PKR 5,000  ·  Discount code: WELCOME10',
  '🏆 ISO 9001:2015 Certified · Halal Certified · Now exporting to UAE, UK & Saudi Arabia',
  '📦 Same-day dispatch from Gujranwala for orders placed before 2 PM',
]

export function AnnouncementBar() {
  const [idx, setIdx] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-8 flex items-center justify-between px-6"
      style={{ background: 'var(--emerald-deep)' }}
    >
      <div className="flex-1 text-center">
        <button
          onClick={() => setIdx(i => (i + 1) % ANNOUNCEMENTS.length)}
          className="text-2xs font-medium tracking-wider"
          style={{ color: 'var(--gold)', letterSpacing: '0.12em' }}
        >
          {ANNOUNCEMENTS[idx]}
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="ml-4 text-gold/60 hover:text-gold transition-colors text-xs flex-shrink-0"
      >✕</button>
    </div>
  )
}
