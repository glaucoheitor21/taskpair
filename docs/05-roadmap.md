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

## CP5 — Protótipo funcional ✅

**Objetivo:** o app navega inteiro, com dados mockados, banco integrado e testes.

| Entregável | Onde está |
|---|---|
| Protótipo funcional com dados mockados | `src/mocks/*.json` → modo local persistido em AsyncStorage |
| Integração de banco de dados (Supabase) | [`docs/09-supabase.md`](09-supabase.md) · [`supabase/schema.sql`](../supabase/schema.sql) · `src/services/` |
| Ambiente de teste (Jest) + roteiro manual | [`docs/07-testes.md`](07-testes.md) · `__tests__/` |
| Telas e fluxos de navegação documentados | [`docs/06-telas-e-fluxos.md`](06-telas-e-fluxos.md) |
| Decisões técnicas (bibliotecas, arquitetura) | [`docs/04-arquitetura.md`](04-arquitetura.md) |
| Simulação no Android Studio (emulador) | Capturas em [`docs/assets/app/`](assets/app) |

- [x] Setup do Expo SDK 58 sobre a estrutura do CP4, fontes Sora e Inter
- [x] `RootNavigator`, `AuthNavigator`, `AppTabs` com rotas tipadas
- [x] Componentes de base: `Screen`, `Header`, `Button`, `Input`, `Avatar`, `Badge`, `Card`, `ChipGroup`, `DateField`
- [x] Leitura: lista de projetos, detalhe, Kanban, Home com prazos e carga individual
- [x] Escrita: novo projeto, nova tarefa com peso obrigatório, mover entre colunas, editar, excluir
- [x] **`BalancePanel`** com Balance Score, barra empilhada e alerta de concentração
- [x] `ProfileScreen` com histórico de contribuição
- [x] Estados vazio, carregando e erro em todas as listas
- [x] Acessibilidade: contraste verificado, alvos ≥ 44 dp, `accessibilityLabel`/`Role` nos controles
- [x] `npm run typecheck` e `npm test` sem erros

Decisão de risco do CP4 mantida: mover tarefa é um botão "→ próxima coluna" + seletor de coluna no detalhe, não arrastar.

---

## CP6 — App final e APK ✅

| Entregável | Onde está |
|---|---|
| App final com as funcionalidades principais | `src/` |
| README final, manual de uso, decisões técnicas | [`README.md`](../README.md) · [`docs/08-manual-de-uso.md`](08-manual-de-uso.md) · [`docs/04-arquitetura.md`](04-arquitetura.md) |
| APK instalável | [Releases](https://github.com/glaucoheitor21/taskpair/releases) · `scripts/build-apk.sh` |

- [x] Backend: Supabase com `profiles`, `projects`, `members`, `tasks`
- [x] Autenticação com e-mail/senha (Supabase Auth) e sessão persistida
- [x] Segurança por linha (RLS): cada pessoa só vê os projetos de que participa
- [x] Convite de integrante por e-mail; remover integrante devolve as tarefas ao pool
- [x] Tratamento de erro de rede com "tentar de novo"
- [x] Modo escuro (RF14), com preferência salva
- [x] Projeto de exemplo para contas novas
- [x] APK release gerado e testado no emulador Android

### Fica para depois

- [ ] Convite por link com deep link (hoje é por e-mail)
- [ ] Notificação local de prazo (D-3 e D-1)
- [ ] Arrastar cartões entre colunas
- [ ] Exportar relatório de contribuição em PDF (RF13)
- [ ] Sincronização em tempo real (Supabase Realtime) — hoje atualiza ao puxar a tela

---

## Linha do tempo

| Período | Foco |
|---|---|
| Setembro | CP4 entregue · início do setup do CP5 |
| Outubro | CP5 — telas, dados mockados, Supabase e testes |
| Outubro/Novembro | CP6 — integração final e APK |
