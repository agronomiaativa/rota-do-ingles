import { ListaOpcoes } from '../components/ListaOpcoes'
import { config } from '../config/quiz.config'
import type { Resposta } from '../lib/scoring'
import { interpolar } from '../lib/texto'

const NAO_SEI = '__nao_sei__'

interface Props {
  indice: number
  opcoes: string[]
  /** undefined = ainda não respondida; null = "Não sei". */
  escolhida: Resposta | undefined
  aoResponder: (resposta: Resposta) => void
}

export function Pergunta({ indice, opcoes, escolhida, aoResponder }: Props) {
  const pergunta = config.perguntas[indice]
  // "Complete: She ___ a teacher." → a instrução fica em uma linha e a frase na outra.
  const [, instrucao, frase] = pergunta.enunciado.match(/^([^:]+:)\s+(.+)$/) ?? []
  return (
    <div className="px-5 pb-10 pt-2">
      <p className="text-[15px] font-semibold text-marca-700">
        {interpolar(config.interface.perguntaDe, { atual: indice + 1, total: config.perguntas.length })}
      </p>
      <h1 id="pergunta" tabIndex={-1} className="mt-1.5 text-[26px] font-extrabold leading-tight tracking-tight">
        {instrucao ? (
          <>
            <span className="block text-lg font-semibold tracking-normal text-suave">{instrucao} </span>
            <span className="mt-1 block">{frase}</span>
          </>
        ) : (
          pergunta.enunciado
        )}
      </h1>
      <ListaOpcoes
        rotuladoPor="pergunta"
        escolhida={escolhida === null ? NAO_SEI : escolhida}
        aoEscolher={(chave) => aoResponder(chave === NAO_SEI ? null : chave)}
        opcoes={[
          ...opcoes.map((texto) => ({ chave: texto, texto, idioma: pergunta.idiomaOpcoes })),
          { chave: NAO_SEI, texto: config.interface.naoSei, discreta: true },
        ]}
      />
    </div>
  )
}
