# FitFlow — Product Context

> Reference for AI agents creating UI in Pencil.dev. Keep this updated as the product evolves.

## Overview

**Product**: FitFlow
**Tagline**: Webapp para acompanhamento e orientação de rotinas e estratégia de treino
**Stage**: Ideia
**Type**: Web app (mobile-first)

FitFlow é voltado para praticantes de musculação que desejam organizar, acompanhar e evoluir seus treinos. Permite cadastrar estratégias e rotinas de treino, visualizar progresso e — futuramente — conectar alunos a preparadores físicos.

---

## Users

### Praticante (Primary)
- Organiza e acompanha rotinas e estratégias de treino
- Não-técnico; espera UI simples e orientada a ação
- Pode ser gratuito (limite de 6 treinos) ou premium

### Preparador (Secondary)
- Gerencia e acompanha os treinos dos alunos
- Cria e atribui rotinas; envia orientações
- Acessa apenas dados dos seus próprios alunos

---

## Core Features & Screens

| Feature | Descrição | Usuário |
|---------|-----------|---------|
| Rotina de treino | Cadastro da estratégia e treino com seleção de exercícios | Praticante |
| Progresso | Volume, duração, dias no mês, músculos trabalhados, heatmap | Praticante |
| Exercícios | Visualização por grupo muscular | Praticante |
| Compartilhamento | Gerador de informativo para redes sociais | Praticante |
| Notificações | Lembretes e avisos durante o treino (intervalos e tempo) | Praticante |
| Explorar | Estratégias de treino pré-criadas | Praticante |
| Alunos | Gerenciar e acompanhar treinos dos alunos | Preparador |
| Personal | Comunicação e orientação do preparador | Praticante |

---

## Business Rules (UI must respect these)

1. **Isolamento de dados**: Preparador só vê dados dos próprios alunos — nunca de alunos de outros preparadores.
2. **Limite do plano gratuito**: Máximo de 6 treinos criados. UI deve mostrar contador e estado de upgrade ao atingir o limite. Nunca ocultar o estado de bloqueio.
3. **Moderação de conteúdo**: Comunicação preparador ↔ aluno não permite linguagem imprópria.
4. **Autenticação obrigatória**: Nenhuma tela de conteúdo é acessível sem login. Todo fluxo começa com auth.

---

## User Journeys

### Primeiro treino (Praticante)
1. Cadastro e login
2. Escolhe ou cria uma estratégia de treino
3. Monta rotina semanal
4. Seleciona exercícios por treino
5. Executa treino: registra séries, cargas, repetições
6. Visualiza progresso

### Acompanhamento com preparador
1. Praticante se cadastra e vincula ao preparador
2. Preparador cria e atribui rotina
3. Praticante executa e registra progresso
4. Preparador acompanha e envia orientações
5. Praticante visualiza orientações na área Personal

---

## Domain Glossary

| Termo | Definição |
|-------|-----------|
| Rotina | Conjunto de treinos semanais |
| Estratégia | Divisão muscular (ABC, Upper/Lower, etc.) |
| Preparador | Treinador/treinadora ou professor/professora |
| Split | Divisão de treino |
| Full Body | Treino de corpo inteiro |
| Upper/Lower | Divisão superior/inferior |
| Push/Pull/Legs (PPL) | Empurrar/puxar/pernas |
| Periodização | Planejamento progressivo do treino |
| Repetição (Rep) | Uma execução do movimento |
| Série (Set) | Conjunto de repetições |
| Carga | Peso utilizado |
| Falha muscular | Incapacidade de completar outra repetição |
| RM | Repetição máxima |
| Volume de treino | Quantidade total de trabalho realizado |
| Intensidade | Nível de esforço/carga |
| Cadência/Tempo | Velocidade de execução do movimento |
| Drop set | Reduzir carga sem descanso entre séries |
| Bi-set / Superset | Dois exercícios consecutivos sem descanso |
| Rest-pause | Pausa curta dentro da série para continuar |
| Pirâmide | Progressão ou regressão de carga ao longo das séries |
| Isometria | Contração estática (sem movimento) |
| Ativação muscular | Recrutamento do músculo alvo no início do exercício |

---

## Out of Scope
- Planos de dieta ou nutrição
- Integração com wearables
- Marketplace de preparadores
