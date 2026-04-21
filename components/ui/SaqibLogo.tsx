interface SaqibLogoProps {
  height?: number
  lightText?: boolean  // true when on dark/hero bg
  darkBg?: boolean     // true for footer (dark background)
  className?: string
}

export function SaqibLogo({ height = 44, lightText = false, darkBg = false, className = '' }: SaqibLogoProps) {
  const goldA  = lightText || darkBg ? '#E8C97A' : '#D4AF77'
  const goldB  = lightText || darkBg ? '#D4AF77' : '#C49B5F'
  const green  = lightText ? 'rgba(180,220,180,0.9)' : '#006400'
  const subAlpha = lightText || darkBg ? '0.6' : '1'
  const estAlpha = lightText || darkBg ? '0.6' : '0.8'
  const gradId = `logo-gold-${height}`
  const greenId = `logo-green-${height}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 120"
      height={height}
      width={(height * 320) / 120}
      className={className}
      aria-label="Saqib Rice Mills"
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={goldA} />
          <stop offset="50%"  stopColor={goldB} />
          <stop offset="100%" stopColor={goldA} />
        </linearGradient>
        <linearGradient id={greenId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={green} />
          <stop offset="100%" stopColor={darkBg ? 'rgba(100,180,100,0.7)' : '#004F00'} />
        </linearGradient>
      </defs>

      {/* Sheaf icon */}
      <g transform="translate(18,8)">
        <line x1="42" y1="100" x2="42" y2="30" stroke={`url(#${gradId})`} strokeWidth="2.2" strokeLinecap="round"/>
        <ellipse cx="42" cy="32" rx="5" ry="9" fill={`url(#${gradId})`} opacity="0.95"/>
        <ellipse cx="42" cy="46" rx="4" ry="7.5" fill={`url(#${gradId})`} opacity="0.85"/>
        <ellipse cx="42" cy="59" rx="3.8" ry="7" fill={`url(#${gradId})`} opacity="0.75"/>
        <line x1="42" y1="55" x2="28" y2="38" stroke={`url(#${gradId})`} strokeWidth="1.6" strokeLinecap="round"/>
        <ellipse cx="26" cy="32" rx="4" ry="8" fill={`url(#${gradId})`} opacity="0.88" transform="rotate(-20 26 32)"/>
        <ellipse cx="34" cy="44" rx="3.5" ry="7" fill={`url(#${gradId})`} opacity="0.75" transform="rotate(-15 34 44)"/>
        <line x1="36" y1="65" x2="20" y2="50" stroke={`url(#${gradId})`} strokeWidth="1.3" strokeLinecap="round"/>
        <ellipse cx="17" cy="44" rx="3.5" ry="7.5" fill={`url(#${gradId})`} opacity="0.72" transform="rotate(-25 17 44)"/>
        <line x1="42" y1="55" x2="56" y2="38" stroke={`url(#${gradId})`} strokeWidth="1.6" strokeLinecap="round"/>
        <ellipse cx="58" cy="32" rx="4" ry="8" fill={`url(#${gradId})`} opacity="0.88" transform="rotate(20 58 32)"/>
        <ellipse cx="50" cy="44" rx="3.5" ry="7" fill={`url(#${gradId})`} opacity="0.75" transform="rotate(15 50 44)"/>
        <line x1="48" y1="65" x2="64" y2="50" stroke={`url(#${gradId})`} strokeWidth="1.3" strokeLinecap="round"/>
        <ellipse cx="67" cy="44" rx="3.5" ry="7.5" fill={`url(#${gradId})`} opacity="0.72" transform="rotate(25 67 44)"/>
        <path d="M32 92 Q42 88 52 92 Q42 97 32 92Z" fill={`url(#${greenId})`} opacity="0.9"/>
        <line x1="42" y1="88" x2="42" y2="100" stroke={`url(#${greenId})`} strokeWidth="2" strokeLinecap="round"/>
        <path d="M42 78 Q35 72 30 76 Q36 74 42 78Z" fill={`url(#${greenId})`} opacity="0.7"/>
        <path d="M42 78 Q49 72 54 76 Q48 74 42 78Z" fill={`url(#${greenId})`} opacity="0.7"/>
      </g>

      {/* Divider */}
      <line x1="100" y1="20" x2="100" y2="100" stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.5"/>

      {/* Text */}
      <g transform="translate(112,0)">
        <text x="0" y="52"
          fontFamily="'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif"
          fontSize="38" fontWeight="700" letterSpacing="8"
          fill={`url(#${gradId})`}
        >SAQIB</text>
        <line x1="1" y1="60" x2="196" y2="60" stroke={`url(#${gradId})`} strokeWidth="0.8" opacity="0.6"/>
        <text x="2" y="77"
          fontFamily="'Palatino Linotype',Georgia,serif"
          fontSize="15.5" fontWeight="400" letterSpacing="11"
          fill={green} opacity={subAlpha}
        >RICE MILLS</text>
        <text x="52" y="93"
          fontFamily="'Palatino Linotype',Georgia,serif"
          fontSize="9" fontWeight="400" letterSpacing="4"
          fill={goldB} opacity={estAlpha}
        >EST. 1987 · PAKISTAN</text>
      </g>
    </svg>
  )
}