import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BannerCookies } from './components/BannerCookies'
import { Cabecalho } from './components/Cabecalho'
import { config } from './config/quiz.config'
import type { PerguntaPerfil } from './config/tipos'
import { embaralhar } from './lib/embaralhar'
import { calcularResultado, type Resposta } from './lib/scoring'
import {
  definirConsentimento,
  iniciarRastreamento,
  rastrearUmaVez,
  type Consentimento,
} from './lib/tracking'
import { Calculo } from './screens/Calculo'
import { Capa } from './screens/Capa'
import { Incentivo } from './screens/Incentivo'
import { Nome } from './screens/Nome'
import { Perfil } from './screens/Perfil'
import { Pergunta } from './screens/Pergunta'
import { Resultado } from './screens/Resultado'
import { Transicao } from './screens/Transicao'

type Passo =
  | { tipo: 'capa' | 'transicao' | 'incentivo' | 'nome' | 'calculo' | 'resultado' }
  | { tipo: 'perfil' | 'pergunta'; indice: number }

const PASSOS: Passo[] = [
  { tipo: 'capa' },
  ...config.perfil.map((_, indice): Passo => ({ tipo: 'perfil', indice })),
  { tipo: 'transicao' },
  ...config.perguntas.flatMap((_, indice): Passo[] =>
    indice + 1 === config.incentivo.depoisDaPergunta
      ? [{ tipo: 'pergunta', indice }, { tipo: 'incentivo' }]
      : [{ tipo: 'pergunta', indice }],
  ),
  { tipo: 'nome' },
  { tipo: 'calculo' },
  { tipo: 'resultado' },
]
// O aviso "Você está indo bem!" não conta como tela.
const TOTAL_TELAS = PASSOS.filter((p) => p.tipo !== 'incentivo').length
const numeroDaTela = (i: number) => PASSOS.slice(0, i + 1).filter((p) => p.tipo !== 'incentivo').length

export type RespostasPerfil = Partial<Record<PerguntaPerfil['id'], string>>

export function App() {
  const [{ indice, animacao }, setPosicao] = useState({ indice: 0, animacao: '' })
  const [perfil, setPerfil] = useState<RespostasPerfil>({})
  const [respostas, setRespostas] = useState<Resposta[]>(() => config.perguntas.map(() => null))
  const [respondidas, setRespondidas] = useState<boolean[]>(() => config.perguntas.map(() => false))
  const [nome, setNome] = useState('')
  const [consentimento, setConsentimento] = useState<Consentimento>(iniciarRastreamento)
  const conteudo = useRef<HTMLElement>(null)

  // Embaralha uma vez por visita: a ordem não muda quando a pessoa volta.
  const opcoes = useMemo(() => config.perguntas.map((p) => embaralhar([p.correta, ...p.erradas])), [])

  const passo = PASSOS[indice]
  const resultado = useMemo(
    () => calcularResultado(config.perguntas, respostas, config.niveis, config.resultado, new Date()),
    [respostas],
  )

  const avancar = useCallback(
    () => setPosicao((p) => ({ indice: Math.min(p.indice + 1, PASSOS.length - 1), animacao: 'tela' })),
    [],
  )
  const voltar = useCallback(
    () =>
      setPosicao((p) => {
        let i = p.indice - 1
        while (i > 0 && PASSOS[i].tipo === 'incentivo') i--
        return { indice: Math.max(i, 0), animacao: 'tela-volta' }
      }),
    [],
  )

  useEffect(() => {
    rastrearUmaVez('PageView')
  }, [])

  // A cada tela: volta ao topo e leva o leitor de tela até o título.
  useEffect(() => {
    if (indice === 0) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    conteudo.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [indice])

  function escolherPerfil(i: number, valor: string) {
    setPerfil((atual) => ({ ...atual, [config.perfil[i].id]: valor }))
    if (i === config.perfil.length - 1) rastrearUmaVez('QuizProfileDone')
    avancar()
  }

  function responder(i: number, resposta: Resposta) {
    const novas = respostas.map((r, j) => (j === i ? resposta : r))
    setRespostas(novas)
    setRespondidas((atual) => atual.map((r, j) => (j === i ? true : r)))
    if (i === config.perguntas.length - 1) {
      const r = calcularResultado(config.perguntas, novas, config.niveis, config.resultado, new Date())
      rastrearUmaVez('QuizTestDone', { level: r.nivel, score: r.acertos })
    }
    avancar()
  }

  function decidirCookies(escolha: 'aceito' | 'recusado') {
    definirConsentimento(escolha)
    setConsentimento(escolha)
  }

  function tela() {
    switch (passo.tipo) {
      case 'capa':
        return (
          <Capa
            aoComecar={() => {
              rastrearUmaVez('QuizStart')
              avancar()
            }}
          />
        )
      case 'perfil': {
        const pergunta = config.perfil[passo.indice]
        return (
          <Perfil
            pergunta={pergunta}
            escolhida={perfil[pergunta.id]}
            aoEscolher={(valor) => escolherPerfil(passo.indice, valor)}
          />
        )
      }
      case 'transicao':
        return <Transicao aoAvancar={avancar} />
      case 'pergunta':
        return (
          <Pergunta
            indice={passo.indice}
            opcoes={opcoes[passo.indice]}
            escolhida={respondidas[passo.indice] ? respostas[passo.indice] : undefined}
            aoResponder={(r) => responder(passo.indice, r)}
          />
        )
      case 'incentivo':
        return <Incentivo aoTerminar={avancar} />
      case 'nome':
        return (
          <Nome
            inicial={nome}
            aoEnviar={(n) => {
              setNome(n)
              avancar()
            }}
          />
        )
      case 'calculo':
        return <Calculo aoTerminar={avancar} />
      case 'resultado':
        return (
          <Resultado
            nome={nome}
            perfil={perfil}
            resultado={resultado}
            aoAbrirCookies={() => setConsentimento('pendente')}
          />
        )
    }
  }

  const podeVoltar = ['perfil', 'transicao', 'pergunta', 'nome'].includes(passo.tipo)
  const bannerAberto = config.CONSENT_BANNER && consentimento === 'pendente'

  return (
    <div className={`mx-auto flex min-h-[100svh] w-full max-w-coluna flex-col ${bannerAberto ? 'pb-36' : ''}`}>
      {passo.tipo !== 'resultado' && (
        <Cabecalho
          tela={numeroDaTela(indice)}
          total={TOTAL_TELAS}
          aoVoltar={podeVoltar ? voltar : undefined}
        />
      )}
      <main ref={conteudo} key={indice} className={`flex flex-1 flex-col ${animacao}`}>
        {tela()}
      </main>
      {bannerAberto && <BannerCookies aoDecidir={decidirCookies} />}
    </div>
  )
}
