import { ListaOpcoes } from '../components/ListaOpcoes'
import type { PerguntaPerfil } from '../config/tipos'

interface Props {
  pergunta: PerguntaPerfil
  escolhida?: string
  aoEscolher: (valor: string) => void
}

export function Perfil({ pergunta, escolhida, aoEscolher }: Props) {
  return (
    <div className="px-5 pb-10 pt-2">
      <h1 id="pergunta" tabIndex={-1} className="text-[26px] font-extrabold leading-tight tracking-tight">
        {pergunta.titulo}
      </h1>
      <ListaOpcoes
        rotuladoPor="pergunta"
        escolhida={escolhida}
        aoEscolher={aoEscolher}
        opcoes={pergunta.opcoes.map((o) => ({ chave: o.valor, texto: o.texto }))}
      />
    </div>
  )
}
