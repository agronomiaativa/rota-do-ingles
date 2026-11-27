/** Marca de "certo" em SVG: o caractere ✔ vira emoji colorido em alguns Androids. */
export function Check({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={className}>
      <path d="m2 6.5 2.7 2.7L10 3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
