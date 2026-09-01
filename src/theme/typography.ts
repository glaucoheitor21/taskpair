/**
 * TaskPair — Tipografia
 *
 * Sora     → títulos e números. Geométrica, com terminações retas e um
 *            "g" de caixa única marcante. Dá personalidade sem ruído.
 * Inter    → interface e corpo de texto. Desenhada para telas, com altura
 *            de x alta, o que mantém rótulos de 12–13px legíveis no mobile.
 *
 * Ambas são open source (SIL Open Font License) e distribuídas via
 * @expo-google-fonts, então não há custo nem risco de licença no APK.
 */

export const fontFamily = {
  display: 'Sora_600SemiBold',
  displayBold: 'Sora_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

/** Escala tipográfica modular (razão ~1.20, base 16). */
export const typography = {
  display: { fontFamily: fontFamily.displayBold, fontSize: 32, lineHeight: 38, letterSpacing: -0.6 },
  h1: { fontFamily: fontFamily.display, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  h2: { fontFamily: fontFamily.display, fontSize: 20, lineHeight: 26, letterSpacing: -0.2 },
  h3: { fontFamily: fontFamily.bodySemiBold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: fontFamily.body, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fontFamily.bodyMedium, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fontFamily.bodyMedium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamily.body, fontSize: 12, lineHeight: 16 },
  overline: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyToken = keyof typeof typography;
