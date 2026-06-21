import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const panduanSchema = z.object({
  icon: z.string().nullable(),
  text: z.string(),
});

const kapsulSchema = z.object({
  id: z.string(),
  label: z.string().nullable(),
  hint: z.string(),
  charLimit: z.number(),
});

const missions = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/missions' }),
  schema: z.object({
    slug: z.string(),
    number: z.string(),
    title: z.string(),
    subtitle: z.string(),
    progressDots: z.number(),
    totalDots: z.number().default(6),
    protocol: z.object({
      status: z.string(),
      outputLines: z.array(z.object({
        icon: z.string().nullable(),
        text: z.string(),
      })),
      panduan: z.array(panduanSchema),
    }),
    content: z.object({
      type: z.enum(['news_article', 'text_only']),
      newsImages: z.array(z.string()).optional(),
      newsText: z.string().optional(),
    }),
    kapsulWaktu: z.array(kapsulSchema),
    navigation: z.object({
      prev: z.string(),
      next: z.string(),
    }),
  }),
});

export const collections = { missions };
