# Arquitetura e Organização do Projeto — TaskPair

Este documento explica **por que** as pastas estão organizadas assim, não só quais são. A estrutura foi desenhada para que o CP5 (dados mockados) vire CP6 (API REST) sem que nenhuma tela precise ser reescrita.

---

## 1. Stack

| Camada | Escolha | Motivo |
|---|---|---|
| Runtime | **React Native 0.76 + Expo SDK 52** | Expo entrega build de APK sem Android Studio configurado, o que é decisivo para uma dupla |
| Linguagem | **TypeScript** em modo `strict` | O modelo de domínio (peso, status, papéis) é o coração do produto; erro de tipo aqui é erro de regra de negócio |
| Navegação | **React Navigation 7** (native-stack + bottom-tabs) | Padrão de fato; suporte a deep link, necessário para o convite por link |
| Estado | **Context API + hooks** | O app tem pouco estado global (sessão, projeto ativo). Redux seria peso morto |
| Persistência local | **AsyncStorage** | Só sessão e preferência de tema |
| Fontes | **@expo-google-fonts** (Sora + Inter) | Empacotadas no APK; sem download em runtime |
| Build | **EAS Build** (`preview` → APK) | Entrega do CP6 |

---

## 2. Estrutura de pastas

```
taskpair/
├── docs/                    Documentação do projeto (escopo, marca, pitch, arquitetura)
├── brand/                   Logo em SVG e PNG, arquivos-fonte da marca
├── .github/                 Templates de issue e pull request
└── src/
    ├── theme/               ✅ Tokens: cores, tipografia, espaçamento — fonte única da verdade
    ├── types/               ✅ Modelo de domínio em TypeScript
    ├── utils/               ✅ Regras puras: cálculo de equilíbrio, prazos, validação
    ├── mocks/               ✅ Dados de exemplo (CP5)
    ├── components/
    │   ├── common/          Button, Input, Avatar, Badge, ProgressBar, EmptyState
    │   ├── layout/          Screen, Header
    │   ├── project/         ProjectCard, BalancePanel, MemberList
    │   └── task/            TaskCard, KanbanColumn, DeadlineChip
    ├── screens/
    │   ├── auth/            SignIn, SignUp
    │   ├── home/            Home
    │   ├── projects/        ProjectList, ProjectDetail, Kanban, NewProject
    │   ├── tasks/           TaskDetail, NewTask
    │   └── profile/         Profile
    ├── navigation/          RootNavigator, AuthNavigator, AppTabs, ProjectsStack, types
    ├── contexts/            AuthContext, ProjectContext
    ├── hooks/               useAuth, useProjects, useTasks, useBalance
    ├── services/            api.ts, storage.ts, *Service.ts — a fronteira com o mundo externo
    └── assets/              fonts/, images/
```

✅ = já implementado neste CP4. O restante são contratos declarados, com a assinatura e a documentação prontas para o CP5.

---

## 3. As três decisões que sustentam a estrutura

### 3.1. `services/` é a única fronteira com o mundo externo

Nenhuma tela faz `fetch` e nenhuma tela importa de `mocks/`. Tudo passa por `services/`.

```
Screen → hook → service → ┬ CP5: src/mocks/*.json
                          └ CP6: API REST (fetch)
```

A troca é uma linha em `src/services/api.ts`:

```ts
export const USE_MOCKS = true;   // CP5
export const USE_MOCKS = false;  // CP6
```

É essa fronteira que torna o CP6 uma tarefa de integração e não uma reescrita.

### 3.2. `utils/workload.ts` é regra de negócio pura, isolada de React

O cálculo do Painel de Equilíbrio não conhece componentes, não conhece navegação e não conhece a API. Recebe arrays, devolve números.

Três consequências: dá para testar sem montar nenhuma tela; dá para reaproveitar no backend do CP6 sem duplicar a lógica; e o cálculo fica auditável — o que importa quando a métrica descreve o esforço de pessoas reais.

### 3.3. `theme/` é a única fonte de cor, fonte e espaçamento

Cor, fonte ou espaçamento escrito diretamente numa tela é bug de revisão de código, listado no checklist do template de PR. O motivo prático: o modo escuro (RF14) e a acessibilidade (RNF04) só são viáveis se houver um lugar único para trocar. Todos os pares de contraste em `theme/colors.ts` estão anotados com o valor medido pela fórmula da WCAG 2.1.

---

## 4. Modelo de dados

```
User ──┬── Member ──── Project ──── Task
       │   (papel)      (prazo)      (peso, status, prazo, responsável)
       │
       └── responsável de Task
```

O que difere do modelo de um Trello da vida:

- **`Task.weight`** (1, 2, 3, 5, 8 — escala de Fibonacci truncada) é obrigatório. É o que permite medir esforço em vez de contar cartões.
- **`Task.assigneeId` pode ser `null`.** Tarefa sem responsável não é um erro: é o *pool* de trabalho que qualquer integrante pode reivindicar (RF12). Isso resolve o problema da persona Marina, que chega ao grupo sem saber o que pegar.
- **`ProjectBalance`** é derivado, nunca persistido. Recalcular é barato e evita o pior tipo de bug: um número de "carga" desatualizado que o grupo usa para discutir.

Tipos completos em [`src/types/index.ts`](../src/types/index.ts).

---

## 5. Contrato da API (CP6)

Declarado em `src/services/api.ts` desde já, para que o backend possa ser desenvolvido em paralelo às telas.

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/sign-up` | Cadastro |
| `POST` | `/auth/sign-in` | Login, devolve token |
| `GET` | `/projects` | Projetos do usuário autenticado |
| `POST` | `/projects` | Criar projeto |
| `GET` | `/projects/:id` | Detalhe do projeto |
| `PATCH` | `/projects/:id` | Editar / arquivar |
| `GET` | `/projects/:id/members` | Integrantes |
| `POST` | `/projects/:id/members` | Convidar |
| `GET` | `/projects/:id/balance` | Painel de Equilíbrio |
| `GET` | `/tasks?projectId=` | Tarefas do projeto |
| `POST` | `/tasks` | Criar tarefa |
| `PATCH` | `/tasks/:id` | Editar, mover de coluna, reatribuir |
| `DELETE` | `/tasks/:id` | Remover |

Autenticação por `Authorization: Bearer <token>`.

---

## 6. Convenções de código

- **Componentes** em `PascalCase.tsx`, um por arquivo, com `export default` e export nomeado.
- **Hooks** em `useAlgo.ts`; funções puras em `camelCase.ts`.
- **Imports** por alias (`@theme`, `@components`, `@services`) — declarados em `tsconfig.json` e `babel.config.js`.
- **Texto de interface** sempre em pt-BR e sempre no componente, nunca no service.
- **Commits** no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/): `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- **Branches**: `main` protegida; trabalho em `feat/<assunto>`, integrado por pull request usando o template do repositório.

---

## 7. Divisão de responsabilidades da dupla

Ambos participam de todas as etapas; a coluna indica quem conduz.

| Frente | Conduz | Apoia |
|---|---|---|
| UX/UI, protótipo, identidade visual | Pedro | Glauco |
| Arquitetura front-end, navegação, tema | Glauco | Pedro |
| Telas e componentes (CP5) | Ambos | — |
| API REST e banco de dados (CP6) | Glauco | Pedro |
| Integração e build do APK (CP6) | Pedro | Glauco |
| Documentação | Ambos | — |
