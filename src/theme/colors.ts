/**
 * TaskPair — Paleta de cores
 *
 * Todos os pares de cor usados para texto foram verificados contra a
 * WCAG 2.1 (contraste mínimo AA = 4.5:1 para texto normal).
 * Os valores de contraste medidos estão anotados ao lado de cada token.
 *
 * Regra da marca: violeta = "eu", menta = "o grupo".
 * As duas cores nunca aparecem na mesma proporção por acaso — o
 * equilíbrio entre elas é a metáfora visual do produto.
 */

export const palette = {
  // Violeta — cor primária da marca ("eu" / ação individual)
  violet50: '#EFEBFE',
  violet100: '#DCD4FD',
  violet300: '#A996FF',
  violet500: '#7458F5',
  violet600: '#5B3CF0', // primária  — 6.27:1 sobre branco
  violet700: '#4A2ED6', // pressed   — 7.92:1 sobre branco

  // Menta — cor de apoio ("o grupo" / progresso coletivo)
  mint50: '#E4FBF6',
  mint300: '#4FE0C6',
  mint500: '#14C4A9', // apenas preenchimentos, nunca texto pequeno
  mint700: '#0E8C7B',
  mint800: '#0B7A6B', // menta segura para texto — 5.24:1 sobre branco

  // Neutros
  ink: '#12121C', // 18.60:1 sobre branco
  ink70: '#3A3F52', // 10.43:1 sobre branco
  ink50: '#5B6478', //  5.93:1 sobre branco
  border: '#E3E6F0',
  surface: '#FFFFFF',
  background: '#F7F8FC',

  // Semânticos
  amber500: '#F5A524', // preenchimento (prazo próximo)
  amber800: '#8A5A00', // texto — 5.93:1 sobre branco
  red500: '#F04E5B', // preenchimento (atrasado)
  red700: '#C4293A', // texto — 5.64:1 sobre branco

  // Modo escuro
  darkBackground: '#0E0E18',
  darkSurface: '#181828',
  darkInk: '#EDEDF5', // 16.47:1 sobre darkBackground
  darkInk50: '#A0A4B8', //  7.76:1 sobre darkBackground
  darkBorder: '#2A2A3E',
} as const;

export const lightTheme = {
  background: palette.background,
  surface: palette.surface,
  surfaceAlt: palette.violet50,
  border: palette.border,
  text: palette.ink,
  textMuted: palette.ink50,
  primary: palette.violet600,
  primaryPressed: palette.violet700,
  onPrimary: palette.surface,
  accent: palette.mint500,
  accentText: palette.mint800,
  warning: palette.amber500,
  warningText: palette.amber800,
  danger: palette.red500,
  dangerText: palette.red700,
} as const;

export const darkTheme = {
  background: palette.darkBackground,
  surface: palette.darkSurface,
  surfaceAlt: '#221F3A',
  border: palette.darkBorder,
  text: palette.darkInk,
  textMuted: palette.darkInk50,
  primary: palette.violet300,
  primaryPressed: palette.violet500,
  onPrimary: palette.darkBackground,
  accent: palette.mint300,
  accentText: palette.mint300,
  warning: '#FFC15E',
  warningText: '#FFC15E',
  danger: '#FF8A94',
  dangerText: '#FF8A94',
} as const;

/** Cor de status de uma tarefa no Kanban. */
export const statusColor = {
  todo: palette.ink50,
  doing: palette.violet600,
  review: palette.amber500,
  done: palette.mint500,
} as const;

export type ThemeColors = typeof lightTheme;
