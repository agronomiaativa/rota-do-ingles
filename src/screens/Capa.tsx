import { Check } from '../components/Check'
import { Regua } from '../components/Regua'
import { config } from '../config/quiz.config'
import { interpolar } from '../lib/texto'

export function Capa({ aoComecar }: { aoComecar: () => void }) {
  const { titulo, subtitulo, selos, seloTestes, botao } = config.capa
  const todos =
    seloTestes.ativo && seloTestes.numero > 0
      ? [...selos, interpolar(seloTestes.texto, { numero: seloTestes.numero.toLocaleString('pt-BR') })]
      : selos

  return (
    <div className="flex flex-1 flex-col justify-center px-5 pb-10">
      <Regua />
      <h1 tabIndex={-1} className="mt-4 text-[34px] font-extrabold leading-[1.1] tracking-tight">{titulo}</h1>
      <p className="mt-4 text-lg leading-relaxed text-suave">{subtitulo}</p>
      <button type="button" onClick={aoComecar} className="botao mt-8">{botao}</button>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[15px] font-medium text-suave">
        {todos.map((selo) => (
          <li key={selo} className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-marca-600" />
            {selo}
          </li>
        ))}
      </ul>
    </div>
  )
}
