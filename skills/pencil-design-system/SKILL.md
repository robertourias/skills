---
name: pencil-design-system
description: |
  Use this skill whenever the user wants to create, edit, or compose UI screens, components, or interfaces in Pencil.dev using a design system. Trigger on any request involving: "criar tela", "criar componente", "criar interface", "design system", "montar UI", "adicionar seção", "montar layout", "tela de login", "tela de treino", or any request to build a screen/page/component inside a .pen file. Also trigger when the user mentions design tokens, typography, colors, spacing, dark mode, or accessibility in the context of a Pencil.dev project. Use this skill even when the request seems simple — it ensures the output stays consistent with the product's design system and business rules.
metadata:
  title: Pencil Design System
  category: design
  tags: [pencil, design-system, ui, components]
  agents: [claude-code]
  version: 1.0.0
  status: beta
  language: en
  visibility: public
  updated: 2026-09-25
---

# Pencil Design System Skill

Guides the creation of UI screens and components in Pencil.dev that are consistent with the project's design system, product context, and domain rules.

---

## Mandatory First Steps

Before ANY design action, run these steps in order. **Follow the token-saving rules strictly — they have a large impact on context size.**

### 1. Load product context (once per session)
Read `references/product-context.md` **only once per session**. If it was already read earlier in this conversation, skip this step entirely.

Focus on:
- Product name, users, and domain glossary
- Business rules that affect UI (auth, plan limits, data isolation)
- Core features and user journeys that map to screens

> ⚠️ **Token rule**: Do NOT re-read this file for each new screen. Reuse what's already in context.

### 2. Load design system structure (selective, once per session)
Read `references/design-system-structure.md` **only once per session**, and only if the task requires understanding cross-cutting design rules. Skip if the relevant section rules can be inferred from context.

> ⚠️ **Token rule**: Never load this file more than once per session.

### 3. Load Pencil guidelines (once per guide type per session)
Call `get_guidelines()` (no args) to list available guides, then load **only the guide that matches the current task type**. Do not load more than one guide per session unless the task type changes.

| Task type | Guide to load |
|---|---|
| Web app screen | `Web App` |
| Mobile screen | `Mobile App` |
| Landing page / marketing | `Landing Page` |
| Table / dashboard | `Table` |
| Slide deck | `Slides` |
| Tailwind code generation | `Tailwind` |
| Component from design system | `Design System` |

```
get_guidelines({ category: "guide", name: "<Guide Name>" })
```

> ⚠️ **Token rule**: If the same guide was already loaded in this session, do NOT load it again.

### 4. Load editor state and variables

**First screen of the session:**
```
get_editor_state({ include_schema: true })   // needed once to understand components
get_variables()                               // reads design tokens from the .pen file
```

**Subsequent screens in the same session:**
```
get_editor_state({ include_schema: false })  // lightweight — pages/frames only
// skip get_variables() unless tokens changed
```

> ⚠️ **Token rule**: `include_schema: true` is expensive. Use it **only once per session** (first screen). All subsequent calls must use `include_schema: false`.

If no variables exist yet, ask the user if they want to set up tokens before proceeding.

---

## Workflow

### Step 1 — Understand the request
Identify:
- **What** to create (screen, component, section, icon set, etc.)
- **Who** uses it (praticante or preparador — see product context)
- **Which design system sections** are relevant (see structure in references)
- **Any business rule** that applies (auth guard, plan limits, data isolation)

If the request is ambiguous, ask **one clarifying question** before continuing.

### Step 2 — Map to design system sections
Identify which sections from the 15-part structure are needed. For example:
- A login screen touches: Foundations, Colors, Typography, Forms, Feedback, Accessibility
- A progress dashboard touches: Colors, Spacing & Layout, Components, Dark Mode, Patterns

Only load/apply the relevant sections — do not over-engineer.

### Step 3 — Design

Use `batch_design` with a prompt that includes:
1. The screen/component name and purpose
2. The target user (praticante or preparador)
3. Token references: use `$variable-name` syntax for any design token
4. Any business rules that constrain the UI
5. Relevant design system guidelines for this task

**Prompt structure for batch_design (keep it concise):**
```
Create [screen/component name] for [target user].

Context: [1-2 lines from product-context relevant to this screen]

Design system rules to apply:
- [token or rule 1]
- [token or rule 2]
- [accessibility / dark mode note if applicable]

Business rules:
- [any constraint from product-context that affects the UI]
```

> ⚠️ **Token rule**: Keep `batch_design` prompts minimal. Do NOT paste entire sections of the design system or product context into the prompt — reference only the tokens and rules directly relevant to this specific screen.

### Step 4 — Verify
After designing, check:
- [ ] All colors use `$token` references, not hardcoded hex values
- [ ] Typography follows the type scale defined in tokens
- [ ] Spacing uses the spacing tokens (not arbitrary values)
- [ ] If the screen requires auth: confirm there is no unauthenticated access path in the design
- [ ] If the screen has creation limits (ex: treinos): confirm the limit state is represented

### Step 5 — Communicate result
Summarize what was created:
- Screen/component name
- Which design system sections were applied
- Any design decisions made and why
- Next suggested steps (e.g., "next, create the empty state for this screen")

---

## Design Patterns for FitFlow

These are recurring UI patterns specific to the product. Apply them when relevant:

### Auth guard pattern
Every screen must assume authentication. Never design a content screen without a corresponding login/redirect state.

### Plan limit pattern
When a feature has a free plan limit (e.g., max 6 treinos):
- Show a count indicator (e.g., "3 de 6 treinos")
- Show a locked/upgrade state when the limit is reached
- Never hide the upgrade path — it should be visible but not intrusive

### Preparador ↔ Aluno separation
- Preparador screens: manage multiple alunos, never see other preparadores' data
- Aluno screens: personal data only, with a "Personal" area for preparador communication
- Never mix data contexts in the same view

### Progress visualization
For the Progresso feature, the standard components are:
- Volume chart (weekly/monthly)
- Duration tracker
- Monthly training days counter
- Muscle heatmap
- Weekly muscle group coverage

---

## Token Setup (if starting from scratch)

If the project has no variables yet, suggest this baseline token set to the user before designing:

```json
{
  "color-primary": { "type": "color", "value": "#..." },
  "color-background": { "type": "color", "value": "#..." },
  "color-surface": { "type": "color", "value": "#..." },
  "color-text": { "type": "color", "value": "#..." },
  "color-text-muted": { "type": "color", "value": "#..." },
  "color-success": { "type": "color", "value": "#..." },
  "color-warning": { "type": "color", "value": "#..." },
  "color-error": { "type": "color", "value": "#..." },
  "spacing-xs": { "type": "number", "value": 4 },
  "spacing-sm": { "type": "number", "value": 8 },
  "spacing-md": { "type": "number", "value": 16 },
  "spacing-lg": { "type": "number", "value": 24 },
  "spacing-xl": { "type": "number", "value": 40 },
  "radius-sm": { "type": "number", "value": 4 },
  "radius-md": { "type": "number", "value": 8 },
  "radius-lg": { "type": "number", "value": 16 },
  "font-heading": { "type": "string", "value": "Inter" },
  "font-body": { "type": "string", "value": "Inter" }
}
```

Dark mode variants should be set up using theme axes on color tokens. Call `set_variables` with the theme structure shown in the Pencil tool documentation.

---

## File & Page Organization

### Core principle
Tokens (`get_variables`) and components are **scoped per `.pen` file** — there is no native cross-file reference. A component defined in file A is not accessible in file B. This means the file boundary is also the component boundary.

### Recommended strategy: single file per product

For FitFlow (and most single-product projects), use **one `.pen` file** with pages as organizational layers:

```
fitflow.pen
├── Page 1: 🔩 Foundations    ← tokens, colors, typography scale
├── Page 2: 🧩 Components     ← all reusable components
├── Page 3: 🌊 Praticante     ← screens for the primary user
├── Page 4: 👤 Preparador     ← screens for the trainer
└── Page 5: 🚧 WIP            ← drafts and experiments
```

This keeps all tokens and components available across every page in the file.

### When to split into multiple files

| Scenario | Split? |
|---|---|
| Solo or small team on one product | **No** — single file |
| Two distinct products (e.g. mobile app + web admin) | Yes — one file per product |
| Large team with multiple squads | Yes — one file per squad/feature area |
| Mature design system shared across projects | Yes — dedicated library file |

### Page naming convention

Use emoji prefixes to make pages scannable at a glance:

| Prefix | Page type |
|---|---|
| 🔩 | Foundations / tokens |
| 🧩 | Components library |
| 🌊 | User flows / screens |
| 👤 | Specific user role screens |
| 📊 | Dashboards / data views |
| 🚧 | Work in progress |
| 🗂️ | Archive / deprecated |

### Before creating a new screen

Always check which page you are on:
- If on a **Foundations or Components page**: you are building system elements, not flows
- If on a **Flow page**: you are composing screens using existing components
- Never create one-off styled frames on a flow page if a component already exists for that element

---

## Reference Files

- `references/product-context.md` — full product spec (features, glossary, business rules, journeys)
- `references/design-system-structure.md` — the 15-section design system structure with descriptions

---

## Token Optimization Cheatsheet

Follow this to keep context size under control across a session:

| Action | When to do it |
|---|---|
| `get_editor_state({ include_schema: true })` | **Once** — first screen only |
| `get_editor_state({ include_schema: false })` | Every subsequent screen |
| Read `product-context.md` | **Once** per session |
| Read `design-system-structure.md` | **Once** per session, only if needed |
| Load a guideline (e.g., `Mobile App`) | **Once** per guide type per session |
| `get_variables()` | **Once** at session start; skip if tokens unchanged |
| `batch_design` prompt content | Minimal — only tokens and rules for this screen |

**Never do:**
- Re-read reference files already in context
- Use `include_schema: true` more than once per session
- Paste full design system sections into `batch_design` prompts
- Load multiple guides when one suffices
