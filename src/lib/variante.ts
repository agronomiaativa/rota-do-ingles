export type Variante = 'a' | 'b'

interface Opcoes {
  busca: string
  sortear: boolean
  ler: () => string | null
  gravar: (v: Variante) => void
  aleatorio?: () => number
}

/** ?v=a ou ?v=b na URL vence. Sem isso, sorteia 50/50 (se ligado) e guarda. O padrão é "a". */
export function resolverVariante({ busca, sortear, ler, gravar, aleatorio = Math.random }: Opcoes): Variante {
  const daUrl = new URLSearchParams(busca).get('v')?.toLowerCase()
  if (daUrl === 'a' || daUrl === 'b') return daUrl
  if (!sortear) return 'a'
  const salva = ler()
  if (salva === 'a' || salva === 'b') return salva
  const sorteada: Variante = aleatorio() < 0.5 ? 'a' : 'b'
  gravar(sorteada)
  return sorteada
}
