export type Variaveis = Record<string, string | number>

/** Troca {variavel} pelo valor. Variável desconhecida fica como está, para o erro ficar visível. */
export function interpolar(texto: string, vars: Variaveis): string {
  return (
    texto
      .replace(/\{(\w+)\}/g, (original, chave: string) =>
        Object.prototype.hasOwnProperty.call(vars, chave) ? String(vars[chave]) : original,
      )
      // "A2 → B1" não pode quebrar no meio.
      .replace(/ → /g, '\u00A0→\u00A0')
  )
}

/** 37 → "R$ 37" · 9.9 → "R$ 9,90" (com espaço que não quebra linha) */
export function formatarPreco(valor: number): string {
  const numero = Number.isInteger(valor) ? String(valor) : valor.toFixed(2).replace('.', ',')
  return `R$ ${numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

export type ErroNome = 'curto' | 'longo' | 'invalido'

/** Aceita só o primeiro nome, de 2 a 30 letras (com acento, hífen ou apóstrofo no meio). */
export function validarNome(digitado: string): { nome: string } | { erro: ErroNome } {
  const primeiro = digitado.trim().split(/\s+/)[0] ?? ''
  const letras = primeiro.replace(/['’-]/g, '')
  if (letras.length < 2 && /^\p{L}*$/u.test(letras)) return { erro: 'curto' }
  if (!/^\p{L}+(?:['’-]\p{L}+)*$/u.test(primeiro)) return { erro: 'invalido' }
  if (letras.length > 30) return { erro: 'longo' }

  const todoMaiusculo = primeiro === primeiro.toLocaleUpperCase('pt-BR')
  const base = todoMaiusculo ? primeiro.toLocaleLowerCase('pt-BR') : primeiro
  const nome = base
    .split(/(['’-])/)
    .map((parte) => parte.charAt(0).toLocaleUpperCase('pt-BR') + parte.slice(1))
    .join('')
  return { nome }
}
