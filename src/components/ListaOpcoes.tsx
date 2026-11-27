import { useEffect, useRef, useState } from 'react'
import { Check } from './Check'

interface Opcao {
  chave: string
  texto: string
  idioma?: string
  discreta?: boolean
}

interface Props {
  opcoes: Opcao[]
  escolhida?: string
  rotuladoPor: string
  aoEscolher: (chave: string) => void
}

/** Cartões de escolha única: tocar marca, espera um instante para a pessoa ver, e avança. */
export function ListaOpcoes({ opcoes, escolhida, rotuladoPor, aoEscolher }: Props) {
  const [marcada, setMarcada] = useState(escolhida)
  const travado = useRef(false)
  const espera = useRef<number>(undefined)
  useEffect(() => () => clearTimeout(espera.current), [])

  function tocar(chave: string) {
    if (travado.current) return
    travado.current = true
    setMarcada(chave)
    espera.current = window.setTimeout(() => aoEscolher(chave), 220)
  }

  return (
    <div role="group" aria-labelledby={rotuladoPor} className="mt-6 space-y-3">
      {opcoes.map(({ chave, texto, idioma, discreta }) => {
        const ativa = marcada === chave
        return (
          <button
            key={chave}
            type="button"
            lang={idioma}
            aria-pressed={ativa}
            onClick={() => tocar(chave)}
            className={`flex min-h-[58px] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-[17px] font-medium leading-snug transition-colors duration-150 active:scale-[0.99] ${
              ativa
                ? 'border-marca-600 bg-marca-50 text-marca-800'
                : discreta
                  ? 'border-transparent bg-transparent text-suave hover:bg-white'
                  : 'border-linha bg-white text-tinta hover:border-marca-600'
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                ativa ? 'border-marca-600 bg-marca-600' : 'border-linha bg-white'
              }`}
            >
              {ativa && <Check className="h-3 w-3 text-white" />}
            </span>
            {texto}
          </button>
        )
      })}
    </div>
  )
}
