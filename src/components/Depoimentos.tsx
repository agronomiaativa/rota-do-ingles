import { config } from '../config/quiz.config'

/** Desligado por padrão em config.oferta.depoimentos. Use só depoimentos reais. */
export function Depoimentos() {
  const { ativo, titulo, itens } = config.oferta.depoimentos
  if (!ativo || itens.length === 0) return null
  return (
    <section className="mt-12 px-5">
      <h2 className="titulo-secao">{titulo}</h2>
      <ul className="mt-4 space-y-3">
        {itens.map((d, i) => (
          <li key={i}>
            <figure className="cartao">
              <blockquote className="leading-relaxed">{d.texto}</blockquote>
              <figcaption className="mt-3 text-[15px] text-suave">
                <strong className="text-tinta">{d.nome}</strong> · {d.detalhe}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
