import { useEffect, useRef } from 'react'
import { Depoimentos } from '../components/Depoimentos'
import { Galeria } from '../components/Galeria'
import { BlocoPreco } from '../components/Precos'
import { config } from '../config/quiz.config'
import type { Nivel } from '../config/tipos'
import { gravar, ler } from '../lib/armazenamento'
import { formatarPreco, interpolar, type Variaveis } from '../lib/texto'
import { rastrearUmaVez } from '../lib/tracking'
import { resolverVariante } from '../lib/variante'

const CHAVE_AB = 'rota:variante'
const c = config.oferta

const variante = resolverVariante({
  busca: window.location.search,
  sortear: config.AB_RANDOM,
  ler: () => ler('localStorage', CHAVE_AB),
  gravar: (v) => gravar('localStorage', CHAVE_AB, v),
})

export function Oferta({ nivel, nome, vars }: { nivel: Nivel; nome: string; vars: Variaveis }) {
  const topo = useRef<HTMLHeadingElement>(null)
  const t = (texto: string) => interpolar(texto, vars)

  // ViewContent quando a oferta aparece de fato na tela.
  useEffect(() => {
    const enviar = () =>
      rastrearUmaVez('ViewContent', {
        content_name: interpolar(c.nomeConteudoPixel, { nivel }),
        value: c.preco.valor,
        currency: c.moeda,
      })
    if (!('IntersectionObserver' in window) || !topo.current) return enviar()
    const observador = new IntersectionObserver((entradas) => {
      if (entradas.some((e) => e.isIntersecting)) {
        enviar()
        observador.disconnect()
      }
    })
    observador.observe(topo.current)
    return () => observador.disconnect()
  }, [nivel])

  const bloco = <BlocoPreco nivel={nivel} variante={variante} nome={nome} vars={vars} />

  return (
    <div className="mt-12 border-t border-linha bg-white pb-12 pt-10">
      <section className="px-5">
        <h2 ref={topo} className="text-[30px] font-extrabold leading-[1.12] tracking-tight">{t(c.titulo)}</h2>
        <p className="mt-3 text-lg leading-relaxed text-suave">{t(c.subtitulo)}</p>
      </section>

      <section className="mt-8 px-5">
        <h3 className="titulo-secao">{c.tituloEntregas}</h3>
        <ul className="mt-4 divide-y divide-linha/70">
          {c.entregas.map((e) => (
            <li key={e.texto} className="flex gap-4 py-4">
              <span aria-hidden="true" className="text-2xl leading-none">{e.icone}</span>
              <div>
                <strong className="block text-[17px]">{t(e.texto)}</strong>
                <span className="leading-relaxed text-suave">{t(e.detalhe)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-5 mt-6 rounded-2xl bg-marca-50 p-5">
        <h3 className="text-lg font-extrabold">{c.tituloBonus}</h3>
        <ul className="mt-3 space-y-3">
          {c.bonus.map((b) => (
            <li key={b.nome} className="flex items-start justify-between gap-4">
              <div>
                <span className="font-semibold"><span aria-hidden="true">🎁 </span>{b.nome}</span>
                {b.detalhe && <span className="block text-[15px] text-suave">{b.detalhe}</span>}
              </div>
              <p className="shrink-0 text-right text-[15px]">
                <span className="sr-only">{config.interface.de} </span>
                <s className="text-suave">{formatarPreco(b.precoDe)}</s>
                <strong className="block text-marca-700">{config.interface.gratis}</strong>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="comprar" className="mt-10 scroll-mt-20 px-5">{bloco}</section>

      <section className="mt-12 px-5">
        <h2 className="titulo-secao">{c.tituloPassos}</h2>
        <ol className="mt-5 space-y-4">
          {c.passos.map((passo, i) => (
            <li key={passo} className="flex items-center gap-4">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marca-100 font-extrabold text-marca-800">
                {i + 1}
              </span>
              <span className="text-[17px] leading-snug">{passo}</span>
            </li>
          ))}
        </ol>
      </section>

      <Galeria vars={vars} nivel={nivel} />
      <Depoimentos />

      <section className="mx-5 mt-12 rounded-2xl border-2 border-marca-200 p-5">
        <p className="text-lg font-extrabold leading-snug">
          <span aria-hidden="true">{c.garantia.icone} </span>{c.garantia.titulo}
        </p>
        <p className="mt-1.5 leading-relaxed text-suave">{c.garantia.texto}</p>
      </section>

      <section className="mt-12 px-5">
        <h2 className="titulo-secao">{c.tituloFaq}</h2>
        <div className="mt-3 divide-y divide-linha border-y border-linha">
          {c.faq.map((f) => (
            <details key={f.pergunta} className="group">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-[17px] font-semibold">
                {f.pergunta}
                <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-marca-600 transition-transform group-open:rotate-180" aria-hidden="true">
                  <path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className="pb-4 leading-relaxed text-suave">
                {t(variante === 'b' && f.respostaVarianteB ? f.respostaVarianteB : f.resposta)}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 px-5">{bloco}</section>
    </div>
  )
}
