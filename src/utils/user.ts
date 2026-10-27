/** Helpers de usuário: iniciais e cor determinística do avatar. */
import { palette } from '../theme/colors';

const AVATAR_COLORS = [
  palette.violet600,
  palette.mint500,
  palette.amber500,
  palette.red500,
  '#3B82F6',
  '#EC4899',
  '#8B5CF6',
  '#0EA5E9',
];

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0][1] ?? '');
  return (first + last).toUpperCase();
}

export function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}
