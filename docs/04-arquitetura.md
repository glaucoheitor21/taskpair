# Arquitetura e Organização do Projeto — TaskPair

Este documento explica **por que** as pastas estão organizadas assim, não só quais são. A estrutura foi desenhada para que o CP5 (dados mockados) vire CP6 (API REST) sem que nenhuma tela precise ser reescrita.

---

## 1. Stack

| Camada | Escolha | Motivo |
|---|---|---|
| Runtime | **React Native 0.88 + Expo SDK 58** | SDK atual: roda no Expo Go da loja e gera APK sem configurar Android Studio à mão. No CP4 o plano era o SDK 52; ao instalar as dependências subimos para o SDK vigente, porque o Expo Go só abre a versão mais recente |
| Linguagem | **TypeScript** em modo `strict` | O modelo de domínio (peso, status, papéis) é o coração do produto; erro de tipo aqui é erro de regra de negócio |
| Navegação | **React Navigation 7** (native-stack + bottom-tabs) | Padrão de fato, telas nativas, rotas tipadas |
| Estado | **Context API + hooks** (`AuthContext`, `ProjectContext`, `ThemeContext`) | O app tem pouco estado global (sessão, projetos do usuário, tema). Redux seria peso morto |
| Backend | **Supabase** (PostgreSQL + Auth + RLS) | Banco relacional combina com o modelo (projeto ↔ integrante ↔ tarefa); autenticação e segurança por linha prontas, sem servidor próprio para manter |
| Persistência local | **AsyncStorage** | Sessão do Supabase, preferência de tema e o banco do modo local |
| Fontes | **@expo-google-fonts** (Sora + Inter) | Empacotadas no app; sem download em runtime |
| Ícones | **@expo/vector-icons** (Feather) | Traço fino e uniforme, combina com o símbolo da marca |
| Testes | **Jest + jest-expo + Testing Library** | Mesmo transformador do Metro; testa regra de negócio, serviços e componentes |
| Build | **Gradle local** (`scripts/build-apk.sh`) ou **EAS Build** (`preview` → APK) | Os dois caminhos geram o mesmo APK release |

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
    ├── services/            api.ts, supabase.ts, localDb.ts, storage.ts, *Service.ts — a fronteira com o mundo externo
    └── assets/              fonts/, images/
```

Todas as pastas estão implementadas desde o CP5. Fora de `src/`: `__tests__/` (Jest), `supabase/` (esquema do banco) e `scripts/` (build local do APK).

---

## 3. As três decisões que sustentam a estrutura

### 3.1. `services/` é a única fronteira com o mundo externo

Nenhuma tela faz `fetch`, importa de `mocks/` ou fala com o Supabase. Tudo passa por `services/`, e cada função de serviço tem as duas implementações lado a lado:

```
Screen → hook → ProjectContext → service ─┬─ DATA_SOURCE = 'supabase' → @supabase/supabase-js → PostgreSQL (RLS)
                                          └─ DATA_SOURCE = 'local'    → src/mocks/*.json → AsyncStorage
```

A escolha é automática em [`src/services/api.ts`](../src/services/api.ts): se `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` existirem no `.env`, o app usa o Supabase; senão, roda no modo local com os dados mockados persistidos no aparelho. Os testes sempre rodam no modo local.

| Serviço | Funções |
|---|---|
| `authService` | `getSession`, `signIn`, `signUp`, `signOut` |
| `projectService` | `listProjects`, `createProject`, `updateProject`, `deleteProject`, `inviteMember`, `removeMember`, `listUsers` |
| `taskService` | `listTasks`, `createTask`, `updateTask`, `deleteTask` |
| `demoService` | `createDemoProject` — popula uma conta nova com um projeto de exemplo |

Essa fronteira cumpriu o que prometia no CP4: a integração com o banco do CP6 não exigiu mudar nenhuma tela.

**Atualização otimista:** ao mover um cartão de coluna, o `ProjectContext` atualiza a interface na hora e só depois confirma com o serviço; se a gravação falhar, o cartão volta e o usuário vê o erro.

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

## 5. Banco de dados (CP5/CP6)

O contrato REST previsto no CP4 (`/projects`, `/tasks`…) foi substituído pelo **Supabase**, que expõe as mesmas entidades com autenticação e segurança por linha já prontas — sem um servidor próprio para hospedar e manter. As operações são as mesmas do contrato original, agora feitas pelo SDK:

| Operação do CP4 | Implementação |
|---|---|
| `POST /auth/sign-up` · `/auth/sign-in` | `supabase.auth.signUp` · `signInWithPassword` (perfil criado por trigger) |
| `GET/POST/PATCH /projects` | `from('projects').select('*, members(*)')` · `insert` · `update` |
| `POST /projects/:id/members` | busca em `profiles` por e-mail + `insert` em `members` |
| `GET /projects/:id/balance` | **calculado no app** com `calculateBalance` — derivado, nunca persistido |
| `GET/POST/PATCH/DELETE /tasks` | `from('tasks')…` |

Tabelas, políticas RLS e passo a passo de configuração: [`docs/09-supabase.md`](09-supabase.md) e [`supabase/schema.sql`](../supabase/schema.sql).

## 6. Convenções de código

- **Componentes** em `PascalCase.tsx`, um por arquivo, com `export default` e export nomeado.
- **Hooks** em `useAlgo.ts`; funções puras em `camelCase.ts`.
- **Imports relativos.** Os aliases previstos no CP4 (`@theme`, `@components`…) foram retirados: exigiam plugin de Babel extra e configuração duplicada no Jest, sem ganho real num projeto deste tamanho.
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
