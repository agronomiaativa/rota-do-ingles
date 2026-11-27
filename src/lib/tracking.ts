import { config } from '../config/quiz.config'
import { gravar, ler } from './armazenamento'
import { PIXEL_ID } from './env'

type Parametros = Record<string, string | number>
export type Consentimento = 'pendente' | 'aceito' | 'recusado'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    fbq?: Fbq
    _fbq?: Fbq
  }
}
interface Fbq {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: unknown
  loaded: boolean
  version: string
}

const CHAVE = 'rota:cookies'
const EVENTOS_PADRAO = new Set(['PageView', 'ViewContent', 'InitiateCheckout'])

let consentimento: Consentimento = 'pendente'
let fila: [string, Parametros | undefined][] = []
const jaEnviados = new Set<string>()
let iniciado = false

function carregarPixel() {
  if (!PIXEL_ID || window.fbq) return
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  } as Fbq
  fbq.queue = []
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  window.fbq = window._fbq = fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  // Sem a coleta automática de cliques e formulários: o primeiro nome não vai para a Meta.
  fbq('set', 'autoConfig', false, PIXEL_ID)
  fbq('init', PIXEL_ID)
}

function enviarAoPixel(evento: string, params?: Parametros) {
  window.fbq?.(EVENTOS_PADRAO.has(evento) ? 'track' : 'trackCustom', evento, params ?? {})
}

function liberarPixel() {
  carregarPixel()
  for (const [evento, params] of fila) enviarAoPixel(evento, params)
  fila = []
}

/** Lê a escolha salva. Devolve "pendente" quando é preciso mostrar o banner. */
export function iniciarRastreamento(): Consentimento {
  if (iniciado) return consentimento
  iniciado = true
  const salvo = ler('localStorage', CHAVE)
  if (!config.CONSENT_BANNER) consentimento = 'aceito'
  else if (salvo === 'aceito' || salvo === 'recusado') consentimento = salvo
  if (consentimento === 'aceito') liberarPixel()
  if (consentimento !== 'pendente') avisarDataLayer()
  return consentimento
}

export function definirConsentimento(escolha: 'aceito' | 'recusado') {
  const mudou = escolha !== consentimento
  consentimento = escolha
  gravar('localStorage', CHAVE, escolha)
  if (escolha === 'aceito') {
    window.fbq?.('consent', 'grant')
    liberarPixel()
  } else {
    fila = []
    window.fbq?.('consent', 'revoke')
  }
  if (mudou) avisarDataLayer()
}

function avisarDataLayer() {
  empilhar({ event: 'CookieConsent', consent: consentimento })
}

function empilhar(dados: Record<string, unknown>) {
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(dados)
}

/** Emite no dataLayer sempre e no Pixel só com consentimento (antes disso, espera na fila). */
export function rastrear(evento: string, params?: Parametros) {
  empilhar({ event: evento, ...params })
  if (!PIXEL_ID) return
  if (consentimento === 'aceito') enviarAoPixel(evento, params)
  else if (consentimento === 'pendente') fila.push([evento, params])
}

/** Uma vez por carregamento: voltar e refazer uma tela não duplica o evento. */
export function rastrearUmaVez(evento: string, params?: Parametros) {
  if (jaEnviados.has(evento)) return
  jaEnviados.add(evento)
  rastrear(evento, params)
}

export function pixelAtivo(): boolean {
  return Boolean(PIXEL_ID) && consentimento === 'aceito'
}
