// Inline SVG logos for the supported card brands.
// Used in the card entry form to give live feedback while typing.

export default function CardBrandLogo({ brand, className = 'w-12 h-7' }) {
  if (!brand) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded text-[9px] text-gray-400 font-semibold`}>
        CARD
      </div>
    );
  }

  if (brand === 'visa') {
    return (
      <svg viewBox="0 0 48 28" className={className}>
        <rect width="48" height="28" rx="3" fill="#fff" stroke="#e5e7eb" />
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="13"
          fill="#1A1F71"
          letterSpacing="0.5"
        >
          VISA
        </text>
      </svg>
    );
  }

  if (brand === 'mastercard') {
    return (
      <svg viewBox="0 0 48 28" className={className}>
        <rect width="48" height="28" rx="3" fill="#fff" stroke="#e5e7eb" />
        <circle cx="20" cy="14" r="7" fill="#EB001B" />
        <circle cx="28" cy="14" r="7" fill="#F79E1B" />
        <path
          d="M24 8.7a7 7 0 0 1 0 10.6 7 7 0 0 1 0-10.6z"
          fill="#FF5F00"
        />
      </svg>
    );
  }

  if (brand === 'amex') {
    return (
      <svg viewBox="0 0 48 28" className={className}>
        <rect width="48" height="28" rx="3" fill="#2E77BB" />
        <text
          x="24"
          y="17"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="9"
          fill="#fff"
          letterSpacing="0.5"
        >
          AMEX
        </text>
      </svg>
    );
  }

  if (brand === 'discover') {
    return (
      <svg viewBox="0 0 48 28" className={className}>
        <rect width="48" height="28" rx="3" fill="#fff" stroke="#e5e7eb" />
        <text
          x="22"
          y="18"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fontSize="7.5"
          fill="#000"
        >
          DISCOVER
        </text>
        <circle cx="40" cy="14" r="4" fill="#FF6000" />
      </svg>
    );
  }

  if (brand === 'jcb') {
    return (
      <svg viewBox="0 0 48 28" className={className}>
        <rect width="48" height="28" rx="3" fill="#fff" stroke="#e5e7eb" />
        <text
          x="24"
          y="18"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="11"
          fill="#0E4C96"
        >
          JCB
        </text>
      </svg>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center bg-gray-100 rounded text-[9px] text-gray-500 font-semibold uppercase`}>
      {brand}
    </div>
  );
}
