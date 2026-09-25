import registryJson from "../public/registry.json";
import type { SkillStatus } from "./labels";

export type { SkillStatus };

export interface SkillEntry {
  slug: string;
  name: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  agents: string[];
  version: string;
  status: SkillStatus;
  updated: string;
  files: string[];
  content: string;
  installCommands: { repository: string; skill: string; manual: string };
  githubUrl: string;
  skillsShUrl: string;
}

/** Campos leves enviados ao cliente. O conteúdo completo só vai para a página de detalhe. */
export type SkillSummary = Pick<
  SkillEntry,
  "slug" | "title" | "description" | "category" | "tags" | "status" | "updated"
> & { installCommand: string };

interface Registry {
  generatedAt: string;
  githubUrl: string;
  skillsShBase: string;
  installCommands: { repository: string };
  counts: { skills: number; packs: number };
  skills: SkillEntry[];
  packs: { id: string; title: string; description: string; skills: string[] }[];
}

const registry = registryJson as unknown as Registry;

export const repositoryCommand = registry.installCommands.repository;
export const githubUrl = registry.githubUrl;
export const skillsShBase = registry.skillsShBase;
export const counts = registry.counts;

export function getSkills(): SkillEntry[] {
  return registry.skills;
}

export function getSkill(slug: string): SkillEntry | undefined {
  return registry.skills.find((s) => s.slug === slug);
}

export function getSummaries(): SkillSummary[] {
  return registry.skills.map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
    category: s.category,
    tags: s.tags,
    status: s.status,
    updated: s.updated,
    installCommand: s.installCommands.skill,
  }));
}

export function lastUpdated(): string {
  return registry.skills.map((s) => s.updated).sort().at(-1) ?? "";
}
