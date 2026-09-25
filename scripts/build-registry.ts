// SKILL.md + packs/*.yaml -> apps/web/public/registry.json
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import { z } from 'zod'
import { catalogConfig } from '../catalog.config.ts'

const ROOT = resolve(import.meta.dirname, '..')
const SKILLS_DIR = join(ROOT, 'skills')
const PACKS_DIR = join(ROOT, 'packs')
const OUT_FILE = join(ROOT, 'apps/web/public/registry.json')

const kebab = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'deve ser kebab-case')

// gray-matter/js-yaml parseia datas ISO como Date; normaliza para YYYY-MM-DD
const isoDate = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'deve ser YYYY-MM-DD'),
)

const frontmatterSchema = z.object({
  name: kebab,
  description: z.string().min(20).max(1024),
  metadata: z.object({
    title: z.string().optional(),
    category: z.enum(catalogConfig.categories),
    tags: z.array(kebab).max(8).default([]),
    agents: z.array(z.enum(catalogConfig.agents)).default(['claude-code']),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, 'deve ser semver (ex.: 1.2.0)'),
    status: z.enum(catalogConfig.statuses),
    language: z.string().optional(),
    visibility: z.enum(['public', 'hidden']).default('public'),
    updated: isoDate,
  }),
})

const packSchema = z.object({
  id: kebab,
  title: z.string().min(1),
  description: z.string().min(1),
  skills: z.array(kebab).min(1),
})

const { owner, repo, githubUrl, skillsShBase } = catalogConfig
const repoSlug = `${owner}/${repo}`

class BuildError extends Error {}

function fail(file: string, err: z.ZodError): never {
  const lines = err.issues.map((i) => `  - ${i.path.join('.') || '(raiz)'}: ${i.message}`)
  throw new BuildError(`${relative(ROOT, file)}\n${lines.join('\n')}`)
}

function listFiles(dir: string): string[] {
  return readdirSync(dir)
    .flatMap((entry) => {
      const full = join(dir, entry)
      return statSync(full).isDirectory() ? listFiles(full) : [full]
    })
    .filter((f) => !f.endsWith('.gitkeep'))
}

function titleCase(slug: string) {
  return slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')
}

function buildSkills() {
  const skills = []
  for (const dirName of readdirSync(SKILLS_DIR).sort()) {
    const dir = join(SKILLS_DIR, dirName)
    if (!statSync(dir).isDirectory()) continue
    const file = join(dir, 'SKILL.md')
    if (!existsSync(file)) throw new BuildError(`${relative(ROOT, dir)}: SKILL.md não encontrado`)

    const { data, content } = matter(readFileSync(file, 'utf8'))
    const parsed = frontmatterSchema.safeParse(data)
    if (!parsed.success) fail(file, parsed.error)
    const { name, description, metadata } = parsed.data

    if (name !== dirName) {
      throw new BuildError(`${relative(ROOT, file)}\n  - name: "${name}" deve ser igual ao nome da pasta "${dirName}"`)
    }
    if (metadata.visibility === 'hidden') continue

    skills.push({
      slug: name,
      name,
      description,
      ...metadata,
      title: metadata.title ?? titleCase(name),
      files: listFiles(dir).map((f) => relative(dir, f).split(sep).join('/')).sort(),
      content: content.trim(),
      installCommands: {
        repository: `npx skills add ${repoSlug}`,
        skill: `npx skills add ${repoSlug} --skill ${name}`,
        manual: `git clone ${githubUrl} && cp -r skills/skills/${name} ~/.claude/skills/`,
      },
      githubUrl: `${githubUrl}/tree/main/skills/${name}`,
      skillsShUrl: `${skillsShBase}/${name}`,
    })
  }
  return skills
}

function buildPacks(skillSlugs: Set<string>) {
  const packs = []
  for (const f of readdirSync(PACKS_DIR).filter((f) => /\.ya?ml$/.test(f)).sort()) {
    const file = join(PACKS_DIR, f)
    const parsed = packSchema.safeParse(parseYaml(readFileSync(file, 'utf8')))
    if (!parsed.success) fail(file, parsed.error)
    const missing = parsed.data.skills.filter((s) => !skillSlugs.has(s))
    if (missing.length) {
      throw new BuildError(`${relative(ROOT, file)}\n  - skills: não encontradas: ${missing.join(', ')}`)
    }
    packs.push({
      ...parsed.data,
      installCommands: {
        repository: `npx skills add ${repoSlug}`,
        skills: parsed.data.skills.map((s) => `npx skills add ${repoSlug} --skill ${s}`),
      },
    })
  }
  return packs
}

try {
  const skills = buildSkills().sort((a, b) => b.updated.localeCompare(a.updated) || a.slug.localeCompare(b.slug))
  const packs = buildPacks(new Set(skills.map((s) => s.slug)))
  const registry = {
    generatedAt: new Date().toISOString(),
    owner,
    repo,
    counts: { skills: skills.length, packs: packs.length },
    skills,
    packs,
  }
  mkdirSync(join(OUT_FILE, '..'), { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify(registry, null, 2) + '\n')
  console.log(`registry.json: ${skills.length} skills, ${packs.length} packs`)
} catch (e) {
  if (e instanceof BuildError) {
    console.error(`Erro de validação:\n${e.message}`)
    process.exit(1)
  }
  throw e
}
