import { defineCollection, z } from "astro:content";

const profile = z.object({
  title: z.string(),
  role: z.string(),
  location: z.string(),
  email: z.string().email(),
  linkedin: z.string().url(),
  cv: z.string(),
  summary: z.string(),
  highlights: z.array(z.string())
});

const experience = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string(),
  order: z.number(),
  technologies: z.array(z.string()).default([])
});

const education = z.object({
  degree: z.string(),
  institution: z.string(),
  location: z.string(),
  period: z.string(),
  order: z.number(),
  note: z.string().optional()
});

const datedItem = z.object({
  title: z.string(),
  organization: z.string().optional(),
  year: z.number().optional(),
  url: z.string().optional(),
  order: z.number()
});

const skillGroup = z.object({
  title: z.string(),
  order: z.number(),
  skills: z.array(z.string())
});

const contentSchema = z.discriminatedUnion("kind", [
  profile.extend({ kind: z.literal("profile") }),
  experience.extend({ kind: z.literal("experience") }),
  education.extend({ kind: z.literal("education") }),
  datedItem.extend({ kind: z.literal("project") }),
  datedItem.extend({ kind: z.literal("talk") }),
  datedItem.extend({ kind: z.literal("appearance") }),
  datedItem.extend({ kind: z.literal("award") }),
  datedItem.extend({ kind: z.literal("publication") }),
  skillGroup.extend({ kind: z.literal("skills") })
]);

const localized = defineCollection({
  type: "content",
  schema: contentSchema
});

export const collections = {
  en: localized,
  es: localized,
  eu: localized
};
