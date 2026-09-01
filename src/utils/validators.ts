/** Validações de formulário. */
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const minLength = (v: string, n: number) => v.trim().length >= n;
export const isRequired = (v: string) => v.trim().length > 0;
