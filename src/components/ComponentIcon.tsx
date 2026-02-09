interface ComponentIconProps {
  type: 'motherboard' | 'cpu' | 'ram' | 'gpu' | 'psu' | 'storage' | 'case';
  size?: number;
  color?: string;
}

export function ComponentIcon({ type, size = 48, color = 'currentColor' }: ComponentIconProps) {
  const icons = {
    motherboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 7h4v4H7z" fill={color} opacity="0.3" />
        <path d="M13 7h4v2h-4zM13 11h4v2h-4z" />
        <circle cx="9" cy="15" r="1.5" fill={color} />
        <circle cx="15" cy="15" r="1.5" fill={color} />
        <path d="M7 18h10M7 20h10" strokeWidth="1" />
      </svg>
    ),
    cpu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="7" y="7" width="10" height="10" rx="1" fill={color} opacity="0.2" />
        <rect x="8" y="8" width="8" height="8" rx="0.5" />
        <path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4" strokeWidth="1" />
        <path d="M10 10h4M10 12h4M10 14h4" strokeWidth="0.5" />
      </svg>
    ),
    ram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="4" y="6" width="16" height="12" rx="1" />
        <path d="M4 14h16" />
        <rect x="7" y="9" width="2" height="3" fill={color} opacity="0.5" />
        <rect x="11" y="9" width="2" height="3" fill={color} opacity="0.5" />
        <rect x="15" y="9" width="2" height="3" fill={color} opacity="0.5" />
        <path d="M8 4v2M12 4v2M16 4v2" strokeWidth="1" />
      </svg>
    ),
    gpu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="2" y="8" width="20" height="10" rx="1" />
        <rect x="4" y="10" width="7" height="6" fill={color} opacity="0.2" />
        <rect x="13" y="10" width="7" height="6" fill={color} opacity="0.2" />
        <circle cx="7.5" cy="13" r="2" strokeWidth="1" />
        <circle cx="16.5" cy="13" r="2" strokeWidth="1" />
        <path d="M2 15h2M2 12h2M20 15h2M20 12h2" strokeWidth="1" />
        <path d="M6 18v2M12 18v2M18 18v2" strokeWidth="1" />
      </svg>
    ),
    psu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="4" y="4" width="16" height="16" rx="1" />
        <circle cx="12" cy="12" r="5" strokeWidth="1" />
        <circle cx="12" cy="12" r="2" fill={color} opacity="0.5" />
        <path d="M12 7v2M12 15v2M7 12h2M15 12h2" strokeWidth="1" />
        <path d="M4 18h2M18 18h2" strokeWidth="1" />
        <rect x="16" y="4" width="2" height="4" fill={color} opacity="0.3" />
      </svg>
    ),
    storage: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="M3 10h18M3 14h18" strokeWidth="1" />
        <circle cx="6" cy="7.5" r="0.5" fill={color} />
        <circle cx="6" cy="12" r="0.5" fill={color} />
        <circle cx="6" cy="16.5" r="0.5" fill={color} />
        <path d="M9 7h9M9 12h9M9 16h9" strokeWidth="0.5" opacity="0.5" />
      </svg>
    ),
    case: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="6" y="2" width="12" height="20" rx="1" />
        <circle cx="12" cy="6" r="1.5" fill={color} opacity="0.3" />
        <circle cx="12" cy="10" r="1.5" fill={color} opacity="0.3" />
        <rect x="8" y="14" width="8" height="6" fill={color} opacity="0.1" />
        <path d="M10 16h4M10 18h4" strokeWidth="0.5" />
        <circle cx="9" cy="20" r="0.5" fill={color} />
        <circle cx="15" cy="20" r="0.5" fill={color} />
      </svg>
    ),
  };

  return <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    {icons[type]}
  </div>;
}

