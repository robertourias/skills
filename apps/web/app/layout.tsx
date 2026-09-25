import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { githubUrl } from "@/lib/registry";
import "./globals.css";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Nico Skills — catálogo de skills de agentes",
    template: "%s · Nico Skills",
  },
  description:
    "Catálogo das minhas skills pessoais de agentes. Busque, leia e instale com um comando: npx skills add robertourias/skills.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
        >
          Ir para o conteúdo
        </a>
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="font-mono text-sm text-fg hover:text-accent">
            nico.skills
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-fg"
          >
            GitHub
          </a>
        </header>
        <main id="conteudo" className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-line">
          <p className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted sm:px-6">
            Skills de{" "}
            <a href={githubUrl} className="underline underline-offset-4 hover:text-fg">
              robertourias/skills
            </a>
            . Instale com o CLI do{" "}
            <a href="https://www.skills.sh/" className="underline underline-offset-4 hover:text-fg">
              skills.sh
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
