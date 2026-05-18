import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const root = process.cwd();
const contentRoot = path.join(root, "src", "content");
const locales = ["en", "es", "eu"];

const schema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("profile"),
    title: z.string().min(1),
    role: z.string().min(1),
    location: z.string().min(1),
    email: z.string().email(),
    linkedin: z.string().url(),
    cv: z.string().startsWith("/"),
    summary: z.string().min(1),
    highlights: z.array(z.string().min(1)).min(1)
  }),
  z.object({
    kind: z.literal("experience"),
    title: z.string().min(1),
    company: z.string().min(1),
    location: z.string().min(1),
    start: z.string().min(1),
    end: z.string().min(1),
    order: z.number(),
    technologies: z.array(z.string()).optional()
  }),
  z.object({
    kind: z.literal("education"),
    degree: z.string().min(1),
    institution: z.string().min(1),
    location: z.string().min(1),
    period: z.string().min(1),
    order: z.number(),
    note: z.string().optional()
  }),
  z.object({
    kind: z.enum(["project", "talk", "appearance", "award", "publication"]),
    title: z.string().min(1),
    organization: z.string().optional(),
    year: z.number().optional(),
    url: z.string().min(1).optional(),
    order: z.number()
  }),
  z.object({
    kind: z.literal("skills"),
    title: z.string().min(1),
    order: z.number(),
    skills: z.array(z.string().min(1)).min(1)
  })
]);

let failed = false;

for (const locale of locales) {
  const dir = path.join(contentRoot, locale);
  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
  const kinds = new Set();

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const parsed = matter.read(fullPath);
    const result = schema.safeParse(parsed.data);

    if (!result.success) {
      failed = true;
      console.error(`Invalid frontmatter in ${path.relative(root, fullPath)}`);
      console.error(result.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n"));
    } else {
      kinds.add(result.data.kind);
    }
  }

  for (const required of ["profile", "experience", "education", "skills", "project"]) {
    if (!kinds.has(required)) {
      failed = true;
      console.error(`Missing ${required} content for locale ${locale}`);
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("Content validation passed.");
