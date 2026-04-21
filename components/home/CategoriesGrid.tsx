'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const CATEGORIES = [
  {
    name: '1121 Basmati',
    nameUrdu: 'باسمتی ۱۱۲۱',
    slug: 'basmati',
    desc: 'Extra-long grain, aged perfection',
    emoji: '🌾',
    gradient: 'linear-gradient(135deg, #006400 0%, #004d00 100%)',
  },
  {
    name: 'Super Basmati',
    nameUrdu: 'سپر باسمتی',
    slug: 'basmati',
    desc: 'Traditional aromatic favorite',
    emoji: '✨',
    gradient: 'linear-gradient(135deg, #1a3a1a 0%, #0d2e0d 100%)',
  },
  {
    name: 'IRRI-6 / IRRI-9',
    nameUrdu: 'آئی آر آر آئی',
    slug: 'irri',
    desc: 'Everyday premium quality',
    emoji: '🍚',
    gradient: 'linear-gradient(135deg, #2d1810 0%, #1a0e08 100%)',
  },
  {
    name: 'Brown Basmati',
    nameUrdu: 'براؤن باسمتی',
    slug: 'basmati',
    desc: 'Unpolished, nutrient-rich',
    emoji: '🥗',
    gradient: 'linear-gradient(135deg, #3d2b1f 0%, #2a1d14 100%)',
  },
  {
    name: 'Sella (Parboiled)',
    nameUrdu: 'سیلا چاول',
    slug: 'basmati',
    desc: 'Non-sticky, easy cook',
    emoji: '🔥',
    gradient: 'linear-gradient(135deg, #4a3728 0%, #2e221a 100%)',
  },
  {
    name: 'Bulk / Export',
    nameUrdu: 'بلک آرڈرز',
    slug: 'basmati',
    desc: '25kg-50kg factory packaging',
    emoji: '📦',
    gradient: 'linear-gradient(135deg, #0a3d0a 0%, #062306 100%)',
  },
]

export function CategoriesGrid() {
  return (
    <section className="section-pad">
      <div className="text-center mb-14">
        <div className="eyebrow text-emerald mb-3">Our Collection</div>
        <h2 className="display-lg text-charcoal">
          Rice <em className="italic text-emerald">Varieties</em>
        </h2>
        <p className="text-mid-gray font-light text-base leading-relaxed mt-3 max-w-lg mx-auto">
          From the fertile plains of Punjab, we bring you the finest rice varieties — each grain carefully selected and aged.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/shop?cat=${cat.slug}`}
              className="group block relative rounded-xl overflow-hidden h-48 md:h-56"
              style={{ background: cat.gradient }}
            >
              {/* Hover shine */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <span className="text-3xl mb-2">{cat.emoji}</span>
                <h3
                  className="font-display text-xl font-semibold leading-tight"
                  style={{ color: '#D4AF77' }}
                >
                  {cat.name}
                </h3>
                <p className="text-white/50 text-xs mt-1">{cat.desc}</p>
              </div>

              {/* Arrow on hover */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold/50 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-gold group-hover:text-gold">
                →
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
