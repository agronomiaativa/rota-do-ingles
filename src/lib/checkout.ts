const EXTRAS = new Set(['fbclid', 'src', 'sck'])

/** Parâmetros da URL de entrada que seguem para o checkout: todos os utm_*, fbclid, src e sck. */
export function parametrosDeOrigem(busca: string): [string, string][] {
  return [...new URLSearchParams(busca)].filter(([chave, valor]) => {
    const k = chave.toLowerCase()
    return valor !== '' && (k.startsWith('utm_') || EXTRAS.has(k))
  })
}

/** Devolve null se o link não foi configurado (vazio, inválido ou ainda com o placeholder). */
export function montarUrlCheckout(
  base: string | undefined,
  origem: [string, string][],
  nome?: string,
): string | null {
  if (!base || base.includes('SEU-LINK')) return null
  let url: URL
  try {
    url = new URL(base.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  for (const [chave, valor] of origem) url.searchParams.set(chave, valor)
  if (nome) url.searchParams.set('name', nome)
  return url.toString()
}
