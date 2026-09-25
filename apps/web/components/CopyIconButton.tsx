"use client";

import { useCopy } from "./useCopy";

export function CopyIconButton({ command, label }: { command: string; label: string }) {
  const { copied, copy } = useCopy();

  return (
    <>
      <button
        type="button"
        aria-label={`Copiar comando de instalação de ${label}`}
        title={copied ? "Copiado!" : command}
        onClick={() => copy(command)}
        className="grid size-9 place-items-center rounded-md border border-line text-muted transition-colors hover:border-accent hover:text-fg md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
      >
        {copied ? (
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-ok" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
          </svg>
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copiado!" : ""}
      </span>
    </>
  );
}
