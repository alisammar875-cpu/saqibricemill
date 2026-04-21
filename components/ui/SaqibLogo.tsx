interface SaqibLogoProps {
  height?: number
  lightText?: boolean  // true when on dark/hero bg
  darkBg?: boolean     // true for footer (dark background)
  className?: string
}

export function SaqibLogo({ height = 44, lightText = false, darkBg = false, className = '' }: SaqibLogoProps) {
  // Theme-aware colors
  const gold = lightText || darkBg ? '#E8C97A' : '#D4AF77'
  const green = lightText ? '#A5D6A7' : '#006400'
  const textColor = lightText || darkBg ? '#FFFFFF' : '#1A1A18'
  const subTextColor = lightText || darkBg ? 'rgba(255,255,255,0.7)' : '#6B6B5E'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 80"
      height={height}
      width={(height * 280) / 80}
      className={className}
      aria-label="Saqib Rice Mills"
      role="img"
    >
      {/* Abstract Modern Rice Stalk Icon */}
      <g transform="translate(10, 15)">
        {/* Main Stem */}
        <path 
          d="M25 50 Q25 25 35 5" 
          fill="none" 
          stroke={green} 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        
        {/* Grain 1 (Left) */}
        <path 
          d="M25 40 Q10 35 15 20 Q20 15 25 30" 
          fill={gold} 
        />
        
        {/* Grain 2 (Right) */}
        <path 
          d="M27 30 Q42 25 37 10 Q32 5 28 20" 
          fill={gold} 
        />
        
        {/* Grain 3 (Top Left) */}
        <path 
          d="M26 22 Q15 15 20 5 Q25 2 28 12" 
          fill={gold} 
        />
      </g>

      {/* Brand Typography */}
      <g transform="translate(70, 45)">
        <text 
          x="0" 
          y="0" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="34" 
          fontWeight="800" 
          letterSpacing="0.05em" 
          fill={textColor}
        >
          SAQIB
        </text>
        <text 
          x="2" 
          y="22" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="14" 
          fontWeight="500" 
          letterSpacing="0.4em" 
          fill={subTextColor}
        >
          RICE MILLS
        </text>
      </g>
    </svg>
  )
}