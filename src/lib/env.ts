import type { Nivel } from '../config/tipos'

const env = import.meta.env

export const PIXEL_ID: string = (env.VITE_META_PIXEL_ID ?? '').trim()

export const LINKS: Record<'essencial' | 'completo', Record<Nivel, string | undefined>> = {
  completo: {
    A1: env.VITE_CHECKOUT_A1,
    A2: env.VITE_CHECKOUT_A2,
    B1: env.VITE_CHECKOUT_B1,
    B2: env.VITE_CHECKOUT_B2,
  },
  essencial: {
    A1: env.VITE_CHECKOUT_ESSENCIAL_A1,
    A2: env.VITE_CHECKOUT_ESSENCIAL_A2,
    B1: env.VITE_CHECKOUT_ESSENCIAL_B1,
    B2: env.VITE_CHECKOUT_ESSENCIAL_B2,
  },
}
