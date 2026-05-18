import { getCollection } from "astro:content";

export type Locale = "en" | "es";

export const locales: Record<Locale, { label: string; path: string; switchLabel: string }> = {
  en: { label: "English", path: "/en/", switchLabel: "Español" },
  es: { label: "Español", path: "/es/", switchLabel: "English" }
};

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}

export function withBase(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith("mailto:")) {
    return path;
  }

  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}` || "/";
}

export async function getSiteContent(locale: Locale) {
  const entries = await getCollection(locale);
  const byKindName = (kind: string) => entries.filter((entry) => entry.data.kind === kind) as any[];
  const byOrderDesc = (items: any[]) => items.sort((a, b) => b.data.order - a.data.order);
  const byOrderAsc = (items: any[]) => items.sort((a, b) => a.data.order - b.data.order);

  const byKind = {
    profile: entries.find((entry) => entry.data.kind === "profile") as any,
    experience: byOrderDesc(byKindName("experience")),
    education: byOrderDesc(byKindName("education")),
    skills: byOrderAsc(byKindName("skills")),
    projects: byOrderDesc(byKindName("project")),
    talks: byOrderDesc(byKindName("talk")),
    appearances: byOrderDesc(byKindName("appearance")),
    awards: byOrderDesc(byKindName("award")),
    publications: byOrderDesc(byKindName("publication"))
  };

  if (!byKind.profile) {
    throw new Error(`Missing profile content for locale ${locale}`);
  }

  return byKind;
}
