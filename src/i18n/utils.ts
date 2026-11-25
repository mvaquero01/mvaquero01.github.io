import es from './es.json';
import en from './en.json';

export const idiomas = ['es', 'en'] as const;
export type Idioma = (typeof idiomas)[number];

const textos = { es, en } as const;
export type Clave = keyof typeof es;

/** Texto fijo de la interfaz en el idioma pedido. */
export function t(lang: Idioma, clave: Clave): string {
  return textos[lang][clave] ?? textos.es[clave];
}

/** Segmento de la URL de los proyectos en cada idioma. */
export const seccionProyectos: Record<Idioma, string> = { es: 'proyectos', en: 'projects' };

export function otroIdioma(lang: Idioma): Idioma {
  return lang === 'es' ? 'en' : 'es';
}

/** Elige el texto de un campo bilingüe { es, en } de los archivos de datos. */
export function bi<T>(valor: Record<Idioma, T> | T, lang: Idioma): T {
  if (valor && typeof valor === 'object' && !Array.isArray(valor) && lang in (valor as object)) {
    return (valor as Record<Idioma, T>)[lang];
  }
  return valor as T;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Ruta interna con la base de la web (por si se publica en un subdirectorio). */
export function ruta(p: string): string {
  if (/^(https?:|mailto:|#)/.test(p)) return p;
  return BASE + (p.startsWith('/') ? p : '/' + p);
}
