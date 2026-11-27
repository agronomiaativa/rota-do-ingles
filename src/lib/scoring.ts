import type { Nivel, NivelRegua, PerguntaTeste, QuizConfig } from '../config/tipos'

/** null = "Não sei" (ou sem resposta). Conta como erro. */
export type Resposta = string | null

export interface Resultado {
  acertos: number
  total: number
  nivel: Nivel
  nomeNivel: string
  proximoNivel: NivelRegua
  fortes: string[]
  lacunas: string[]
  dataFim: string
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

/** "23 de dezembro" */
export function formatarDataFim(hoje: Date, dias: number): string {
  const fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + dias)
  return `${fim.getDate()} de ${MESES[fim.getMonth()]}`
}

export function corrigir(perguntas: PerguntaTeste[], respostas: Resposta[]): boolean[] {
  return perguntas.map((p, i) => respostas[i] === p.correta)
}

/** Nível pela quantidade de acertos, com a trava: errou todas as de A1 (Q1 e Q2), é A1. */
export function definirNivel(
  perguntas: PerguntaTeste[],
  gabarito: boolean[],
  niveis: QuizConfig['niveis'],
): Nivel {
  const basicas = gabarito.filter((_, i) => perguntas[i].nivel === 'A1')
  if (basicas.length > 0 && basicas.every((certo) => !certo)) return 'A1'

  const acertos = gabarito.filter(Boolean).length
  const doMaiorParaOMenor = (Object.keys(niveis) as Nivel[]).sort(
    (a, b) => niveis[b].minAcertos - niveis[a].minAcertos,
  )
  return doMaiorParaOMenor.find((n) => acertos >= niveis[n].minAcertos) ?? 'A1'
}

/** Função pura: mesmas respostas e mesma data, mesmo resultado. */
export function calcularResultado(
  perguntas: PerguntaTeste[],
  respostas: Resposta[],
  niveis: QuizConfig['niveis'],
  opcoes: QuizConfig['resultado'],
  hoje: Date,
): Resultado {
  const gabarito = corrigir(perguntas, respostas)
  const nivel = definirNivel(perguntas, gabarito, niveis)
  const temas = perguntas.map((p) => p.tema)

  const fortes = temas.filter((_, i) => gabarito[i]).reverse().slice(0, opcoes.maxFortes)
  const lacunas = temas.filter((_, i) => !gabarito[i]).slice(0, opcoes.maxLacunas)

  return {
    acertos: gabarito.filter(Boolean).length,
    total: perguntas.length,
    nivel,
    nomeNivel: niveis[nivel].nome,
    proximoNivel: niveis[nivel].proximo,
    fortes,
    lacunas: lacunas.length > 0 ? lacunas : [opcoes.semLacunas],
    dataFim: formatarDataFim(hoje, opcoes.diasDoPlano),
  }
}
