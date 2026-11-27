import { describe, expect, it, vi } from 'vitest'
import { config } from '../config/quiz.config'
import { montarUrlCheckout, parametrosDeOrigem } from './checkout'
import { embaralhar } from './embaralhar'
import { formatarPreco, interpolar, validarNome } from './texto'
import { resolverVariante } from './variante'

describe('textos', () => {
  it('troca as variáveis e mantém as desconhecidas', () => {
    expect(interpolar('{nome}, {nivel} → {x}', { nome: 'Ana', nivel: 'A2' })).toBe('Ana, A2\u00A0→\u00A0{x}')
  })
  it('formata preços', () => {
    expect(formatarPreco(37)).toBe('R$ 37')
    expect(formatarPreco(9.9)).toBe('R$ 9,90')
    expect(formatarPreco(1997)).toBe('R$ 1.997')
  })
})

describe('validarNome', () => {
  it.each([
    ['ana', 'Ana'],
    ['  João  ', 'João'],
    ['MARIA SILVA', 'Maria'],
    ['Zé', 'Zé'],
    ["d'ávila", "D'Ávila"],
    ['jean-luc', 'Jean-Luc'],
    ['a'.repeat(30), 'A' + 'a'.repeat(29)],
  ])('aceita %j', (entrada, nome) => expect(validarNome(entrada)).toEqual({ nome }))

  it.each([
    ['', 'curto'],
    ['   ', 'curto'],
    ['A', 'curto'],
    ['a'.repeat(31), 'longo'],
    ['Ana123', 'invalido'],
    ['ana@email.com', 'invalido'],
    ['😀😀', 'invalido'],
  ])('recusa %j', (entrada, erro) => expect(validarNome(entrada)).toEqual({ erro }))
})

describe('checkout', () => {
  const busca = '?utm_source=meta&utm_custom=x&fbclid=abc&src=s1&sck=k1&v=b&email=a@b.c&utm_term='
  it('repassa utm_*, fbclid, src e sck, e nada além disso', () => {
    expect(parametrosDeOrigem(busca)).toEqual([
      ['utm_source', 'meta'], ['utm_custom', 'x'], ['fbclid', 'abc'], ['src', 's1'], ['sck', 'k1'],
    ])
  })
  it('monta a URL preservando o que o link já tinha', () => {
    expect(montarUrlCheckout('https://pay.exemplo.com/x?off=1', [['utm_source', 'meta']], 'João')).toBe(
      'https://pay.exemplo.com/x?off=1&utm_source=meta&name=Jo%C3%A3o',
    )
  })
  it('não envia o nome quando desligado', () => {
    expect(montarUrlCheckout('https://pay.exemplo.com/x', [])).toBe('https://pay.exemplo.com/x')
  })
  it.each([undefined, '', 'não é link', 'javascript:alert(1)', 'https://pay.kiwify.com.br/SEU-LINK-A1'])(
    'devolve null para link não configurado: %j',
    (base) => expect(montarUrlCheckout(base, [])).toBeNull(),
  )
})

describe('variante A/B', () => {
  const resolver = (busca: string, sortear: boolean, salva: string | null, sorte = 0.9) => {
    const gravar = vi.fn()
    return { v: resolverVariante({ busca, sortear, ler: () => salva, gravar, aleatorio: () => sorte }), gravar }
  }
  it('a URL vence o sorteio salvo', () => expect(resolver('?v=b', true, 'a').v).toBe('b'))
  it('sem URL e sem sorteio, é A', () => expect(resolver('', false, 'b').v).toBe('a'))
  it('usa a variante já sorteada', () => expect(resolver('', true, 'a').v).toBe('a'))
  it('sorteia e grava', () => {
    const { v, gravar } = resolver('', true, null, 0.9)
    expect(v).toBe('b')
    expect(gravar).toHaveBeenCalledWith('b')
    expect(resolver('', true, null, 0.1).v).toBe('a')
  })
  it('ignora valor inválido na URL', () => expect(resolver('?v=z', false, null).v).toBe('a'))
})

describe('embaralhar', () => {
  it('mantém os mesmos itens e não altera a original', () => {
    const lista = ['a', 'b', 'c', 'd']
    expect([...embaralhar(lista)].sort()).toEqual(lista)
    expect(lista).toEqual(['a', 'b', 'c', 'd'])
  })
})

describe('quiz.config.ts', () => {
  it('tem 8 perguntas com 4 opções diferentes', () => {
    expect(config.perguntas).toHaveLength(8)
    for (const p of config.perguntas) expect(new Set([p.correta, ...p.erradas]).size).toBe(4)
  })
  it('só usa variáveis que existem', () => {
    const conhecidas = new Set([
      'nome', 'objetivo', 'trava', 'tempo', 'nivel', 'nome_nivel', 'proximo_nivel', 'acertos',
      'data_fim', 'fortes', 'lacunas', 'atual', 'total', 'numero', 'ano',
      'lacuna_arquivo', 'primeira_lacuna', 'rotulo', 'legenda',
    ])
    const usadas = [...JSON.stringify(config).matchAll(/\{(\w+)\}/g)].map((m) => m[1])
    expect(usadas.filter((v) => !conhecidas.has(v))).toEqual([])
  })
})
