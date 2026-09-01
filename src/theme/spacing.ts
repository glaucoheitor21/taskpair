/** Escala de espaçamento de 4pt — todo padding/margin do app sai daqui. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Raios de canto. `card` é o raio da marca (mesmo do símbolo do logo). */
export const radius = {
  sm: 8,
  md: 12,
  card: 16,
  lg: 20,
  pill: 999,
} as const;

/** Elevação suave — sombra violeta em vez de preta, para não "sujar" o fundo. */
export const shadow = {
  card: {
    shadowColor: '#2A1E6B',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  floating: {
    shadowColor: '#2A1E6B',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;

/** Alvo mínimo de toque recomendado pelas guidelines de acessibilidade. */
export const HIT_SLOP_MIN = 44;
