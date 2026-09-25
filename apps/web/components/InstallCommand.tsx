"use client";

import { useId, useRef, useSyncExternalStore } from "react";
import { useCopy } from "./useCopy";

export interface InstallTab {
  id: string;
  label: string;
  command: string;
}

const STORAGE_KEY = "skills:install-tab";
const EVENT = "skills:install-tab-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function readStoredTab(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTab(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage indisponível: a aba só vale nesta página.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function InstallCommand({
  tabs,
  defaultTab,
}: {
  tabs: InstallTab[];
  defaultTab?: string;
}) {
  const uid = useId();
  const codeRef = useRef<HTMLElement>(null);
  const { copied, copy } = useCopy();

  const stored = useSyncExternalStore(subscribe, readStoredTab, () => null);
  const activeId =
    tabs.find((t) => t.id === stored)?.id ?? defaultTab ?? tabs[0].id;
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className="w-full">
      {tabs.length > 1 && (
        <div role="tablist" aria-label="Forma de instalação" className="mb-2 flex gap-1">
          {tabs.map((tab) => {
            const selected = tab.id === active.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${uid}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => storeTab(tab.id)}
                onKeyDown={(e) => {
                  const i = tabs.indexOf(tab);
                  const next =
                    e.key === "ArrowRight" ? tabs[(i + 1) % tabs.length]
                    : e.key === "ArrowLeft" ? tabs[(i - 1 + tabs.length) % tabs.length]
                    : null;
                  if (next) {
                    e.preventDefault();
                    storeTab(next.id);
                    document.getElementById(`${uid}-tab-${next.id}`)?.focus();
                  }
                }}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? "bg-surface text-fg ring-1 ring-line"
                    : "text-muted hover:text-fg"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <div
        role={tabs.length > 1 ? "tabpanel" : undefined}
        id={`${uid}-panel`}
        aria-labelledby={tabs.length > 1 ? `${uid}-tab-${active.id}` : undefined}
      >
        <button
          type="button"
          aria-label="Copiar comando de instalação"
          onClick={() => copy(active.command, codeRef.current)}
          className="group flex w-full items-center gap-3 rounded-lg border border-line bg-surface px-4 py-3 text-left font-mono text-sm transition-colors hover:border-accent"
        >
          <span aria-hidden className="select-none text-accent">$</span>
          <code
            ref={codeRef}
            className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-0.5"
          >
            {active.command}
          </code>
          <span
            aria-hidden
            className={`shrink-0 text-xs ${copied ? "text-ok" : "text-muted group-hover:text-fg"}`}
          >
            {copied ? "Copiado!" : "Copiar"}
          </span>
        </button>
        <p role="status" aria-live="polite" className="sr-only">
          {copied ? "Copiado!" : ""}
        </p>
      </div>

      <p className="mt-2 text-xs text-muted">
        O CLI envia telemetria anônima. Para desativar, use{" "}
        <code className="font-mono">DISABLE_TELEMETRY=1</code>.
      </p>
    </div>
  );
}
