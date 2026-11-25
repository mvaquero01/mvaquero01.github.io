import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada proyecto es un archivo .md en src/content/proyectos/es/ y otro con el
// mismo nombre en src/content/proyectos/en/. Estos son los campos que acepta.
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string(),
    fecha: z.string(),
    portada: z.string(),
    tecnologias: z.array(z.string()).default([]),
    rol: z.string().optional(),
    duracion: z.string().optional(),
    video: z.string().optional(),
    enlaces: z
      .object({ github: z.string().optional(), demo: z.string().optional(), documento: z.string().optional() })
      .optional(),
    resultados: z.array(z.object({ valor: z.string(), etiqueta: z.string() })).default([]),
    galeria: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    destacado: z.boolean().default(false),
    orden: z.number().default(99),
    borrador: z.boolean().default(false),
  }),
});

export const collections = { proyectos };
