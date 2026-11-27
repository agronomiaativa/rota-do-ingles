import { describe, expect, it } from 'vitest'
import { config } from '../config/quiz.config'
import { calcularResultado, formatarDataFim, type Resposta } from './scoring'

const { perguntas, niveis, resultado } = config
const HOJE = new Date(2026, 10, 23) // 23 de novembro de 2026

/** Acerta só as perguntas informadas (1 a 8); nas outras responde "Não sei". */
function acertando(...numeros: number[]): Resposta[] {
  return perguntas.map((p, i) => (numeros.includes(i + 1) ? p.correta : null))
}
const calcular = (respostas: Resposta[]) =>
  calcularResultado(perguntas, respostas, niveis, resultado, HOJE)

describe('faixas de nível', () => {
  it.each([
    [0, 'A1', 'Iniciante', 'A2'],
    [1, 'A1', 'Iniciante', 'A2'],
    [2, 'A1', 'Iniciante', 'A2'],
    [3, 'A2', 'Básico', 'B1'],
    [4, 'A2', 'Básico', 'B1'],
    [5, 'B1', 'Intermediário', 'B2'],
    [6, 'B1', 'Intermediário', 'B2'],
    [7, 'B2', 'Intermediário avançado', 'C1'],
    [8, 'B2', 'Intermediário avançado', 'C1'],
  ])('%i acertos → %s %s, próximo %s', (n, nivel, nomeNivel, proximoNivel) => {
    const r = calcular(acertando(...Array.from({ length: n }, (_, i) => i + 1)))
    expect(r).toMatchObject({ acertos: n, total: 8, nivel, nomeNivel, proximoNivel })
  })

  it('o nível depende do total, não de quais perguntas foram acertadas', () => {
    expect(calcular(acertando(1, 7, 8)).nivel).toBe('A2')
  })
})

describe('limites entre níveis', () => {
  it('2/3: A1 → A2', () => {
    expect(calcular(acertando(1, 2)).nivel).toBe('A1')
    expect(calcular(acertando(1, 2, 3)).nivel).toBe('A2')
  })
  it('4/5: A2 → B1', () => {
    expect(calcular(acertando(1, 2, 3, 4)).nivel).toBe('A2')
    expect(calcular(acertando(1, 2, 3, 4, 5)).nivel).toBe('B1')
  })
  it('6/7: B1 → B2', () => {
    expect(calcular(acertando(1, 2, 3, 4, 5, 6)).nivel).toBe('B1')
    expect(calcular(acertando(1, 2, 3, 4, 5, 6, 7)).nivel).toBe('B2')
  })
})

describe('trava do A1', () => {
  it('errar Q1 e Q2 é A1 mesmo com 6 acertos', () => {
    expect(calcular(acertando(3, 4, 5, 6, 7, 8))).toMatchObject({ acertos: 6, nivel: 'A1', proximoNivel: 'A2' })
  })
  it('errar Q1 e Q2 com 3 acertos também é A1', () => {
    expect(calcular(acertando(3, 5, 8)).nivel).toBe('A1')
  })
  it('acertar só a Q1 ou só a Q2 já destrava', () => {
    expect(calcular(acertando(1, 3, 4, 5, 6, 7, 8)).nivel).toBe('B2')
    expect(calcular(acertando(2, 3, 4, 5, 6, 7, 8)).nivel).toBe('B2')
  })
  it('vale tanto para "Não sei" quanto para resposta errada', () => {
    const respostas = acertando(3, 4, 5, 6, 7, 8)
    respostas[0] = perguntas[0].erradas[0]
    expect(calcular(respostas).nivel).toBe('A1')
  })
})

describe('correção', () => {
  it('"Não sei" conta como erro', () => {
    expect(calcular(perguntas.map(() => null)).acertos).toBe(0)
  })
  it('resposta errada conta como erro', () => {
    expect(calcular(perguntas.map((p) => p.erradas[0])).acertos).toBe(0)
  })
  it('é uma função pura: não altera as respostas e repete o resultado', () => {
    const respostas = acertando(1, 4, 6)
    const copia = [...respostas]
    expect(calcular(respostas)).toEqual(calcular(respostas))
    expect(respostas).toEqual(copia)
  })
})

describe('pontos fortes e lacunas', () => {
  it('até 2 pontos fortes, dos mais avançados', () => {
    expect(calcular(acertando(1, 2, 3, 6)).fortes).toEqual(['Phrasal verbs', 'Passado simples'])
  })
  it('até 3 lacunas, das mais básicas', () => {
    expect(calcular(acertando(1, 3)).lacunas).toEqual([
      'Vocabulário do dia a dia',
      'There is / there are e quantidades',
      "Frases com 'if' (condicionais)",
    ])
  })
  it('sem acertos, não há pontos fortes', () => {
    expect(calcular(acertando()).fortes).toEqual([])
  })
  it('sem erros, usa a lacuna padrão', () => {
    expect(calcular(acertando(1, 2, 3, 4, 5, 6, 7, 8)).lacunas).toEqual([
      'Fluidez na fala e expressões naturais',
    ])
  })
})

describe('data de conclusão', () => {
  it('hoje + 30 dias, no formato "23 de dezembro"', () => {
    expect(calcular(acertando(1)).dataFim).toBe('23 de dezembro')
  })
  it('vira o ano e respeita fevereiro', () => {
    expect(formatarDataFim(new Date(2026, 11, 15), 30)).toBe('14 de janeiro')
    expect(formatarDataFim(new Date(2027, 0, 30), 30)).toBe('1 de março')
  })
})
