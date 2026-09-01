import { getCollection, type CollectionEntry } from 'astro:content';
import { portfolio } from '../config/portfolio';

export type SessionEntry = CollectionEntry<'sesiones'>;

export async function getSessions(): Promise<SessionEntry[]> {
  const entries = await getCollection('sesiones');
  return entries.sort((left, right) =>
    left.data.week - right.data.week || left.data.session - right.data.session,
  );
}

export function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function withBase(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : '/' + path;
  return base + normalized;
}

export function sessionUrl(session: SessionEntry): string {
  return withBase('/semanas/' + pad(session.data.week) + '/sesion-' + pad(session.data.session) + '/');
}

export function weekUrl(week: number): string {
  return withBase('/semanas/' + pad(week) + '/');
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function unitForWeek(week: number) {
  return portfolio.units.find((unit) => week >= unit.start && week <= unit.end)
    ?? portfolio.units[0];
}

export function currentWeek(now = new Date()): number {
  const first = new Date(portfolio.firstWeekDate + 'T00:00:00-05:00');
  const elapsed = Math.floor((now.getTime() - first.getTime()) / 604800000) + 1;
  return Math.max(1, Math.min(portfolio.weeks, elapsed));
}

export function weekRange(week: number): string {
  const start = new Date(portfolio.firstWeekDate + 'T12:00:00Z');
  start.setUTCDate(start.getUTCDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const month = new Intl.DateTimeFormat('es-PE', { month: 'short', timeZone: 'UTC' });
  return start.getUTCDate() + ' - ' + end.getUTCDate() + ' ' + month.format(end);
}

export function searchRecords(sessions: SessionEntry[]) {
  return sessions.map((session) => ({
    title: session.data.title,
    description: session.data.description,
    week: session.data.week,
    session: session.data.session,
    tags: session.data.tags,
    url: sessionUrl(session),
    published: session.data.published,
  }));
}
