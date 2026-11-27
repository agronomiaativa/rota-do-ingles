import { config } from '../config/quiz.config'
import type { Nivel, NivelRegua } from '../config/tipos'
import { interpolar } from '../lib/texto'

const NIVEIS: NivelRegua[] = ['A1', 'A2', 'B1', 'B2', 'C1']
const x = (i: number) => 34 + i * 68
const Y = 58

/** A "rota" do A1 ao C1. Sem nível, é só a ilustração da capa. */
export function Regua({ nivel, proximo }: { nivel?: Nivel; proximo?: NivelRegua }) {
  const atual = nivel ? NIVEIS.indexOf(nivel) : -1
  const alvo = proximo ? NIVEIS.indexOf(proximo) : -1
  const descricao = nivel && proximo
    ? interpolar(config.interface.descricaoRegua, { nivel, proximo_nivel: proximo })
    : undefined

  return (
    <svg
      viewBox="0 0 340 108"
      className="w-full"
      {...(descricao ? { role: 'img', 'aria-label': descricao } : { 'aria-hidden': true })}
    >
      <line x1={x(0)} x2={x(4)} y1={Y} y2={Y} className="stroke-linha" strokeWidth="4" strokeDasharray="1 9" strokeLinecap="round" />
      {atual > 0 && <line x1={x(0)} x2={x(atual)} y1={Y} y2={Y} className="stroke-marca-600" strokeWidth="4" />}

      {alvo > 0 && (
        <g className="fill-none stroke-marca-600" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${x(atual) + 8} ${Y - 30} Q${(x(atual) + x(alvo)) / 2} ${Y - 60} ${x(alvo) - 3} ${Y - 25}`} />
          <path d={`M${x(alvo) - 13} ${Y - 29} l10 4 l1 -11`} />
        </g>
      )}

      {NIVEIS.map((n, i) => {
        const ehAtual = i === atual
        const ehAlvo = i === alvo
        const feito = i < atual
        return (
          <g key={n}>
            <circle
              cx={x(i)}
              cy={Y}
              r={ehAtual ? 24 : 18}
              className={
                ehAtual
                  ? 'fill-marca-600 stroke-marca-200'
                  : feito
                    ? 'fill-marca-100 stroke-marca-600'
                    : ehAlvo
                      ? 'fill-white stroke-marca-600'
                      : 'fill-white stroke-linha'
              }
              strokeWidth={ehAtual ? 5 : 2.5}
            />
            <text
              x={x(i)}
              y={Y}
              dy="0.35em"
              textAnchor="middle"
              fontSize={ehAtual ? 17 : 14}
              className={`font-bold ${ehAtual ? 'fill-white' : ehAlvo || feito ? 'fill-marca-700' : 'fill-suave'}`}
            >
              {n}
            </text>
            {(ehAtual || ehAlvo) && (
              <text x={x(i)} y={102} textAnchor="middle" fontSize="13" className={`font-bold ${ehAtual ? 'fill-marca-700' : 'fill-suave'}`}>
                {ehAtual ? config.interface.voceEsta : config.interface.proximo}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
