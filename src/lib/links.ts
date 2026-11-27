const BASE = import.meta.env.BASE_URL

export const LINK_INICIO = BASE
export const LINK_PRIVACIDADE = `${BASE}privacidade`
export const LINK_TERMOS = `${BASE}termos`
/** Caminho de um arquivo da pasta /public. */
export const arquivo = (caminho: string) => BASE + caminho.replace(/^\//, '')
