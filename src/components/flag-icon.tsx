import React from "react";

interface FlagIconProps {
  country: string;
  className?: string;
}

export function FlagIcon({ country, className = "w-5 h-4" }: FlagIconProps) {
  // Map country names to country codes for flag SVGs
  const countryToCode: Record<string, string> = {
    "Thailand": "th",
    "Philippines": "ph",
    "Mexico": "mx",
    "Colombia": "co",
    "Brazil": "br",
    "Indonesia": "id",
    "Malaysia": "my",
    "Dominican Republic": "do",
    "Costa Rica": "cr",
    "Panama": "pa",
    "Argentina": "ar",
    "Peru": "pe",
    "Vietnam": "vn",
    "Cambodia": "kh",
    "Kenya": "ke",
    "Tanzania": "tz",
    "South Africa": "za",
    "Nigeria": "ng",
    "Morocco": "ma",
    "Tunisia": "tn",
    "Egypt": "eg",
    "Turkey": "tr",
    "UAE": "ae",
    "Poland": "pl",
    "Czech Republic": "cz",
    "Hungary": "hu",
    "Romania": "ro",
    "Bulgaria": "bg",
    "Ukraine": "ua",
    "Russia": "ru",
    "Portugal": "pt",
    "Spain": "es",
    "Germany": "de",
    "Netherlands": "nl",
    "UK": "gb",
    "Georgia": "ge",
  };

  const code = countryToCode[country]?.toLowerCase() || "un"; // UN flag as fallback

  // Using flag-icons CSS library format (we'll need to install this)
  // For now, using inline SVG flags for the most common countries
  const flagSvgs: Record<string, JSX.Element> = {
    th: ( // Thailand
      <svg viewBox="0 0 900 600" className={className}>
        <rect width="900" height="600" fill="#ED1C24"/>
        <rect width="900" height="400" y="100" fill="#FFFFFF"/>
        <rect width="900" height="200" y="200" fill="#241D4F"/>
      </svg>
    ),
    ph: ( // Philippines
      <svg viewBox="0 0 900 450" className={className}>
        <rect width="900" height="450" fill="#0038A8"/>
        <rect width="900" height="225" y="225" fill="#CE1126"/>
        <polygon points="200,225 50,150 50,300" fill="#FFFFFF"/>
        <polygon points="200,225 100,225 125,175 150,225 175,175" fill="#FCD116"/>
      </svg>
    ),
    mx: ( // Mexico
      <svg viewBox="0 0 840 480" className={className}>
        <rect width="280" height="480" fill="#006847"/>
        <rect width="280" height="480" x="280" fill="#FFFFFF"/>
        <rect width="280" height="480" x="560" fill="#CE1126"/>
      </svg>
    ),
    co: ( // Colombia
      <svg viewBox="0 0 900 600" className={className}>
        <rect width="900" height="300" fill="#FCD116"/>
        <rect width="900" height="150" y="300" fill="#003893"/>
        <rect width="900" height="150" y="450" fill="#CE1126"/>
      </svg>
    ),
    br: ( // Brazil
      <svg viewBox="0 0 720 504" className={className}>
        <rect width="720" height="504" fill="#009B3A"/>
        <polygon points="360,76 648,252 360,428 72,252" fill="#FEDF00"/>
        <circle cx="360" cy="252" r="84" fill="#002776"/>
      </svg>
    ),
    id: ( // Indonesia
      <svg viewBox="0 0 900 600" className={className}>
        <rect width="900" height="300" fill="#FF0000"/>
        <rect width="900" height="300" y="300" fill="#FFFFFF"/>
      </svg>
    ),
    my: ( // Malaysia
      <svg viewBox="0 0 570 300" className={className}>
        <rect width="570" height="300" fill="#CC0000"/>
        <rect width="570" height="21.43" fill="#FFFFFF"/>
        <rect width="570" height="21.43" y="42.86" fill="#FFFFFF"/>
        <rect width="570" height="21.43" y="85.72" fill="#FFFFFF"/>
        <rect width="570" height="21.43" y="128.58" fill="#FFFFFF"/>
        <rect width="570" height="21.43" y="171.44" fill="#FFFFFF"/>
        <rect width="570" height="21.43" y="214.3" fill="#FFFFFF"/>
        <rect width="570" height="21.43" y="257.16" fill="#FFFFFF"/>
        <rect width="285" height="150" fill="#010066"/>
        <circle cx="142.5" cy="75" r="35" fill="#FFCC00"/>
        <polygon points="190,75 175,50 160,75 185,60 165,60" fill="#FFCC00"/>
      </svg>
    ),
    vn: ( // Vietnam
      <svg viewBox="0 0 900 600" className={className}>
        <rect width="900" height="600" fill="#DA251D"/>
        <polygon points="450,180 490,320 370,240 530,240 410,320" fill="#FFFF00"/>
      </svg>
    ),
    ae: ( // UAE
      <svg viewBox="0 0 840 420" className={className}>
        <rect width="840" height="140" fill="#00732F"/>
        <rect width="840" height="140" y="140" fill="#FFFFFF"/>
        <rect width="840" height="140" y="280" fill="#000000"/>
        <rect width="210" height="420" fill="#FF0000"/>
      </svg>
    ),
    pl: ( // Poland
      <svg viewBox="0 0 800 500" className={className}>
        <rect width="800" height="250" fill="#FFFFFF"/>
        <rect width="800" height="250" y="250" fill="#DC143C"/>
      </svg>
    ),
    pt: ( // Portugal
      <svg viewBox="0 0 600 400" className={className}>
        <rect width="240" height="400" fill="#006600"/>
        <rect width="360" height="400" x="240" fill="#FF0000"/>
        <circle cx="240" cy="200" r="75" fill="#FFCC00" stroke="#FF0000" strokeWidth="3"/>
      </svg>
    ),
    es: ( // Spain
      <svg viewBox="0 0 750 500" className={className}>
        <rect width="750" height="125" fill="#AA151B"/>
        <rect width="750" height="250" y="125" fill="#F1BF00"/>
        <rect width="750" height="125" y="375" fill="#AA151B"/>
      </svg>
    ),
    de: ( // Germany
      <svg viewBox="0 0 900 600" className={className}>
        <rect width="900" height="200" fill="#000000"/>
        <rect width="900" height="200" y="200" fill="#DD0000"/>
        <rect width="900" height="200" y="400" fill="#FFCE00"/>
      </svg>
    ),
    gb: ( // UK
      <svg viewBox="0 0 600 300" className={className}>
        <rect width="600" height="300" fill="#012169"/>
        <path d="M0,0 L600,300 M600,0 L0,300" stroke="#FFFFFF" strokeWidth="60"/>
        <path d="M0,0 L600,300 M600,0 L0,300" stroke="#C8102E" strokeWidth="40"/>
        <path d="M300,0 L300,300 M0,150 L600,150" stroke="#FFFFFF" strokeWidth="100"/>
        <path d="M300,0 L300,300 M0,150 L600,150" stroke="#C8102E" strokeWidth="60"/>
      </svg>
    ),
    ge: ( // Georgia
      <svg viewBox="0 0 900 600" className={className}>
        <rect width="900" height="600" fill="#FFFFFF"/>
        <rect width="900" height="60" y="270" fill="#FF0000"/>
        <rect width="60" height="600" x="420" fill="#FF0000"/>
        <rect width="30" height="30" x="180" y="120" fill="#FF0000"/>
        <rect width="30" height="30" x="690" y="120" fill="#FF0000"/>
        <rect width="30" height="30" x="180" y="450" fill="#FF0000"/>
        <rect width="30" height="30" x="690" y="450" fill="#FF0000"/>
      </svg>
    ),
    default: ( // Default/Unknown flag
      <svg viewBox="0 0 900 600" className={className}>
        <rect width="900" height="600" fill="#4B5563"/>
        <text x="450" y="320" textAnchor="middle" fill="#9CA3AF" fontSize="200">?</text>
      </svg>
    ),
  };

  return flagSvgs[code] || flagSvgs.default;
}