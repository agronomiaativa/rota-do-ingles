import { useState, type FormEvent } from 'react'
import { config } from '../config/quiz.config'
import { validarNome, type ErroNome } from '../lib/texto'

const c = config.nome
const MENSAGENS: Record<ErroNome, string> = { curto: c.erroCurto, longo: c.erroLongo, invalido: c.erroInvalido }

export function Nome({ inicial, aoEnviar }: { inicial: string; aoEnviar: (nome: string) => void }) {
  const [valor, setValor] = useState(inicial)
  const [erro, setErro] = useState<ErroNome>()

  function enviar(e: FormEvent) {
    e.preventDefault()
    const r = validarNome(valor)
    if ('nome' in r) return aoEnviar(r.nome)
    setErro(r.erro)
    document.getElementById('nome')?.focus()
  }

  return (
    <form noValidate onSubmit={enviar} className="px-5 pb-10 pt-2">
      <h1 tabIndex={-1} className="text-[28px] font-extrabold leading-tight tracking-tight">{c.titulo}</h1>
      <p className="mt-3 text-lg leading-relaxed text-suave">{c.texto}</p>
      <label htmlFor="nome" className="mt-6 block font-semibold">{c.rotulo}</label>
      <input
        id="nome"
        type="text"
        value={valor}
        onChange={(e) => {
          setValor(e.target.value)
          setErro(undefined)
        }}
        placeholder={c.exemplo}
        autoComplete="given-name"
        autoCapitalize="words"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="go"
        maxLength={60}
        required
        aria-invalid={erro !== undefined}
        aria-describedby={erro ? 'erro-nome' : undefined}
        className={`mt-2 min-h-[56px] w-full rounded-2xl border-2 bg-white px-4 text-lg placeholder:text-[#66748F] ${
          erro ? 'border-red-700' : 'border-linha'
        }`}
      />
      <p id="erro-nome" role="alert" className="mt-2 min-h-[24px] text-[15px] font-medium text-red-700">
        {erro && MENSAGENS[erro]}
      </p>
      <button type="submit" className="botao mt-2">{c.botao}</button>
    </form>
  )
}
