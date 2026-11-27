import { config } from '../config/quiz.config'
import { LINK_PRIVACIDADE, LINK_TERMOS } from '../lib/links'
import { interpolar } from '../lib/texto'

const link = 'inline-flex min-h-[48px] items-center px-2 underline hover:text-tinta'

export function Rodape({ aoAbrirCookies }: { aoAbrirCookies?: () => void }) {
  const r = config.rodape
  return (
    <footer className="border-t border-linha px-5 py-6 text-center text-sm leading-relaxed text-suave">
      <p>{r.aviso}</p>
      {/* Em nova aba, para a pessoa não perder o resultado. */}
      <nav aria-label="Links legais" className="mt-2 flex flex-wrap justify-center gap-x-2">
        <a href={LINK_PRIVACIDADE} target="_blank" rel="noopener" className={link}>{r.privacidade}</a>
        <a href={LINK_TERMOS} target="_blank" rel="noopener" className={link}>{r.termos}</a>
        {config.CONSENT_BANNER && aoAbrirCookies && (
          <button type="button" onClick={aoAbrirCookies} className={link}>{r.cookies}</button>
        )}
      </nav>
      <p className="mt-1">{interpolar(r.copyright, { ano: new Date().getFullYear() })}</p>
    </footer>
  )
}
