---
name: mermaid-diagrams
description: >-
  Creates and maintains technical diagrams in Mermaid - C4 (context/container/component),
  flowcharts, project architecture (frontend/backend), infrastructure architecture
  (Docker/Traefik/VPS/network), ERD (database modeling) and sequence diagrams
  for system design. Use this skill whenever the user asks to create a diagram,
  draw the architecture, model the database, map the flow, document the infra, C4 model,
  ERD, system design or similar ("criar diagrama", "desenhar arquitetura", "modelar o banco",
  "documentar a infra") - including vague requests like "documenta
  esse projeto visualmente". Also covers RETROACTIVE mode - scanning an existing
  project/repo (code, docker-compose, schema.prisma, API routes) and generating the
  matching diagrams from what already exists, without the user having to
  describe the architecture manually.
metadata:
  title: Mermaid Diagrams
  category: documentation
  tags: [mermaid, c4, erd, architecture, retroactive]
  agents: [claude-code]
  version: 1.0.0
  status: beta
  language: en
  visibility: public
  updated: 2026-09-25
---

# Mermaid Diagrams

Skill para criar diagramas técnicos em Mermaid (texto → diagrama), tanto do zero quanto de forma retroativa a partir de um projeto/repo já existente. Mermaid foi escolhido como padrão porque é texto puro — versiona no git, renderiza nativo no GitHub/Notion/Obsidian, e é o formato mais fácil de gerar/editar via LLM (ao contrário de `.drawio` que é XML verboso).

## Quando usar cada tipo de diagrama

| O usuário quer... | Tipo de diagrama | Referência |
|---|---|---|
| Visão macro do sistema, quem interage com o quê (usuários, sistemas externos, APIs) | C4 Contexto/Container | `references/c4.md` |
| Detalhar módulos/serviços internos de um container específico | C4 Componente | `references/c4.md` |
| Fluxo de decisão, processo, lógica de negócio, jornada do usuário | Flowchart | `references/flowchart.md` |
| Arquitetura de código (camadas, módulos, dependências do projeto) | Flowchart / graph (arquitetura de projeto) | `references/architecture-project.md` |
| Infra: VPS, Docker, Traefik, containers, rede, domínios | Flowchart (arquitetura de infra) | `references/architecture-infra.md` |
| Modelagem de banco de dados, tabelas, relacionamentos | ERD (`erDiagram`) | `references/erd.md` |
| Fluxo de chamadas entre serviços/API ao longo do tempo, auth flow, request lifecycle | Sequence Diagram | `references/system-design.md` |
| Gerar diagrama a partir de um projeto que já existe (sem descrição manual) | Modo retroativo | `references/retroactive.md` |

Sempre que o pedido não deixar claro qual tipo se encaixa melhor, pergunte ou proponha o mais provável com base no contexto (ex: "modelar o banco" → ERD; "mapear a infra da VPS" → arquitetura de infra).

## Fluxo de trabalho

1. **Identifique o tipo de diagrama** pela tabela acima.
2. **Leia o arquivo de referência correspondente** antes de escrever o Mermaid — cada um tem a sintaxe específica, convenções de nomenclatura e exemplos prontos pra aquele tipo.
3. **Se for retroativo** (projeto já existe): leia `references/retroactive.md` primeiro — ele explica quais arquivos escanear (package.json, docker-compose.yml, schema.prisma, rotas, etc.) e como mapear o que foi encontrado para a sintaxe Mermaid, ANTES de ler a referência do tipo de diagrama específico.
4. **Gere o código Mermaid.**
5. **Entregue como artifact/arquivo `.md`** com o bloco ```mermaid``` dentro — assim renderiza no GitHub, Notion e Obsidian sem esforço extra. Se o usuário quiser ver renderizado na hora na conversa, use o Visualizer (diagram module) além do arquivo.
6. **Sugira onde salvar no projeto**: convenção recomendada é `docs/diagrams/<nome>.md` (ou `.claude/diagrams/` se quiser deixar junto da estrutura de skills/commands do Claude Code). Isso mantém os diagramas versionados e fáceis de achar depois.

## Convenções gerais de estilo (aplicam a todos os tipos)

- **Nomes em português quando o público for a equipe/o próprio usuário**; em inglês se o diagrama for para documentação técnica pública/open-source. Beto normalmente documenta em português — use português como padrão, a menos que o contexto indique o contrário.
- **Não lote um diagrama só.** Se o sistema tem muitas partes, prefira múltiplos diagramas (ex: um C4 Contexto + um C4 Container por serviço) a um diagrama gigante ilegível.
- **Sempre inclua um título** como comentário ou primeira linha textual do arquivo `.md` que envolve o diagrama.
- **Cores/subgraphs**: use `subgraph` pra agrupar visualmente (ex: "VPS Hostinger", "Camada de Dados") e `style`/`classDef` com moderação — só quando ajuda a diferenciar categorias (ex: serviços internos vs. externos), não por decoração.
- **Valide mentalmente a sintaxe** antes de entregar: aspas em labels com caracteres especiais, IDs de nó sem espaços, direção do fluxograma (`TD`, `LR`) escolhida pra caber bem no conteúdo (infra/hierarquia geralmente fica melhor em `TD`; pipelines/sequências lineares em `LR`).

## Entregando o resultado

Depois de gerar o Mermaid:
- Mostre o código do diagrama.
- Renderize com o Visualizer (`diagram` module) pra o usuário ver na hora, quando fizer sentido.
- Crie o arquivo `.md` em `/mnt/user-data/outputs/` com o bloco mermaid, pra ele poder salvar direto no repo.
- Se o usuário estiver com vários diagramas relacionados (ex: C4 completo: contexto + container + componente), ofereça consolidar num único arquivo com seções, ou em arquivos separados — pergunte a preferência se não for óbvio.
