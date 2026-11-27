import { useEffect, useState } from 'react'
import { Check } from '../components/Check'
import { config } from '../config/quiz.config'

const { titulo, duracaoMs, itens } = config.calculo

export function Calculo({ aoTerminar }: { aoTerminar: () => void }) {
  const [feitos, setFeitos] = useState(0)

  useEffect(() => {
    const cadaItem = duracaoMs / itens.length
    const ids = itens.map((_, i) => window.setTimeout(() => setFeitos(i + 1), cadaItem * (i + 1) - 200))
    ids.push(window.setTimeout(aoTerminar, duracaoMs))
    return () => ids.forEach(clearTimeout)
  }, [aoTerminar])

  return (
    <div className="flex flex-1 flex-col justify-center px-5 pb-24">
      <h1 tabIndex={-1} className="text-[28px] font-extrabold leading-tight tracking-tight">{titulo}</h1>
      <div
        role="progressbar"
        aria-label={titulo}
        aria-valuemin={0}
        aria-valuemax={itens.length}
        aria-valuenow={feitos}
        className="mt-6 h-3 overflow-hidden rounded-full bg-marca-100"
      >
        <div
          className="h-full origin-left rounded-full bg-marca-600"
          style={{ animation: `encher ${duracaoMs}ms linear both` }}
        />
      </div>
      <ul className="mt-7 space-y-4">
        {itens.map((item, i) => {
          const feito = i < feitos
          return (
            <li key={item} className={`flex items-center gap-3 text-[17px] transition-colors duration-300 ${feito ? 'font-semibold' : 'text-suave'}`}>
              <span
                aria-hidden="true"
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  feito ? 'border-marca-600 bg-marca-600' : 'border-linha bg-white'
                }`}
              >
                {feito && <Check className="h-3.5 w-3.5 text-white" />}
              </span>
              {item}
            </li>
          )
        })}
      </ul>
      <p role="status" className="sr-only">{feitos > 0 && itens[feitos - 1]}</p>
    </div>
  )
}
