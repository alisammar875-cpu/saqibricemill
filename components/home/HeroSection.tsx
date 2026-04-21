'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const STATS = [
  { num: '37+', label: 'Years of Excellence' },
  { num: '42',  label: 'Export Countries' },
  { num: '500T', label: 'Monthly Capacity' },
  { num: '100K+', label: 'Happy Customers' },
]

export function HeroSection() {
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = particlesRef.current
    if (!container) return
    const colors = ['#D4AF77', '#E8C97A', '#C49B5F']
    for (let i = 0; i < 32; i++) {
      const p = document.createElement('div')
      Object.assign(p.style, {
        position: 'absolute',
        left: `${Math.random() * 100}%`,
        top: `${80 + Math.random() * 20}%`,
        width: `${2 + Math.random() * 3}px`,
        height: `${6 + Math.random() * 8}px`,
        background: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: '50%',
        opacity: '0',
        animation: `grainFloat ${6 + Math.random() * 6}s ease-in-out ${Math.random() * 8}s infinite`,
      })
      container.appendChild(p)
    }
  }, [])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }
  const itemVariants = {
    hidden:   { opacity: 0, y: 40 },
    visible:  { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.23, 1, 0.32, 1] as const } },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ marginTop: '-80px' }}>
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg,#001800 0%,#003300 25%,#004800 50%,#002800 75%,#001200 100%)' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(212,175,119,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,119,0.04) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Rice field silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] pointer-events-none">
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,320 C80,280 160,300 240,270 C320,240 400,250 480,220 C560,190 640,210 720,190 C800,170 880,200 960,180 C1040,160 1120,190 1200,170 C1280,150 1360,180 1440,160 L1440,400 L0,400Z" fill="#003300" opacity="0.5"/>
          <path d="M0,360 C120,340 200,350 320,330 C440,310 520,340 640,320 C760,300 840,330 960,310 C1080,290 1200,320 1320,300 C1380,290 1420,310 1440,305 L1440,400 L0,400Z" fill="#002200" opacity="0.7"/>
        </svg>
      </div>

      {/* Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center max-w-[900px] px-6"
        style={{ paddingTop: '120px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-8">
          <span className="block w-10 h-px bg-gold/60" />
          <span className="text-2xs font-semibold tracking-widest2 uppercase text-gold">
            Est. 1987 · Punjab, Pakistan
          </span>
          <span className="block w-10 h-px bg-gold/60" />
        </motion.div>

        <motion.h1 variants={itemVariants} className="font-display text-white" style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)', fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>
          Where Every Grain
          <em className="block" style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Tells a Story</em>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-white/65 font-light leading-relaxed mt-5 mb-12" style={{ fontSize: 'clamp(0.85rem, 3.5vw, 1.1rem)', letterSpacing: '0.06em' }}>
          Premium basmati and specialty rice, grown in the fertile fields of Punjab.<br className="hidden sm:block" />
          From our family's factory directly to your table — unmatched quality since 1987.
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
          <Link href="/shop" className="btn btn-primary text-xs px-8 md:px-10 py-4">
            Shop Premium Rice
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/about#factory" className="btn btn-outline-gold text-xs px-8 md:px-9 py-[15px]">
            Watch Factory Tour
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 grid grid-cols-2 md:grid-cols-4"
        style={{ background: 'rgba(0,30,0,0.72)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(212,175,119,0.2)' }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`py-4 md:py-5 text-center ${i % 2 === 0 ? 'border-r' : ''} md:border-r border-[rgba(212,175,119,0.12)] ${i === 3 ? 'md:border-none' : ''} ${i > 1 ? 'border-t md:border-t-0 border-[rgba(212,175,119,0.12)]' : ''}`}
          >
            <div className="font-display text-[1.75rem] md:text-[2rem] font-semibold leading-none" style={{ color: 'var(--gold)' }}>{s.num}</div>
            <div className="text-[10px] md:text-2xs uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,220,0.55)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
        <span className="text-2xs uppercase tracking-widest" style={{ color: 'rgba(212,175,119,0.5)' }}>Scroll</span>
        <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom,var(--gold),transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}
