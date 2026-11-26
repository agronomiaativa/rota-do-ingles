import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { loadEnv, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { config as quiz } from './src/config/quiz.config.ts'

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Título e descrição das páginas vêm do quiz.config.ts. */
function textosDoHtml(): Plugin {
  return {
    name: 'textos-do-html',
    transformIndexHtml(html, { path }) {
      const { tituloPagina, descricaoPagina, nome } = quiz.marca
      const titulo = path.includes('privacidade')
        ? `${quiz.legal.privacidade.titulo} | ${nome}`
        : path.includes('termos')
          ? `${quiz.legal.termos.titulo} | ${nome}`
          : tituloPagina
      return html
        .replace(/%TITULO%/g, escapar(titulo))
        .replace(/%DESCRICAO%/g, escapar(descricaoPagina))
    },
  }
}

/** Avisa no build quais variáveis do .env ainda faltam. */
function avisoDeEnv(env: Record<string, string>): Plugin {
  return {
    name: 'aviso-de-env',
    apply: 'build',
    closeBundle() {
      const niveis = ['A1', 'A2', 'B1', 'B2']
      const nomes = [
        'VITE_META_PIXEL_ID',
        ...niveis.map((n) => `VITE_CHECKOUT_${n}`),
        ...niveis.map((n) => `VITE_CHECKOUT_ESSENCIAL_${n}`),
      ]
      const faltando = nomes.filter((n) => !env[n] || env[n].includes('SEU-LINK'))
      if (faltando.length) {
        console.warn(`\n⚠️  Variáveis ainda não configuradas no .env:\n   ${faltando.join('\n   ')}\n`)
      }
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), textosDoHtml(), avisoDeEnv(loadEnv(mode, process.cwd(), 'VITE_'))],
  build: {
    // Cobre celulares mais antigos e os navegadores embutidos do Instagram e do Facebook.
    target: ['es2020', 'safari14', 'chrome87'],
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacidade: resolve(import.meta.dirname, 'privacidade/index.html'),
        termos: resolve(import.meta.dirname, 'termos/index.html'),
        upsell: resolve(import.meta.dirname, 'upsell/index.html'),
      },
    },
  },
  test: { include: ['src/**/*.test.ts'] },
}))
