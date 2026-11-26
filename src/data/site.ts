// Facts about the site itself (facts about Tiziano live in profile.ts).

/** Year and month, e.g. "2026-11". */
export type YearMonth = `${number}-${"01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12"}`;

export const siteData: { lastUpdated: YearMonth } = {
  /**
   * When the content last changed, shown in every page footer as "Last updated".
   * Bump it whenever you edit content (src/data/, src/i18n/ui.ts, the CV PDF): a deploy alone does not change it.
   */
  lastUpdated: "2026-11",
};
