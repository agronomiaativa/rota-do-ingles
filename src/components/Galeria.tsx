import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { config } from '../config/quiz.config'
import type { Nivel } from '../config/tipos'
import { arquivo } from '../lib/links'
import { interpolar, type Variaveis } from '../lib/texto'

const p = config.oferta.previa
const LIMITE_ARRASTO = 50

interface Pagina {
  pequena: string
  grande: string
  rotulo: string
  legenda: string
  alt: string
}

const reduzMovimento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Posição de cada folha na pilha: 0 = na frente, 1 e 2 = atrás, n-1 = a que acabou de sair. */
function estiloDaFolha(pos: number, n: number, arrasto: number) {
  if (pos === 0)
    return { transform: `translateX(${arrasto}px) rotate(${arrasto / 18}deg)`, opacity: 1, zIndex: 30 }
  if (pos === 1) return { transform: 'translate(16px, 10px) rotate(3deg) scale(.95)', opacity: 1, zIndex: 20 }
  if (pos === 2) return { transform: 'translate(-14px, 18px) rotate(-3.5deg) scale(.9)', opacity: 1, zIndex: 10 }
  if (pos === n - 1) return { transform: 'translateX(-115%) rotate(-10deg)', opacity: 0, zIndex: 40 }
  return { transform: 'translate(-14px, 18px) rotate(-3.5deg) scale(.86)', opacity: 0, zIndex: 0 }
}

export function Galeria({ vars, nivel }: { vars: Variaveis; nivel: Nivel }) {
  const paginas: Pagina[] = p.paginas.map((pg) => {
    const caminho = interpolar(pg.imagem, vars)
    const rotulo = interpolar(pg.rotulo, vars)
    const semLacuna = vars.lacuna_arquivo === 'nenhuma' && pg.legendaSemLacuna
    const legenda = interpolar(
      semLacuna || (typeof pg.legenda === 'string' ? pg.legenda : pg.legenda[nivel]),
      vars,
    )
    return {
      pequena: arquivo(`${caminho}-p.webp`),
      grande: arquivo(`${caminho}.webp`),
      rotulo,
      legenda,
      alt: interpolar(p.alt, { rotulo, legenda }),
    }
  })
  const n = paginas.length

  const [atual, setAtual] = useState(0)
  const [tocando, setTocando] = useState(() => !reduzMovimento())
  const [naTela, setNaTela] = useState(false)
  const [abaVisivel, setAbaVisivel] = useState(true)
  const [ampliada, setAmpliada] = useState<number | null>(null)
  const [arrasto, setArrasto] = useState(0)
  const secao = useRef<HTMLElement>(null)
  const gesto = useRef<{ x: number; y: number; horizontal: boolean | null } | null>(null)
  const arrastou = useRef(false)
  const refFrente = useRef<HTMLButtonElement>(null)

  const ir = useCallback((passo: number) => setAtual((a) => (a + passo + n) % n), [n])
  const irManual = (passo: number) => {
    setTocando(false)
    ir(passo)
  }

  const rodando = tocando && naTela && abaVisivel && ampliada === null

  // Troca sozinha só enquanto a galeria está visível.
  useEffect(() => {
    if (!rodando) return
    const id = setTimeout(() => ir(1), p.trocaMs)
    return () => clearTimeout(id)
  }, [rodando, atual, ir])

  useEffect(() => {
    const el = secao.current
    if (!el || !('IntersectionObserver' in window)) return setNaTela(true)
    const obs = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), { threshold: 0.4 })
    obs.observe(el)
    const aba = () => setAbaVisivel(!document.hidden)
    document.addEventListener('visibilitychange', aba)
    return () => {
      obs.disconnect()
      document.removeEventListener('visibilitychange', aba)
    }
  }, [])

  // Arrastar com o dedo: na horizontal troca a página; na vertical deixa a página rolar.
  function inicio(e: PointerEvent) {
    gesto.current = { x: e.clientX, y: e.clientY, horizontal: null }
    arrastou.current = false
  }
  function mover(e: PointerEvent) {
    const g = gesto.current
    if (!g) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (g.horizontal === null && Math.hypot(dx, dy) > 8) {
      g.horizontal = Math.abs(dx) > Math.abs(dy)
      if (g.horizontal) (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    if (g.horizontal) {
      arrastou.current = true
      setArrasto(dx)
    }
  }
  function fim() {
    if (gesto.current?.horizontal && Math.abs(arrasto) > LIMITE_ARRASTO) irManual(arrasto < 0 ? 1 : -1)
    gesto.current = null
    setArrasto(0)
  }

  function teclas(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') irManual(1)
    else if (e.key === 'ArrowLeft') irManual(-1)
  }

  const pagina = paginas[atual]

  return (
    <section ref={secao} className="mt-12 px-5" aria-roledescription="carrossel" aria-labelledby="titulo-previa" onKeyDown={teclas}>
      <h2 id="titulo-previa" className="titulo-secao">{p.titulo}</h2>
      <p className="mt-1.5 text-suave">{p.subtitulo}</p>

      {/* Uma barrinha por página; a atual enche no tempo da troca. */}
      <div aria-hidden="true" className="mx-auto mt-5 flex w-[78%] max-w-[300px] gap-1">
        {paginas.map((_, i) => (
          <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-marca-100">
            <span
              key={i === atual ? `${atual}-${rodando}` : i}
              className="block h-full origin-left rounded-full bg-marca-600"
              style={
                i < atual
                  ? undefined
                  : i === atual
                    ? rodando
                      ? { animation: `segmento ${p.trocaMs}ms linear both` }
                      : undefined
                    : { transform: 'scaleX(0)' }
              }
            />
          </span>
        ))}
      </div>

      <div
        className="relative mx-auto mt-5 w-[74%] max-w-[290px] select-none"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={inicio}
        onPointerMove={mover}
        onPointerUp={fim}
        onPointerCancel={fim}
      >
        <div className="relative h-0 pb-[141.5%]">
          {paginas.map((pg, i) => {
            const pos = (i - atual + n) % n
            const perto = pos <= 3 || pos === n - 1
            const frente = pos === 0
            return (
              <button
                key={i}
                type="button"
                ref={frente ? refFrente : undefined}
                tabIndex={frente ? 0 : -1}
                aria-hidden={!frente}
                aria-label={frente ? `Ampliar: ${pg.alt}` : undefined}
                onClick={() => {
                  if (frente && !arrastou.current) {
                    setTocando(false)
                    setAmpliada(i)
                  }
                }}
                className={`absolute inset-0 cursor-zoom-in overflow-hidden rounded-xl border border-linha/80 bg-white shadow-[0_10px_30px_-12px_rgba(16,32,63,.45)] ${
                  arrasto !== 0 && frente ? '' : 'transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,.61,.36,1)]'
                }`}
                style={estiloDaFolha(pos, n, arrasto)}
              >
                {perto && (
                  <img
                    src={pg.pequena}
                    alt=""
                    width={600}
                    height={849}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-7 flex items-center gap-2">
        <BotaoRedondo rotulo="Página anterior" aoClicar={() => irManual(-1)} seta="M12.5 4.5 7 10l5.5 5.5" />
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[13px] font-bold uppercase tracking-wide text-marca-700">{pagina.rotulo}</p>
          <p aria-live={rodando ? 'off' : 'polite'} className="mt-0.5 min-h-[48px] font-semibold leading-snug">
            {pagina.legenda}
          </p>
        </div>
        <BotaoRedondo rotulo="Próxima página" aoClicar={() => irManual(1)} seta="M7.5 4.5 13 10l-5.5 5.5" />
      </div>

      <div className="mt-1 flex items-center justify-center gap-1 text-sm text-suave">
        <span className="tabular-nums">{atual + 1} / {n}</span>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => setTocando((t) => !t)}
          className="inline-flex min-h-[48px] items-center gap-1.5 rounded-lg px-2 font-semibold text-marca-700 underline-offset-2 hover:underline"
        >
          {tocando ? 'Pausar' : 'Passar sozinho'}
        </button>
      </div>

      {ampliada !== null && (
        <Ampliacao
          paginas={paginas}
          indice={ampliada}
          aoMudar={(i) => {
            setAmpliada(i)
            setAtual(i)
          }}
          aoFechar={() => {
            setAmpliada(null)
            // Devolve o foco para a página da frente (pode ser outra, se a pessoa navegou na ampliação).
            requestAnimationFrame(() => refFrente.current?.focus())
          }}
        />
      )}
    </section>
  )
}

function BotaoRedondo({ rotulo, aoClicar, seta }: { rotulo: string; aoClicar: () => void; seta: string }) {
  return (
    <button
      type="button"
      aria-label={rotulo}
      onClick={aoClicar}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-linha bg-white text-marca-700 hover:border-marca-600"
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
        <path d={seta} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

interface PropsAmpliacao {
  paginas: Pagina[]
  indice: number
  aoMudar: (i: number) => void
  aoFechar: () => void
}

/** Página em tela cheia, em alta resolução. Tocar na imagem aproxima; o gesto de pinça também funciona. */
function Ampliacao({ paginas, indice, aoMudar, aoFechar }: PropsAmpliacao) {
  const n = paginas.length
  const pg = paginas[indice]
  const [zoom, setZoom] = useState(false)
  const caixa = useRef<HTMLDivElement>(null)
  const fechar = useRef<HTMLButtonElement>(null)
  const rolagem = useRef<HTMLDivElement>(null)
  const mudar = (passo: number) => {
    setZoom(false)
    aoMudar((indice + passo + n) % n)
  }

  useEffect(() => {
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fechar.current?.focus()
    return () => {
      document.body.style.overflow = overflow
    }
  }, [])

  useEffect(() => {
    rolagem.current?.scrollTo({ top: 0, left: 0 })
  }, [indice])

  function teclas(e: KeyboardEvent) {
    e.stopPropagation()
    if (e.key === 'Escape') aoFechar()
    else if (e.key === 'ArrowRight') mudar(1)
    else if (e.key === 'ArrowLeft') mudar(-1)
    else if (e.key === 'Tab') {
      // Mantém o foco dentro da janela.
      const focaveis = caixa.current?.querySelectorAll<HTMLElement>('button')
      if (!focaveis?.length) return
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primeiro.focus()
      }
    }
  }

  // Portal no <body>: fica acima de tudo, inclusive da barra do cronômetro.
  return createPortal(
    <div
      ref={caixa}
      role="dialog"
      aria-modal="true"
      aria-label={pg.alt}
      onKeyDown={teclas}
      className="fixed inset-0 z-50 flex flex-col bg-[#0B1530] text-white"
    >
      <div className="mx-auto flex w-full max-w-coluna items-center justify-between px-3 pt-[env(safe-area-inset-top)]">
        <span className="px-2 text-sm tabular-nums text-white/80">{indice + 1} / {n}</span>
        <button
          ref={fechar}
          type="button"
          onClick={aoFechar}
          className="flex min-h-[48px] items-center gap-1 rounded-lg px-3 font-semibold"
        >
          Fechar
          <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div ref={rolagem} className="min-h-0 flex-1 overflow-auto overscroll-contain">
        <button
          type="button"
          onClick={() => setZoom((z) => !z)}
          aria-label={zoom ? 'Afastar' : 'Aproximar'}
          className={`mx-auto block px-3 py-2 ${zoom ? 'w-[200%] max-w-none cursor-zoom-out' : 'w-full max-w-coluna cursor-zoom-in'}`}
        >
          <img src={pg.grande} alt={pg.alt} width={1200} height={1698} className="h-auto w-full rounded-lg bg-white" />
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-coluna items-center gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <button type="button" aria-label="Página anterior" onClick={() => mudar(-1)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
          <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <p className="min-w-0 flex-1 text-center text-[15px] leading-snug">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-marca-200">{pg.rotulo}</span>
          {pg.legenda}
        </p>
        <button type="button" aria-label="Próxima página" onClick={() => mudar(1)} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
          <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>,
    document.body,
  )
}
