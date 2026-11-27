import { config } from '../config/quiz.config'
import { LINK_PRIVACIDADE } from '../lib/links'

export function BannerCookies({ aoDecidir }: { aoDecidir: (escolha: 'aceito' | 'recusado') => void }) {
  const c = config.cookies
  return (
    <aside
      aria-label={config.rodape.cookies}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-white px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_-16px_rgba(16,32,63,.35)]"
    >
      <div className="mx-auto max-w-[440px]">
        <p className="text-sm leading-snug text-suave">
          {c.texto}{' '}
          <a href={LINK_PRIVACIDADE} target="_blank" rel="noopener" className="font-semibold text-marca-700 underline">
            {c.saibaMais}
          </a>
        </p>
        <div className="mt-2.5 flex gap-3">
          <button
            type="button"
            onClick={() => aoDecidir('recusado')}
            className="min-h-[48px] flex-1 rounded-xl border-2 border-linha bg-white text-[15px] font-semibold text-tinta hover:border-tinta"
          >
            {c.recusar}
          </button>
          <button
            type="button"
            onClick={() => aoDecidir('aceito')}
            className="min-h-[48px] flex-1 rounded-xl border-2 border-tinta bg-tinta text-[15px] font-semibold text-white hover:bg-black"
          >
            {c.aceitar}
          </button>
        </div>
      </div>
    </aside>
  )
}
