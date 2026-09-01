# Roadmap — CP4 · CP5 · CP6

Os três checkpoints são um único projeto contínuo. Este documento registra o que já está pronto e o que cada etapa seguinte precisa entregar.

---

## CP4 — Idealização ✅

| Entregável | Onde está |
|---|---|
| Repositório organizado com README | Raiz do repositório |
| Documento de escopo (problema, público, proposta de valor) | [`docs/01-escopo.md`](01-escopo.md) |
| Nome, logo, paleta e tipografia | [`docs/02-marca.md`](02-marca.md) · [`brand/`](../brand) |
| Pitch e modelo de negócio | [`docs/03-pitch-modelo-de-negocio.md`](03-pitch-modelo-de-negocio.md) |
| Estrutura do projeto e arquitetura | [`docs/04-arquitetura.md`](04-arquitetura.md) · [`src/`](../src) |
| Telas conceituais | Canvas de design (link no README) |

Além do exigido, já entram nesta etapa o **modelo de domínio tipado** (`src/types`), os **tokens de tema com contraste verificado** (`src/theme`) e o **cálculo do Painel de Equilíbrio implementado e testável** (`src/utils/workload.ts`) — porque são as decisões que travam o resto do projeto e é mais barato acertá-las agora.

---

## CP5 — Protótipo funcional com dados mockados

**Objetivo:** o app navega inteiro e mostra dados reais vindos de `src/mocks`, sem rede.

### Etapa 1 — Fundação
- [ ] `npx create-expo-app` sobre a estrutura existente e `npm install`
- [ ] Carregar Sora e Inter com `expo-font`
- [ ] Alias de import funcionando (`babel-plugin-module-resolver`)
- [ ] `RootNavigator`, `AuthNavigator`, `AppTabs`, `ProjectsStack`
- [ ] Componentes de base: `Screen`, `Header`, `Button`, `Input`, `Avatar`, `Badge`

### Etapa 2 — Leitura
- [ ] `projectService` e `taskService` lendo de `src/mocks`
- [ ] `ProjectListScreen` com `ProjectCard` e progresso ponderado
- [ ] `ProjectDetailScreen` com `MemberList`
- [ ] `KanbanScreen` com as quatro colunas e `TaskCard`
- [ ] `HomeScreen` com próximos prazos e carga individual

### Etapa 3 — Escrita e o diferencial
- [ ] `NewProjectScreen` e `NewTaskScreen` com validação
- [ ] Mover tarefa entre colunas (estado em memória)
- [ ] **`BalancePanel`** consumindo `calculateBalance` — barra empilhada, Balance Score e alerta de concentração
- [ ] `ProfileScreen` com histórico de contribuição
- [ ] Estados vazios e de carregamento em todas as listas

### Etapa 4 — Acabamento
- [ ] Revisão de acessibilidade: contraste, alvos de 44 dp, `accessibilityLabel`
- [ ] `npm run typecheck` e `npm run lint` sem erros
- [ ] Protótipo navegável no Figma alinhado às telas implementadas
- [ ] README atualizado com capturas de tela

**Risco principal:** implementar o Kanban com gesto de arrastar antes das telas de leitura estarem prontas. Mitigação: no CP5 mover tarefa pode ser um seletor de status; o arrastar entra depois, se sobrar tempo.

---

## CP6 — App final e APK instalável

**Objetivo:** o mesmo app, com backend real, entregue como APK.

### Backend
- [ ] API REST conforme o contrato em [`docs/04-arquitetura.md`](04-arquitetura.md#5-contrato-da-api-cp6)
- [ ] Banco de dados com as entidades `User`, `Project`, `Member`, `Task`
- [ ] Autenticação com token e hash de senha
- [ ] `GET /projects/:id/balance` reaproveitando a lógica de `workload.ts`
- [ ] Deploy em ambiente acessível pelo dispositivo

### Integração
- [ ] `USE_MOCKS = false` e cliente HTTP implementado
- [ ] Sessão persistida em `AsyncStorage`
- [ ] Tratamento de erro de rede e estado offline
- [ ] Convite por link com deep link
- [ ] Notificação local de prazo (D-3 e D-1)

### Entrega
- [ ] `eas build -p android --profile preview` gerando o APK
- [ ] Teste em dispositivo físico Android
- [ ] README com link do APK e instruções de instalação
- [ ] Apresentação final

**Se sobrar tempo:** exportar relatório de contribuição em PDF (RF13) e modo escuro (RF14) — os tokens de `darkTheme` já existem.

---

## Linha do tempo

| Período | Foco |
|---|---|
| Setembro | CP4 entregue · início do setup do CP5 |
| Outubro | CP5 — telas e navegação com dados mockados |
| Novembro | CP6 — API, integração e build do APK |
