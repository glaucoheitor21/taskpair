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
