import { config } from '../config/quiz.config'

export function Transicao({ aoAvancar }: { aoAvancar: () => void }) {
  const { titulo, texto, botao } = config.transicao
  return (
    <div className="flex flex-1 flex-col justify-center px-5 pb-24">
      <h1 tabIndex={-1} className="text-[32px] font-extrabold leading-[1.1] tracking-tight">{titulo}</h1>
      <p className="mt-4 text-lg leading-relaxed text-suave">{texto}</p>
      <button type="button" onClick={aoAvancar} className="botao mt-8">{botao}</button>
    </div>
  )
}
