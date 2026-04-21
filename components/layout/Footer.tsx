import Link from 'next/link'
import { SaqibLogo } from '@/components/ui/SaqibLogo'

const QUICK_LINKS = [
  { href: '/shop', label: 'Shop Rice' },
  { href: '/shop?cat=bulk-export', label: 'Bulk Orders' },
  { href: '/export', label: 'Export Enquiry' },
  { href: '/recipes', label: 'Recipe Blog' },
  { href: '/about', label: 'Our Story' },
  { href: '/about#certifications', label: 'Certifications' },
]

const SUPPORT_LINKS = [
  { href: '/account', label: 'My Account' },
  { href: '/account/orders', label: 'Track My Order' },
  { href: '/returns', label: 'Returns Policy' },
  { href: '/faq', label: 'FAQ' },
  { href: '/wholesale', label: 'Wholesale Pricing' },
  { href: '/contact', label: 'Contact Us' },
]

export function Footer() {
  return (
    <footer style={{ background: 'var(--dark)' }} className="text-white/60">
      <div className="px-[8vw] pt-20 pb-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16 border-b border-gold/[0.12]">
          {/* Brand column */}
          <div>
            <SaqibLogo height={42} darkBg />
            <p className="text-sm font-light leading-relaxed mt-5 mb-8 text-white/45">
              Pakistan's finest premium rice since 1987. Direct factory pricing, international certifications, and doorstep delivery across Pakistan and 42 export nations.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'LinkedIn', icon: 'in', href: '#' },
                { label: 'Facebook', icon: 'f', href: '#' },
                { label: 'Instagram', icon: '✦', href: '#' },
                { label: 'YouTube', icon: '▶', href: '#' },
                { label: 'Twitter/X', icon: '𝕏', href: '#' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-gold/20 flex items-center justify-center text-gold/50 text-xs hover:border-gold hover:text-gold hover:bg-gold/8 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-2xs font-semibold tracking-widest2 uppercase text-gold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm font-light text-white/45 hover:text-gold transition-colors duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-2xs font-semibold tracking-widest2 uppercase text-gold mb-6">Customer Care</h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm font-light text-white/45 hover:text-gold transition-colors duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-2xs font-semibold tracking-widest2 uppercase text-gold mb-6">Contact Factory</h4>
            <div className="space-y-4">
              {[
                { icon: '📍', text: 'Industrial Area Phase-II,\nGujranwala, Punjab 52250\nPakistan' },
                { icon: '📞', text: '+92 55 3842100\n+92 300 7654321 (WhatsApp)' },
                { icon: '✉️', text: 'info@saqibricemills.com\nexport@saqibricemills.com' },
                { icon: '🕐', text: 'Mon–Sat: 8:00 AM – 6:00 PM PKT' },
              ].map((c, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="mt-0.5 flex-shrink-0">{c.icon}</span>
                  <span className="text-sm font-light text-white/45 leading-relaxed whitespace-pre-line">{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-2xs text-white/25 tracking-wide">
            © 2026 Saqib Rice Mills (Pvt) Ltd. All Rights Reserved.
            {' · '}
            <Link href="/privacy" className="hover:text-gold/60 transition-colors">Privacy Policy</Link>
            {' · '}
            <Link href="/terms" className="hover:text-gold/60 transition-colors">Terms of Service</Link>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xs text-white/25 uppercase tracking-wider mr-1">We Accept:</span>
            {['JazzCash', 'EasyPaisa', 'Visa', 'Mastercard', 'COD'].map(p => (
              <span key={p} className="px-2.5 py-1 border border-gold/15 rounded text-2xs font-semibold text-gold/40 tracking-wide uppercase">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
