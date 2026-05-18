import { getCollection } from "astro:content";

export type Locale = "en" | "es" | "eu";

export const locales: Record<Locale, { label: string; path: string }> = {
  en: { label: "English", path: "/en/" },
  es: { label: "Español", path: "/es/" },
  eu: { label: "Euskara", path: "/eu/" }
};

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
  const byOrderAsc = (items: any[]) => items.sort((a, b) => a.data.order - b.data.order);
  const yearScore = (value: unknown) => {
    const text = String(value ?? "");

    if (/present|actualidad|gaur egun/i.test(text)) {
      return 9999;
    }

    const years = text.match(/\b(19|20)\d{2}\b/g)?.map(Number) ?? [];
    return years.length ? Math.max(...years) : 0;
  };
  const byDateDesc = (items: any[], primary: "year" | "period" | "end" = "year") =>
    items.sort((a, b) => {
      const aPrimary = yearScore(a.data[primary]);
      const bPrimary = yearScore(b.data[primary]);
      const primaryDelta = bPrimary - aPrimary;

      if (primaryDelta !== 0) {
        return primaryDelta;
      }

      const aStart = yearScore(a.data.start);
      const bStart = yearScore(b.data.start);
      const startDelta = bStart - aStart;

      if (startDelta !== 0) {
        return startDelta;
      }

      return (b.data.order ?? 0) - (a.data.order ?? 0);
    });

  const byKind = {
    profile: entries.find((entry) => entry.data.kind === "profile") as any,
    experience: byDateDesc(byKindName("experience"), "end"),
    education: byDateDesc(byKindName("education"), "period"),
    skills: byOrderAsc(byKindName("skills")),
    projects: byDateDesc(byKindName("project")),
    talks: byDateDesc(byKindName("talk")),
    appearances: byDateDesc(byKindName("appearance")),
    awards: byDateDesc(byKindName("award")),
    publications: byDateDesc(byKindName("publication"))
  };

  if (!byKind.profile) {
    throw new Error(`Missing profile content for locale ${locale}`);
  }

  return byKind;
}
