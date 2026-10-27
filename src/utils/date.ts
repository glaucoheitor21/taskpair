/** Helpers de prazo usados pelo DeadlineChip e pela Home. */

export function daysUntil(isoDate: string, today = new Date()): number {
  const target = new Date(`${isoDate}T00:00:00`);
  const base = new Date(today.toDateString());
  return Math.round((target.getTime() - base.getTime()) / 86_400_000);
}

export type Urgency = 'overdue' | 'today' | 'soon' | 'later';

/** Regra de cor do prazo: vermelho, âmbar ou neutro. */
export function urgencyOf(isoDate: string, today = new Date()): Urgency {
  const d = daysUntil(isoDate, today);
  if (d < 0) return 'overdue';
  if (d === 0) return 'today';
  if (d <= 3) return 'soon';
  return 'later';
}

export function formatDatePtBr(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

/** Data local de hoje em 'YYYY-MM-DD'. */
export function todayISO(today = new Date()): string {
  return toISO(today);
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDaysISO(days: number, today = new Date()): string {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
  return toISO(d);
}

/** 'DD/MM/AAAA' → 'YYYY-MM-DD', ou null se a data não existir. */
export function parseDateBr(value: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!m) return null;
  const [, d, mo, y] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  if (date.getFullYear() !== Number(y) || date.getMonth() !== Number(mo) - 1 || date.getDate() !== Number(d)) {
    return null;
  }
  return `${y}-${mo}-${d}`;
}

/** Máscara de digitação DD/MM/AAAA. */
export function maskDateBr(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** Rótulo humano do prazo: "Hoje", "Amanhã", "em 5 dias", "atrasada 2 dias". */
export function relativeDueLabel(isoDate: string, today = new Date()): string {
  const d = daysUntil(isoDate, today);
  if (d === 0) return 'Hoje';
  if (d === 1) return 'Amanhã';
  if (d === -1) return 'Ontem';
  if (d < 0) return `${-d} dias atrás`;
  if (d <= 60) return `em ${d} dias`;
  return formatDatePtBr(isoDate).slice(0, 5);
}

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** '2026-11-28' → '28 nov' */
export function formatShort(isoDate: string): string {
  const [, m, d] = isoDate.split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1]}`;
}
