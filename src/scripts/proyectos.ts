import type { CollectionEntry } from 'astro:content';
import type { Idioma } from '../i18n/utils';

type Proyecto = CollectionEntry<'proyectos'>;

/** Proyectos de un idioma, sin borradores, ordenados por "orden" y luego por fecha (más reciente primero). */
export function proyectosDe(todos: Proyecto[], lang: Idioma): Proyecto[] {
  return todos
    .filter((p) => p.id.startsWith(lang + '/') && !p.data.borrador)
    .sort((a, b) => a.data.orden - b.data.orden || b.data.fecha.localeCompare(a.data.fecha));
}

export const slugDe = (p: Proyecto) => p.id.split('/').slice(1).join('/');
