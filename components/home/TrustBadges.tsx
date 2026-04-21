'use client'

import { motion } from 'framer-motion'

const BADGES = [
  { icon: '🏆', title: 'ISO 9001:2015', sub: 'Certified Quality' },
  { icon: '☪️', title: 'Halal Certified', sub: 'Guaranteed Purity' },
  { icon: '🌿', title: 'Pesticide Free', sub: 'Lab Tested' },
  { icon: '🚚', title: 'Free Delivery', sub: 'Orders Above PKR 5,000' },
  { icon: '🔄', title: '7-Day Returns', sub: 'Hassle-Free' },
  { icon: '🌍', title: '42 Countries', sub: 'Worldwide Export' },
]

export function TrustBadges() {
  return (
    <section className="relative py-6 overflow-hidden" style={{ background: 'var(--charcoal, #1A1A18)' }}>
      <div className="flex items-center gap-12 px-8 overflow-x-auto scrollbar-hide">
        {BADGES.map((badge, i) => (
          <motion.div
            key={badge.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <span className="text-2xl">{badge.icon}</span>
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#D4AF77' }}>
                {badge.title}
              </p>
              <p className="text-[0.65rem] tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {badge.sub}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
