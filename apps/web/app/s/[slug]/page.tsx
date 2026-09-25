import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileTree } from "@/components/FileTree";
import { InstallCommand } from "@/components/InstallCommand";
import { SkillMarkdown } from "@/components/SkillMarkdown";
import { StatusBadge } from "@/components/StatusBadge";
import { categoryLabel, formatDate } from "@/lib/labels";
import { getSkill, getSkills } from "@/lib/registry";

export function generateStaticParams() {
  return getSkills().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/s/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) return {};
  return { title: skill.title, description: skill.description };
}

export default async function SkillPage({ params }: PageProps<"/s/[slug]">) {
  const { slug } = await params;
  const skill = getSkill(slug);
  if (!skill) notFound();

  const tabs = [
    { id: "skill", label: "Esta skill", command: skill.installCommands.skill },
    { id: "repository", label: "Repositório", command: skill.installCommands.repository },
    { id: "manual", label: "Manual", command: skill.installCommands.manual },
  ];

  return (
    <article className="pt-4">
      <Link href="/" className="text-sm text-muted hover:text-fg">
        ← Todas as skills
      </Link>

      <header className="mt-6">
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{skill.title}</h1>
        <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs" aria-label="Metadados">
          <li className="rounded-full border border-line px-2 py-0.5 text-muted">{categoryLabel(skill.category)}</li>
          <li>
            <StatusBadge status={skill.status} />
          </li>
          <li className="rounded-full border border-line px-2 py-0.5 font-mono text-muted">v{skill.version}</li>
          {skill.agents.map((agent) => (
            <li key={agent} className="rounded-full border border-line px-2 py-0.5 font-mono text-muted">
              {agent}
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-[65ch] text-lg leading-relaxed text-muted">{skill.description}</p>
      </header>

      <div className="mt-8 max-w-3xl">
        <InstallCommand tabs={tabs} defaultTab="skill" />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <section aria-labelledby="skill-md-heading">
          <h2 id="skill-md-heading" className="sr-only">
            Conteúdo do SKILL.md
          </h2>
          <SkillMarkdown>{skill.content}</SkillMarkdown>
        </section>

        <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
          <section aria-labelledby="files-heading">
            <h2 id="files-heading" className="mb-3 font-serif text-lg">
              Arquivos
            </h2>
            <FileTree slug={skill.slug} files={skill.files} />
          </section>

          <section aria-labelledby="links-heading">
            <h2 id="links-heading" className="mb-3 font-serif text-lg">
              Links
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={skill.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-2 underline underline-offset-4"
                >
                  Ver no GitHub
                </a>
              </li>
              <li>
                <a
                  href={skill.skillsShUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-2 underline underline-offset-4"
                >
                  Ver no skills.sh
                </a>
              </li>
            </ul>
            <p className="mt-3 text-xs text-muted">
              A listagem no skills.sh depende de instalações e pode demorar a aparecer.
            </p>
          </section>

          <p className="text-xs text-muted">
            Atualizada em <time dateTime={skill.updated}>{formatDate(skill.updated)}</time>
          </p>
        </aside>
      </div>
    </article>
  );
}
