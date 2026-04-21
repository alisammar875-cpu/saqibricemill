'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function FactoryStory() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ background: 'linear-gradient(135deg, #001200 0%, #002800 50%, #001800 100%)' }}
    >
      <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Factory image placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px]"
          style={{ background: 'linear-gradient(145deg, #0F1A0F, #1E3020)' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8">
            <span className="text-6xl">🏭</span>
            <p className="font-display text-2xl font-semibold" style={{ color: '#D4AF77' }}>
              Our Factory
            </p>
            <p className="text-sm text-white/40 max-w-xs">
              State-of-the-art processing facility in Gujranwala, Punjab — established 1987
            </p>
          </div>

          {/* Decorative border */}
          <div
            className="absolute inset-3 rounded-xl border"
            style={{ borderColor: 'rgba(212,175,119,0.15)' }}
          />
        </motion.div>

        {/* Right: Story text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="eyebrow mb-4" style={{ color: '#D4AF77' }}>Est. 1987</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight mb-6">
            A Legacy of <em className="italic" style={{ color: '#D4AF77' }}>Quality</em>
          </h2>
          <div className="space-y-4 mb-8">
            <p className="text-white/55 font-light leading-relaxed">
              For over 37 years, Saqib Rice Mills has been a name synonymous with premium Pakistani rice. What started as a small family mill in Gujranwala has grown into one of Punjab&apos;s most respected rice processing and export companies.
            </p>
            <p className="text-white/55 font-light leading-relaxed">
              Our founder, Saqib, envisioned bringing the world&apos;s finest basmati rice directly from the lush fields of Punjab to dining tables across the globe. Today, we partner with over 500 farmers, employ 200+ workers, and export to 42 countries.
            </p>
            <p className="text-white/55 font-light leading-relaxed">
              Every grain passes through our triple-cleaning, color-sorting, and grading process — ensuring only the finest rice reaches your kitchen.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Link href="/about" className="btn btn-primary text-xs px-8 py-3.5">
              Read Full Story
              <span>→</span>
            </Link>
            <Link href="/about#certifications" className="btn btn-outline-gold text-xs px-7 py-3">
              Our Certifications
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
