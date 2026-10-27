# Testes

O TaskPair tem duas camadas de teste: **automatizados com Jest** (regras de negócio, serviços e componentes) e um **roteiro manual** executado no emulador Android e no APK instalado.

---

## 1. Testes automatizados (Jest)

**Ambiente:** `jest` 30 + preset `jest-expo` (mesmo transformador do Metro) + `@testing-library/react-native` para componentes. O AsyncStorage é substituído pelo mock oficial da biblioteca em [`jest.setup.js`](../jest.setup.js), então os testes de serviço rodam o **modo local completo** sem rede.

```bash
npm test
```

Resultado esperado:

```
Test Suites: 4 passed, 4 total
Tests:       35 passed, 35 total
```

| Arquivo | O que cobre |
|---|---|
| [`__tests__/workload.test.ts`](../__tests__/workload.test.ts) | Cálculo do Painel de Equilíbrio: divisão igual = 100; desvio em p.p. e alerta acima de 15 p.p.; peso conta, não quantidade de cartões; pool fora do denominador; peso concluído; isolamento entre projetos; projeto sem integrantes; progresso por peso. |
| [`__tests__/utils.test.ts`](../__tests__/utils.test.ts) | Datas (dias até o prazo, urgência, rótulos "Hoje/Amanhã/em N dias", máscara e validação DD/MM/AAAA), validações de formulário, regra "peso obrigatório" da tarefa, iniciais e cor do avatar, ordem das colunas. |
| [`__tests__/services.test.ts`](../__tests__/services.test.ts) | Integração dos serviços no modo local: login certo e errado, cadastro e e-mail duplicado, logout, filtro de projetos por integrante, criação com *owner*, persistência no AsyncStorage, convite (ok, duplicado, inexistente), remoção devolvendo tarefas ao pool, ciclo de vida da tarefa (criar → concluir → reabrir → excluir). |
| [`__tests__/components.test.tsx`](../__tests__/components.test.tsx) | `BalancePanel` (score e fatias renderizados, estado vazio), `TaskCard` ("Pegar esta tarefa" e "mover para a próxima coluna" disparam as ações), `Button` desabilitado não dispara. |

Também fazem parte da verificação:

```bash
npm run typecheck     # tsc --noEmit em modo strict
npx expo-doctor       # 20/20 checagens de dependências e configuração
```

---

## 2. Roteiro de testes manuais

Executado no emulador **Pixel 7 (API 37, x86_64)** do Android Studio com o APK release. Vale repetir num celular Android físico antes da apresentação. Marque ✅ / ❌.

### Autenticação

| # | Passo | Resultado esperado |
|---|---|---|
| A1 | Abrir o app pela primeira vez | Splash violeta com o símbolo → tela *Entrar* |
| A2 | Tocar *Entrar* com campos vazios | Mensagens "Informe um e-mail válido" e "Informe sua senha" |
| A3 | Entrar com senha errada | "E-mail ou senha incorretos." |
| A4 | *Criar conta* com senhas diferentes | "As senhas não conferem." |
| A5 | Criar conta válida | Entra direto na *Início* |
| A6 | Fechar e reabrir o app | Continua logado (sessão persistida) |
| A7 | *Perfil → Sair* | Volta para *Entrar* |

### Projetos e equilíbrio

| # | Passo | Resultado esperado |
|---|---|---|
| P1 | *Projetos → +* sem preencher | Erros em nome, disciplina e data |
| P2 | Criar projeto com entrega "+2 semanas" | Abre o detalhe do projeto recém-criado |
| P3 | Convidar e-mail inexistente | "Nenhuma conta TaskPair com esse e-mail…" |
| P4 | Convidar e-mail de outra conta | Integrante aparece em *Por integrante* |
| P5 | Criar 1 tarefa peso 8 para você e 1 peso 2 para o colega | Score cai, barra 80/20, alerta *"A carga está concentrada"* |
| P6 | Reatribuir uma tarefa para equilibrar | Score sobe, alerta some (Início e projeto) |
| P7 | Arquivar projeto | Some da lista de projetos |

### Tarefas e quadro

| # | Passo | Resultado esperado |
|---|---|---|
| T1 | *Nova tarefa* sem peso | "O peso é obrigatório…" |
| T2 | Tarefa sem responsável | Aparece no pool com botão *Pegar esta tarefa* |
| T3 | *Pegar esta tarefa* no quadro | Seu avatar aparece no cartão; Painel recalcula |
| T4 | *Fazendo →* / *Revisão →* / *Concluído →* | Cartão muda de coluna; contagens nas abas atualizam |
| T5 | Concluir tarefa | Detalhe mostra "concluída em DD/MM/AAAA"; progresso do projeto sobe |
| T6 | Filtro *Minhas* no quadro | Só tarefas atribuídas a você |
| T7 | Data "31/02/2026" no prazo | "Data inválida." |
| T8 | Excluir tarefa | Some do quadro e da Início |

### Geral

| # | Passo | Resultado esperado |
|---|---|---|
| G1 | *Perfil → Aparência → Escuro* | Todo o app troca para o tema escuro; preferência mantida ao reabrir |
| G2 | Puxar para baixo na Início/Projetos | Indicador de atualização e dados recarregados |
| G3 | Modo avião com Supabase configurado | Mensagem "Sem conexão com o servidor" e botão *Tentar de novo* |
| G4 | TalkBack ligado | Botões, abas e cartões anunciam rótulo e estado |

---

## 3. Teste de integração com o Supabase

Executado em 27/10/2026 com o APK `TaskPair-v1.0.0.apk` (Supabase) no emulador Pixel 7, usando duas contas de teste (A criada pela tela de cadastro do app, B criada pela API de Auth). As verificações de banco foram feitas pela API REST do Supabase com o token de cada conta.

| # | Passo | Resultado |
|---|---|---|
| S1 | Tabelas `profiles`, `projects`, `members`, `tasks` respondem na API | ✅ HTTP 200 |
| S2 | *Confirm email* desligado (`mailer_autoconfirm`) | ✅ |
| S3 | Conta A: *Criar conta* no app | ✅ Entrou direto na Início; perfil criado pelo trigger |
| S4 | Conta A: *Gerar projeto de exemplo* | ✅ Projeto + integrante *owner* + 6 tarefas gravados (RLS de escrita ok) |
| S5 | Conta A: convidar `B` por e-mail | ✅ "Pedro Teste agora faz parte do projeto"; Painel passou a 0/100 com alerta |
| S6 | Conta B (API): listar projetos e tarefas | ✅ Vê o projeto e as 6 tarefas só depois do convite |
| S7 | Sem login (só a chave *anon*): listar projetos | ✅ Lista vazia — RLS bloqueia |
| S8 | Conta A: reatribuir "Formatar referências" para B no detalhe da tarefa | ✅ Banco mostra a tarefa atribuída a B |
