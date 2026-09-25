# Design System Structure

> Esta estrutura é **opcional** — use apenas as seções relevantes para a tarefa em questão.
> Não é necessário passar por todas as seções para criar uma tela ou componente.

---

## Quando usar cada seção

| # | Seção | Quando aplicar |
|---|-------|----------------|
| 1 | Foundations | Início do projeto; define princípios visuais e de produto |
| 2 | Tokens | Sempre — base de qualquer design. Leia `get_variables()` antes de criar |
| 3 | Typography | Qualquer tela com texto, títulos, labels |
| 4 | Colors | Sempre — use `$color-*` tokens, nunca hex hardcoded |
| 5 | Spacing & Layout | Qualquer tela com estrutura visual (grids, gaps, padding) |
| 6 | Components | Botões, cards, badges, chips, avatares |
| 7 | Forms | Inputs, selects, checkboxes, formulários de cadastro/login/edição |
| 8 | Navigation | Bottom nav, tabs, drawer, breadcrumb |
| 9 | Feedback | Toasts, alerts, estados de erro, loading, empty states |
| 10 | Icons | Ícones de grupo muscular, ações, navegação |
| 11 | Dark Mode | Quando `$color-*` precisar de variantes light/dark via themes |
| 12 | Accessibility | Contraste, touch targets, labels, ARIA — aplicar sempre que possível |
| 13 | Motion & Animations | Transições de tela, micro-interações, progress animations |
| 14 | Patterns | Padrões compostos: plan limit, auth guard, progress visualization |
| 15 | Code Guidelines | Ao gerar código (Tailwind, React) a partir do design |

---

## Seções detalhadas

### 1. Foundations
Princípios visuais do produto: grid system, breakpoints, espaçamento base, tom visual.
- Para FitFlow: mobile-first, energia e foco, clareza para não-técnicos.

### 2. Tokens
Variáveis de design que unificam cores, tipografia, espaçamento e raios.
- Sempre ler com `get_variables()` antes de criar
- Sempre escrever com `$token-name` no design
- Se vazio, sugerir token set baseline (ver SKILL.md)

### 3. Typography
Escala tipográfica: tamanhos, pesos, line-heights, uso por contexto.
- Heading: títulos de tela, nomes de treino, métricas de destaque
- Body: descrições, listas de exercícios, orientações do preparador
- Caption: labels, metadados, timestamps

### 4. Colors
Paleta semântica baseada em tokens.
- Primary: ação principal (iniciar treino, salvar)
- Surface / Background: hierarquia de camadas
- Semantic: success (treino concluído), warning (próximo do limite), error (falha/bloqueio)
- Muted: texto secundário, placeholders

### 5. Spacing & Layout
Grid de 4pt. Tokens de espaçamento: xs(4), sm(8), md(16), lg(24), xl(40).
- Usar spacing tokens para padding, gap, margin
- Nunca usar valores arbitrários

### 6. Components
Átomos e moléculas reutilizáveis:
- Button (primary, secondary, ghost, destructive, icon-only)
- Card (treino, exercício, aluno, progresso)
- Badge (status de treino, grupo muscular)
- Avatar (aluno, preparador)
- Chip (estratégia, split, grupo muscular)
- Progress bar / ring (volume, séries concluídas)

### 7. Forms
Inputs para cadastro de treino, séries, cargas, login, registro de aluno.
- Text input, number input (carga, reps), select (exercício, grupo muscular)
- Estados: default, focus, filled, error, disabled
- Sempre incluir label + helper text + error message

### 8. Navigation
- Bottom navigation bar (Praticante): Rotina, Progresso, Explorar, Personal
- Top app bar: título da tela + ações contextuais
- Tabs: dentro de telas com múltiplas views (ex: Progresso: semana / mês)
- Drawer ou modal: ações secundárias, configurações

### 9. Feedback
- Toast: confirmação de ação (treino salvo, série registrada)
- Alert inline: limite de plano atingido, erro de validação
- Empty state: nenhum treino criado, nenhum aluno vinculado
- Loading skeleton: carregamento de listas e gráficos
- Full screen error: falha de conexão

### 10. Icons
Iconografia para:
- Grupos musculares (peito, costas, pernas, ombros, bíceps, tríceps, core)
- Ações (adicionar, editar, deletar, compartilhar, iniciar, pausar, finalizar)
- Navegação (home, progresso, explorar, personal, alunos)
- Status (concluído, pendente, bloqueado, upgrade)

### 11. Dark Mode
Implementado via theme axes nos tokens de cor.
- Fundo escuro com superfícies levemente mais claras
- Cores semânticas ajustadas para contraste em dark
- Definir com `set_variables` usando `theme: { mode: "dark" }`

### 12. Accessibility
- Contraste mínimo 4.5:1 para texto
- Touch targets mínimo 44x44pt
- Todos os inputs têm label visível
- Ícones sem texto têm aria-label
- Focus states visíveis
- Não depender apenas de cor para transmitir estado

### 13. Motion & Animations
- Transições de tela: 200-300ms ease-in-out
- Feedback de ação: micro-animação em botões (tap scale)
- Progress ring: fill animation ao completar série
- Skeleton: pulse animation no carregamento
- Timer de intervalo: countdown visual com animação circular

### 14. Patterns
Padrões compostos recorrentes no FitFlow:

**Auth guard**: toda tela de conteúdo tem estado de redirect para login.

**Plan limit**: contador "X de 6 treinos" visível; estado locked com CTA de upgrade quando atingir limite.

**Exercise card**: nome, grupo muscular, séries × reps × carga, status de conclusão.

**Progress metric tile**: ícone + valor + label + variação (↑ ↓).

**Preparador view isolation**: nunca mostrar dados de alunos de outros preparadores na mesma view.

### 15. Code Guidelines
Ao gerar código a partir do design no Pencil:
- Usar guia Tailwind para CSS utilitário
- Referenciar tokens como variáveis CSS (`--color-primary`, `--spacing-md`)
- Componentes React seguem shadcn/ui quando disponível
- Nomear componentes com o glossário do produto (ex: `TreinoCard`, `SerieLine`, `PreparadorBadge`)
