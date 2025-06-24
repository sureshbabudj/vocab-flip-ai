import { z } from "zod";

export const translationSchema = z.object({
  translation: z.string(),
  example: z
    .object({
      original: z.string(),
      translated: z.string(),
    })
    .optional(),
  verbForms: z.array(z.string()).optional(),
  otherTranslations: z.array(z.string()).optional(),
  synonyms: z.array(z.string()).optional(),
});

export type TranslationSchema = z.infer<typeof translationSchema>;
