"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { CopyIconButton } from "./CopyIconButton";
import { StatusBadge } from "./StatusBadge";
import { categoryLabel, formatDate, type SkillSummary } from "@/lib/registry";

type Sort = "updated" | "alpha";

const selectClass =
  "w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg";

export function SkillBrowser({ skills }: { skills: SkillSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<Sort>("updated");
  const searchRef = useRef<HTMLInputElement>(null);

  // Atalho "/" foca a busca, exceto quando o foco já está num campo de texto.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typing) return;
      e.preventDefault();
      searchRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const categories = useMemo(() => [...new Set(skills.map((s) => s.category))].sort(), [skills]);
  const tags = useMemo(() => [...new Set(skills.flatMap((s) => s.tags))].sort(), [skills]);
  const statuses = useMemo(() => [...new Set(skills.map((s) => s.status))], [skills]);

  const fuse = useMemo(
    () =>
      new Fuse(skills, {
        keys: [
          { name: "slug", weight: 3 },
          { name: "title", weight: 3 },
          { name: "tags", weight: 2 },
          { name: "description", weight: 1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [skills],
  );

  const visible = useMemo(() => {
    const base = query.trim() ? fuse.search(query.trim()).map((r) => r.item) : skills;
    const filtered = base.filter(
      (s) =>
        (!category || s.category === category) &&
        (!tag || s.tags.includes(tag)) &&
        (!status || s.status === status),
    );
    if (query.trim()) return filtered; // busca mantém a ordem de relevância
    return [...filtered].sort((a, b) =>
      sort === "alpha"
        ? a.title.localeCompare(b.title, "pt-BR")
        : b.updated.localeCompare(a.updated) || a.title.localeCompare(b.title, "pt-BR"),
    );
  }, [skills, fuse, query, category, tag, status, sort]);

  const hasFilters = Boolean(query || category || tag || status);

  return (
    <section aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="font-serif text-2xl">
        Skills
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
        <div>
          <label htmlFor="skill-search" className="sr-only">
            Buscar skills por nome, descrição ou tag
          </label>
          <div className="relative">
            <input
              ref={searchRef}
              id="skill-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, descrição ou tag"
              autoComplete="off"
              className="w-full rounded-md border border-line bg-surface py-2.5 pl-3 pr-10 text-fg placeholder:text-muted"
            />
            <kbd
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line px-1.5 font-mono text-xs text-muted md:block"
            >
              /
            </kbd>
          </div>
          <p className="mt-1 text-xs text-muted md:hidden">Toque para buscar</p>
        </div>

        <div className="flex items-center gap-2 text-sm" role="group" aria-label="Ordenação">
          <span className="text-muted">Ordenar:</span>
          {(
            [
              ["updated", "Mais recentes"],
              ["alpha", "A–Z"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={sort === value}
              onClick={() => setSort(value)}
              className={`rounded-md px-3 py-1.5 ${
                sort === value ? "bg-surface text-fg ring-1 ring-line" : "text-muted hover:text-fg"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="text-xs text-muted">
          Categoria
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${selectClass} mt-1`}>
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Tag
          <select value={tag} onChange={(e) => setTag(e.target.value)} className={`${selectClass} mt-1`}>
            <option value="">Todas</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${selectClass} mt-1`}>
            <option value="">Todos</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p role="status" aria-live="polite" className="mt-4 text-sm text-muted">
        {visible.length === 1 ? "1 skill" : `${visible.length} skills`}
        {hasFilters && " encontradas"}
      </p>

      {visible.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-line p-8 text-center">
          <p>Nenhuma skill corresponde à busca.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("");
              setTag("");
              setStatus("");
            }}
            className="mt-3 text-accent-2 underline underline-offset-4"
          >
            Limpar busca e filtros
          </button>
        </div>
      ) : (
        <ol className="mt-2 divide-y divide-line border-y border-line">
          {visible.map((skill, i) => (
            <li key={skill.slug} className="group relative grid grid-cols-[2rem_1fr_auto] items-start gap-x-3 gap-y-1 py-4 hover:bg-surface/60 md:grid-cols-[2.5rem_1fr_auto_auto_2.25rem] md:items-center md:px-2">
              <span className="pt-0.5 font-mono text-sm tabular-nums text-muted md:pt-0">
                {i + 1}
              </span>
              <div className="min-w-0">
                <Link
                  href={`/s/${skill.slug}/`}
                  className="font-serif text-lg text-fg after:absolute after:inset-0 after:content-[''] hover:text-accent"
                >
                  {skill.title}
                </Link>
                <p className="truncate text-sm text-muted">{skill.description}</p>
                {skill.tags.length > 0 && (
                  <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted" aria-label="Tags">
                    {skill.tags.map((t) => (
                      <li key={t} className="font-mono">
                        #{t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="justify-self-end md:justify-self-auto">
                <StatusBadge status={skill.status} />
              </div>
              <time
                dateTime={skill.updated}
                className="col-start-2 text-xs text-muted md:col-start-auto md:text-sm md:tabular-nums"
              >
                {formatDate(skill.updated)}
              </time>
              <div className="relative z-10 col-start-3 row-start-2 justify-self-end md:col-start-auto md:row-start-auto">
                <CopyIconButton command={skill.installCommand} label={skill.title} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
