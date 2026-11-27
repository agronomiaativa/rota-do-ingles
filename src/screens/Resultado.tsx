import { useEffect, useMemo } from 'react'
import type { RespostasPerfil } from '../App'
import { Cronometro } from '../components/Cronometro'
import { Regua } from '../components/Regua'
import { Rodape } from '../components/Rodape'
import { config } from '../config/quiz.config'
import { interpolar, type Variaveis } from '../lib/texto'
import type { Resultado as DadosResultado } from '../lib/scoring'
import { rastrearUmaVez } from '../lib/tracking'
import { Oferta } from './Oferta'

interface Props {
  nome: string
  perfil: RespostasPerfil
  resultado: DadosResultado
  aoAbrirCookies: () => void
}

const c = config.resultado

/** Página do Guia das Lacunas: 1 a 8 pela ordem das perguntas; "nenhuma" quando acertou tudo. */
function arquivoDaLacuna(tema: string): string {
  const i = config.perguntas.findIndex((p) => p.tema === tema)
  return i >= 0 ? String(i + 1) : 'nenhuma'
}

export function Resultado({ nome, perfil, resultado: r, aoAbrirCookies }: Props) {
  const vars = useMemo<Variaveis>(
    () => ({
      nome,
      objetivo: perfil.objetivo ?? '',
      trava: perfil.trava ?? '',
      tempo: perfil.tempo ?? '',
      nivel: r.nivel,
      nome_nivel: r.nomeNivel,
      proximo_nivel: r.proximoNivel,
      acertos: r.acertos,
      data_fim: r.dataFim,
      fortes: r.fortes.join(c.separadorTemas) || c.semPontosFortes,
      lacunas: r.lacunas.join(c.separadorTemas),
      primeira_lacuna: r.lacunas[0],
      lacuna_arquivo: arquivoDaLacuna(r.lacunas[0]),
    }),
    [nome, perfil, r],
  )
  const t = (texto: string) => interpolar(texto, vars)

  useEffect(() => {
    rastrearUmaVez('QuizResultView', { level: r.nivel })
  }, [r.nivel])

  return (
    <>
      <Cronometro tela={1} total={1} />

      <section className="px-5 pt-7">
        <h1 tabIndex={-1} className="text-center">
          <span className="block text-lg font-semibold text-suave">{t(c.titulo)}</span>{' '}
          <span className="mt-1 block text-[34px] font-extrabold leading-[1.1] tracking-tight text-marca-700">
            {t(c.tituloNivel)}
          </span>
        </h1>
        <p className="mt-3 text-center text-suave">{t(c.acertos)}</p>

        <div className="cartao mt-5 !px-3 !pb-4 !pt-3">
          <Regua nivel={r.nivel} proximo={r.proximoNivel} />
        </div>

        <dl className="mt-5 space-y-3">
          <div className="cartao !p-4">
            <dt className="font-bold">{c.rotuloFortes}</dt>
            <dd className="mt-1 leading-relaxed">{vars.fortes}</dd>
          </div>
          <div className="cartao !p-4">
            <dt className="font-bold">{c.rotuloLacunas}</dt>
            <dd className="mt-1 leading-relaxed">{vars.lacunas}</dd>
          </div>
        </dl>

        <div className="mt-6 space-y-4 text-[17px] leading-relaxed">
          {config.niveis[r.nivel].diagnostico.map((paragrafo) => (
            <p key={paragrafo}>{t(paragrafo)}</p>
          ))}
        </div>

        <p className="mt-6 rounded-2xl bg-marca-100 px-5 py-4 text-[17px] font-bold leading-snug text-marca-800">
          {t(c.plano)}
        </p>
      </section>

      <section className="mt-10 px-5">
        <h2 className="titulo-secao">{c.tituloPlano}</h2>
        <ol className="relative mt-5 space-y-5 before:absolute before:bottom-3 before:left-[11px] before:top-3 before:w-0.5 before:bg-marca-200">
          {c.semanas.map((s) => (
            <li key={s.rotulo} className="relative pl-10">
              <span aria-hidden="true" className="absolute left-0 top-0.5 h-6 w-6 rounded-full border-[6px] border-marca-600 bg-white" />
              <strong className="block text-[15px] text-marca-700">{s.rotulo}</strong>
              <span className="leading-relaxed">{t(s.texto)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 font-semibold">{t(c.rodapePlano)}</p>
      </section>

      <Oferta nivel={r.nivel} nome={nome} vars={vars} />
      <Rodape aoAbrirCookies={aoAbrirCookies} />
    </>
  )
}
