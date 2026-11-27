import { useEffect } from 'react'
import { config } from '../config/quiz.config'

export function Incentivo({ aoTerminar }: { aoTerminar: () => void }) {
  useEffect(() => {
    const id = setTimeout(aoTerminar, config.incentivo.duracaoMs)
    return () => clearTimeout(id)
  }, [aoTerminar])

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 pb-32 text-center">
      <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-marca-600">
        <svg viewBox="0 0 24 24" className="h-8 w-8">
          <path d="m5 13 4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h1 tabIndex={-1} className="mt-6 text-[26px] font-extrabold leading-tight tracking-tight">
        {config.incentivo.texto}
      </h1>
    </div>
  )
}
