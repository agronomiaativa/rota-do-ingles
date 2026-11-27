// Navegação privada e navegadores embutidos podem bloquear o armazenamento: nada aqui pode quebrar a página.
type Tipo = 'localStorage' | 'sessionStorage'

export function ler(tipo: Tipo, chave: string): string | null {
  try {
    return window[tipo].getItem(chave)
  } catch {
    return null
  }
}

export function gravar(tipo: Tipo, chave: string, valor: string): void {
  try {
    window[tipo].setItem(chave, valor)
  } catch {
    /* segue só na memória */
  }
}
