# Modo Retroativo — gerando diagramas a partir de um projeto existente

Objetivo: em vez de o usuário DESCREVER a arquitetura, você EXTRAI a arquitetura escaneando o código/config real do projeto e gera o diagrama a partir disso. Isso é o mais valioso quando o projeto já existe há tempo e ninguém documentou (o caso mais comum no dia a dia do Beto: infra na VPS, múltiplos projetos Next.js/NestJS, schema.prisma já rodando).

## Passo 1 — Descobrir o que existe

Antes de qualquer coisa, rode um scan rápido da estrutura do repo (via `view` do diretório, ou `bash_tool` com `find`/`ls` se estiver no Claude Code com acesso ao filesystem real do usuário). Procure especificamente por:

| Arquivo/pasta | O que revela | Diagrama alimentado |
|---|---|---|
| `package.json` (raiz + workspaces) | Stack, monorepo ou não, scripts de build/deploy | Arquitetura de projeto |
| `docker-compose.yml` / `Dockerfile` | Serviços, portas, volumes, redes, dependências entre containers | Arquitetura de infra |
| `traefik.yml` / labels do Traefik no compose | Roteamento por domínio/subdomínio, certificados | Arquitetura de infra |
| `prisma/schema.prisma` | Modelos, campos, relações, enums | ERD |
| `.env.example` | Serviços externos integrados (chaves de API = pistas de System_Ext) | C4 Contexto |
| Pasta `app/` ou `pages/` (Next.js) | Rotas, estrutura de páginas | Arquitetura de projeto / Flowchart de navegação |
| Pasta `src/modules/` ou `src/controllers/` (NestJS) | Módulos, endpoints, camadas | C4 Componente / Arquitetura de projeto |
| `docs/`, `README.md`, `CLAUDE.md` | Contexto já documentado (não redescobrir o que já está escrito) | Todos — ler primeiro pra não duplicar trabalho |
| GitHub Actions (`.github/workflows/`) | Pipeline de CI/CD | Sequence diagram do deploy (opcional) |
| Chamadas HTTP no código (fetch/axios entre serviços) | Comunicação real entre containers/serviços | Sequence diagram / C4 Container |

## Passo 2 — Priorizar por esforço x valor

Nem tudo precisa virar diagrama. Ordem de prioridade recomendada quando o usuário pede "documenta esse projeto" de forma aberta:

1. **ERD** a partir do `schema.prisma` — é o mais rápido de extrair com 100% de fidelidade (o schema já é estruturado) e geralmente o que mais falta.
2. **Arquitetura de infra** a partir do `docker-compose.yml` + labels do Traefik — segunda maior fonte de verdade estruturada.
3. **C4 Container** — cruzando `package.json` (quais apps existem) com o que foi descoberto no compose (onde cada um roda).
4. **Arquitetura de projeto** — a partir da estrutura de pastas real.
5. **Sequence diagrams** — só para fluxos específicos que o usuário apontar (auth, um endpoint complexo, integração com terceiro) — não vale tentar gerar sequence de tudo automaticamente, isso exige ler lógica de negócio real, não só estrutura.

## Passo 3 — Ao gerar, sempre distinga fato de suposição

Ao escanear código real, você vai encontrar coisas certas (ex: "existe um container chamado `fitflow` no compose expondo a porta 3000") e coisas que precisam de confirmação (ex: relação de negócio entre duas tabelas que não está 100% explícita no schema). Regra:
- O que veio direto de um arquivo de config estruturado (docker-compose, schema.prisma) → trate como fato, coloque no diagrama sem ressalva.
- O que você inferiu de nomes de pasta/variável ou de lógica espalhada no código → marque mentalmente como suposição e, ao entregar o diagrama, avise em 1-2 linhas o que foi inferido, pra o usuário confirmar antes de commitar o diagrama como documentação oficial.

## Passo 4 — Workflow sugerido pra rodar isso no Claude Code

Como o Beto já usa a convenção `CLAUDE.md` / `.claude/skills/` / `.claude/commands/`, o jeito mais fluido de usar isso no dia a dia:

1. Criar um command tipo `/diagram-infra` ou `/diagram-erd` em `.claude/commands/` que aciona esse fluxo de scan + geração automaticamente, sem precisar reexplicar toda vez.
2. Salvar a saída sempre em `docs/diagrams/<tipo>-<nome-do-projeto>.md`, versionado no repo.
3. Re-rodar o scan periodicamente (ex: antes de um review de arquitetura, ou quando a infra mudar) pra manter o diagrama sincronizado com a realidade — diagrama desatualizado é pior que não ter diagrama, porque engana.
4. Para múltiplos projetos sob a mesma VPS (como é o caso do Beto: Hermes, FitFlow, Finance, etc.), vale um diagrama de infra "guarda-chuva" (todos os containers na mesma VPS) e diagramas de C4/ERD individuais por projeto — não misturar os dois níveis.

## Passo 5 — O que perguntar quando faltar informação

Se o scan não for suficiente pra entender uma relação (ex: dois serviços claramente se comunicam mas você não achou onde no código), NÃO invente — pergunte objetivamente: "Encontrei os containers X e Y no compose, mas não achei a chamada entre eles no código — eles se comunicam diretamente ou só através do Y?" Isso evita gerar documentação errada que parece certa.
