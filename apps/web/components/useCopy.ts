"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FEEDBACK_MS = 2000;

/**
 * Copia texto para a área de transferência e expõe `copied` por 2 s.
 * Se a API falhar, seleciona o conteúdo de `fallbackEl` para cópia manual.
 */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async (text: string, fallbackEl?: HTMLElement | null) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), FEEDBACK_MS);
    } catch {
      if (fallbackEl) {
        const range = document.createRange();
        range.selectNodeContents(fallbackEl);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, []);

  return { copied, copy };
}
