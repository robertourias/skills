export const catalogConfig = {
  owner: 'robertourias',
  repo: 'skills',
  siteUrl: 'https://skills.nico.dev.br',
  githubUrl: 'https://github.com/robertourias/skills',
  skillsShBase: 'https://www.skills.sh/robertourias/skills',
  categories: ['documentation', 'writing', 'product', 'design'],
  agents: ['claude-code', 'cursor', 'codex'],
  statuses: ['stable', 'beta', 'draft'],
} as const

export type Category = (typeof catalogConfig.categories)[number]
export type Agent = (typeof catalogConfig.agents)[number]
export type Status = (typeof catalogConfig.statuses)[number]
