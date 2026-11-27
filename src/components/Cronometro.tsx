import { useEffect, useState } from 'react'
import { config } from '../config/quiz.config'
import { gravar, ler } from '../lib/armazenamento'
import { BarraProgresso } from './Cabecalho'

const CHAVE = 'rota:fim-cronometro'
const { segundos, texto, textoFim } = config.oferta.cronometro

/** O prazo é da sessão: recarregar a página não reinicia o relógio. */
function obterFim(): number {
  const salvo = Number(ler('sessionStorage', CHAVE))
  if (salvo > 0) return salvo
  const fim = Date.now() + segundos * 1000
  gravar('sessionStorage', CHAVE, String(fim))
  return fim
}

export function Cronometro({ tela, total }: { tela: number; total: number }) {
  const [fim] = useState(obterFim)
  const [agora, setAgora] = useState(Date.now)
  const restante = Math.max(0, Math.ceil((fim - agora) / 1000))

  useEffect(() => {
    if (restante === 0) return
    const id = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(id)
  }, [restante === 0])

  const relogio = `${String(Math.floor(restante / 60)).padStart(2, '0')}:${String(restante % 60).padStart(2, '0')}`

  return (
    <div className="sticky top-0 z-30">
      <div className="bg-tinta px-2 py-2.5 text-center text-[13px] font-medium min-[390px]:text-sm leading-snug text-white">
        {restante > 0 ? (
          <p>
            {texto}{' '}
            <span role="timer" aria-live="off" className="font-bold tabular-nums">
              {relogio}
            </span>
          </p>
        ) : (
          <p>{textoFim}</p>
        )}
      </div>
      <BarraProgresso tela={tela} total={total} classe="!h-1" />
    </div>
  )
}
