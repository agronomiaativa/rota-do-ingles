import { config } from '../config/quiz.config'

interface Props {
  tela: number
  total: number
  aoVoltar?: () => void
}

export function Cabecalho({ tela, total, aoVoltar }: Props) {
  return (
    <header className="px-5 pt-3">
      <BarraProgresso tela={tela} total={total} />
      <div className="flex h-12 items-center">
        {aoVoltar ? (
          <button
            type="button"
            onClick={aoVoltar}
            className="-ml-2 flex min-h-[48px] items-center gap-1 rounded-lg px-2 text-[15px] text-suave hover:text-tinta"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
              <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {config.interface.voltar}
          </button>
        ) : (
          <p className="text-[15px] font-bold text-suave">{config.marca.nome}</p>
        )}
      </div>
    </header>
  )
}

export function BarraProgresso({ tela, total, classe = 'rounded-full' }: { tela: number; total: number; classe?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={config.interface.progresso}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={tela}
      className={`h-2 overflow-hidden bg-marca-100 ${classe}`}
    >
      <div
        className="h-full origin-left rounded-full bg-marca-600 transition-transform duration-500 ease-out"
        style={{ transform: `scaleX(${tela / total})` }}
      />
    </div>
  )
}
