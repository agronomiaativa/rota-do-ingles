import { Rodape } from '../components/Rodape'
import { config } from '../config/quiz.config'
import { LINK_INICIO } from '../lib/links'

export function Legal({ qual }: { qual: 'privacidade' | 'termos' }) {
  const p = config.legal[qual]
  return (
    <div className="mx-auto min-h-[100svh] w-full max-w-coluna">
      <header className="px-5 pt-3">
        <a href={LINK_INICIO} className="inline-flex min-h-[48px] items-center font-semibold text-marca-700 underline">
          {config.interface.voltarAoTeste}
        </a>
      </header>
      <main className="px-5 pb-10 pt-2">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">{p.titulo}</h1>
        {p.avisoProvisorio && (
          <p className="mt-4 rounded-xl border border-amber-700 bg-amber-50 p-4 font-medium text-amber-900">{p.avisoProvisorio}</p>
        )}
        {p.secoes.map((s) => (
          <section key={s.titulo} className="mt-7">
            <h2 className="text-xl font-bold">{s.titulo}</h2>
            {s.paragrafos.map((texto) => (
              <p key={texto} className="mt-2 leading-relaxed text-suave">{texto}</p>
            ))}
          </section>
        ))}
      </main>
      <Rodape />
    </div>
  )
}
