import { useState, type MouseEvent } from 'react'
import { config } from '../config/quiz.config'
import type { Nivel, Plano } from '../config/tipos'
import { montarUrlCheckout, parametrosDeOrigem } from '../lib/checkout'
import { LINKS } from '../lib/env'
import { formatarPreco, interpolar, type Variaveis } from '../lib/texto'
import { pixelAtivo, rastrear } from '../lib/tracking'
import type { Variante } from '../lib/variante'
import { Check } from './Check'

const { preco, varianteB, moeda } = config.oferta
const ORIGEM = parametrosDeOrigem(window.location.search)

interface PropsBotao {
  plano: Plano['id']
  valor: number
  nivel: Nivel
  variante: Variante
  nome: string
  texto: string
  classe?: string
}

function BotaoCompra({ plano, valor, nivel, variante, nome, texto, classe = 'botao' }: PropsBotao) {
  const [semLink, setSemLink] = useState(false)
  const url = montarUrlCheckout(LINKS[plano][nivel], ORIGEM, config.CHECKOUT_PASS_NAME ? nome : undefined)

  function clicar(e: MouseEvent) {
    rastrear('InitiateCheckout', { value: valor, currency: moeda, level: nivel, variant: variante })
    if (!url) {
      e.preventDefault()
      setSemLink(true)
      return
    }
    // Dá tempo de o Pixel enviar o evento antes de sair da página.
    if (pixelAtivo() && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault()
      setTimeout(() => window.location.assign(url), 300)
    }
  }

  return (
    <>
      <a href={url ?? '#comprar'} onClick={clicar} className={classe}>{texto}</a>
      {semLink && (
        <p role="alert" className="mt-2 text-center text-sm font-medium text-red-700">
          {config.interface.checkoutIndisponivel}
        </p>
      )}
    </>
  )
}

interface Props {
  nivel: Nivel
  variante: Variante
  nome: string
  vars: Variaveis
}

export function BlocoPreco(props: Props) {
  return props.variante === 'b' ? <DoisPlanos {...props} /> : <PrecoUnico {...props} />
}

function PrecoUnico({ nivel, variante, nome, vars }: Props) {
  return (
    <div className="rounded-3xl border-2 border-marca-600 bg-white p-5 text-center shadow-cartao">
      <p className="text-suave">
        {preco.textoAncora} <s>{formatarPreco(preco.ancora)}</s>
      </p>
      <p className="mt-2 font-bold">
        <span className="block text-lg">{preco.textoHoje} </span>
        <span className="whitespace-nowrap text-[44px] font-extrabold leading-tight tracking-tight text-marca-700 min-[390px]:text-5xl">
          {formatarPreco(preco.valor)}
        </span>
        <span className="whitespace-nowrap text-lg"> {preco.complemento}</span>
      </p>
      {preco.parcelado.ativo && <p className="mt-1 text-suave">{preco.parcelado.texto}</p>}
      <div className="mt-5">
        <BotaoCompra
          plano="completo"
          valor={preco.valor}
          nivel={nivel}
          variante={variante}
          nome={nome}
          texto={interpolar(preco.botao, vars)}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-suave">{preco.condicoes}</p>
    </div>
  )
}

function DoisPlanos({ nivel, variante, nome, vars }: Props) {
  return (
    <div>
      <h2 className="titulo-secao text-center">{varianteB.titulo}</h2>
      <div className="mt-6 space-y-6">
        {varianteB.planos.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-3xl bg-white p-5 ${
              p.destaque ? 'border-2 border-marca-600 pt-8 shadow-cartao ring-4 ring-marca-100' : 'border border-linha'
            }`}
          >
            {p.selo && (
              <p className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-marca-600 px-4 py-1.5 text-sm font-bold text-white">
                {p.selo}
              </p>
            )}
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="whitespace-nowrap text-lg font-bold">{p.nome}</h3>
              <p className={`whitespace-nowrap font-extrabold tracking-tight ${p.destaque ? 'text-3xl text-marca-700 min-[390px]:text-4xl' : 'text-2xl'}`}>
                {formatarPreco(p.preco)}
              </p>
            </div>
            <ul className="mt-4 space-y-2">
              {p.itens.map((item) => (
                <li key={item.texto} className={`flex gap-2.5 ${item.incluso ? '' : 'text-suave'}`}>
                  {item.incluso ? (
                    <Check className="mt-1 h-4 w-4 shrink-0 text-marca-600" />
                  ) : (
                    <span aria-hidden="true" className="w-4 shrink-0 text-center">—</span>
                  )}
                  <span>
                    {interpolar(item.texto, vars)}
                    {!item.incluso && <span className="sr-only"> ({config.interface.naoIncluso})</span>}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <BotaoCompra
                plano={p.id}
                valor={p.preco}
                nivel={nivel}
                variante={variante}
                nome={nome}
                texto={interpolar(p.botao, vars)}
                classe={p.destaque ? 'botao' : 'botao !border-2 !border-marca-600 !bg-white !text-marca-700 hover:!bg-marca-50'}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm leading-relaxed text-suave">{varianteB.condicoes}</p>
    </div>
  )
}
