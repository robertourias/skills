// Helpers puros, sem dados do registry: seguros para importar em Client Components.
export type SkillStatus = "stable" | "beta" | "draft";

const CATEGORY_LABELS: Record<string, string> = {
  documentation: "Documentação",
  writing: "Escrita",
  product: "Produto",
  design: "Design",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export const STATUS_LABELS: Record<SkillStatus, string> = {
  stable: "Estável",
  beta: "Beta",
  draft: "Rascunho",
};

/** YYYY-MM-DD -> DD/MM/YYYY sem passar por fuso horário. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
