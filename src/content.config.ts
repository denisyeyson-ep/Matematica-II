import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sesiones = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sesiones' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    week: z.number().int().min(1).max(18),
    session: z.number().int().min(1).max(2),
    date: z.coerce.date(),
    unit: z.number().int().min(1).max(6),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(false),
    duration: z.string().default('2 horas'),
    difficulty: z.enum(['Básico', 'Intermedio', 'Avanzado']).default('Intermedio'),
    exercises: z.number().int().min(0).default(5),
  }),
});

export const collections = { sesiones };
