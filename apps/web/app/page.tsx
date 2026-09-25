import { Banner } from "@/components/Banner";
import { InstallCommand } from "@/components/InstallCommand";
import { SkillBrowser } from "@/components/SkillBrowser";
import { formatDate } from "@/lib/labels";
import {
  counts,
  getSummaries,
  lastUpdated,
  repositoryCommand,
  skillsShBase,
} from "@/lib/registry";

export default function HomePage() {
  const summaries = getSummaries();

  return (
    <>
      <section className="pb-12 pt-8 sm:pt-14">
        <h1 className="sr-only">Nico Skills</h1>
        <div className="mb-8">
          <Banner />
        </div>
        <p className="max-w-[52ch] font-serif text-xl leading-snug sm:text-2xl">
          Minhas skills pessoais de agentes, direto do repositório público para o seu Claude Code, Cursor ou Codex.
        </p>
        <div className="mt-6 max-w-2xl">
          <InstallCommand tabs={[{ id: "repository", label: "Repositório", command: repositoryCommand }]} />
        </div>

        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="text-sm text-muted">Skills</dt>
            <dd className="font-serif text-3xl tabular-nums">{counts.skills}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Packs</dt>
            <dd className="font-serif text-3xl tabular-nums">{counts.packs}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Última atualização</dt>
            <dd className="font-serif text-3xl tabular-nums">{formatDate(lastUpdated())}</dd>
          </div>
        </dl>
      </section>

      <SkillBrowser skills={summaries} />

      <section aria-labelledby="skills-sh-heading" className="mt-20">
        <h2 id="skills-sh-heading" className="font-serif text-2xl">
          Encontre no skills.sh
        </h2>
        <p className="mt-2 max-w-[60ch] text-muted">
          O <a className="text-accent-2 underline underline-offset-4" href="https://www.skills.sh/">skills.sh</a> é o
          diretório aberto de skills. Há três caminhos para chegar às minhas.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 [overflow-wrap:anywhere] md:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg">Buscar pelo nome</h3>
            <p className="mt-1 text-sm text-muted">
              No skills.sh, pressione <kbd className="rounded border border-line px-1 font-mono text-xs">/</kbd> e
              digite o nome da skill ou o dono, <span className="font-mono">robertourias</span>.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg">Abrir a URL direta</h3>
            <p className="mt-1 break-words text-sm text-muted">
              As páginas seguem o formato{" "}
              <span className="font-mono text-xs text-fg">{skillsShBase}/&lt;skill&gt;</span>. Cada skill deste
              catálogo tem o link pronto.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-lg">Instalar sem passar por lá</h3>
            <p className="mt-1 text-sm text-muted">
              O comando <span className="font-mono text-xs text-fg">{repositoryCommand}</span> funciona mesmo se a
              skill ainda não aparecer no diretório.
            </p>
          </div>
        </div>
        <p className="mt-6 max-w-[60ch] border-l-2 border-line pl-4 text-sm text-muted">
          O ranking do skills.sh vem da telemetria anônima do CLI, gerada a cada instalação. Uma skill nova pode
          levar algum tempo para ser listada.
        </p>
      </section>
    </>
  );
}
