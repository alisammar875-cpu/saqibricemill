'use client'

import { motion } from 'framer-motion'

const REASONS = [
  {
    icon: '🏭',
    title: 'Factory Direct',
    desc: 'No middlemen. Buy directly from our state-of-the-art processing facility in Gujranwala.',
  },
  {
    icon: '⏳',
    title: 'Aged 18-24 Months',
    desc: 'Our premium basmati is naturally aged for maximum aroma, length, and texture.',
  },
  {
    icon: '🔬',
    title: 'Lab Tested',
    desc: 'Every batch is tested for pesticides, moisture, and grain quality in our in-house lab.',
  },
  {
    icon: '🌱',
    title: 'Sustainably Grown',
    desc: 'Partnering with 500+ farmers across Punjab following eco-friendly cultivation practices.',
  },
  {
    icon: '📦',
    title: 'Vacuum Sealed',
    desc: 'Our 5-layer vacuum packaging locks in freshness from factory to your kitchen.',
  },
  {
    icon: '🌍',
    title: 'Export Grade',
    desc: 'The same premium quality exported to 42 countries, now available at your doorstep.',
  },
]

export function WhySection() {
  return (
    <section className="py-20 md:py-28" style={{ background: 'linear-gradient(135deg, #0a1f0a 0%, #001200 50%, #0a1a0a 100%)' }}>
      <div className="px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <div className="eyebrow mb-3" style={{ color: '#D4AF77' }}>Why Saqib Rice Mills</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-white leading-tight">
            Six Reasons to <em className="italic" style={{ color: '#D4AF77' }}>Choose Us</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative rounded-xl p-8 border transition-all duration-500 hover:-translate-y-1"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(212,175,119,0.12)',
              }}
            >
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'rgba(212,175,119,0.05)' }} />
              <span className="text-4xl mb-5 block">{r.icon}</span>
              <h3 className="font-display text-xl font-semibold mb-3" style={{ color: '#D4AF77' }}>
                {r.title}
              </h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
