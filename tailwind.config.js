/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './upsell/index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cor de destaque do site. Para trocar o azul, mude só aqui.
        marca: { 50: '#EEF3FF', 100: '#DBE5FF', 200: '#B9CCFF', 600: '#1D4FD7', 700: '#173FAE', 800: '#12307F' },
        tinta: '#10203F', // texto principal
        suave: '#475672', // texto secundário
        nevoa: '#F6F8FC', // fundo da página
        linha: '#C6D0E2', // bordas
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      maxWidth: { coluna: '480px' },
      boxShadow: { cartao: '0 1px 2px rgba(16,32,63,.05), 0 6px 20px -12px rgba(16,32,63,.18)' },
    },
  },
  plugins: [],
}
