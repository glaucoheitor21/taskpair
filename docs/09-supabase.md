# Banco de dados — Supabase

O TaskPair usa o [Supabase](https://supabase.com) (PostgreSQL gerenciado + autenticação) como backend. O app fala direto com o banco pelo SDK `@supabase/supabase-js`; quem garante que cada pessoa só enxergue os próprios projetos é o **Row Level Security** do PostgreSQL, não o app.

---

> **Estado:** o projeto Supabase do grupo está configurado e o APK `TaskPair-v1.0.0.apk` aponta para ele. Testado em 27/10/2026 no emulador: cadastro pelo app, projeto de exemplo, convite por e-mail, reatribuição de tarefa e isolamento por RLS (ver [`docs/07-testes.md`](07-testes.md#3-teste-de-integração-com-o-supabase)).

## 1. Modelo

```mermaid
erDiagram
    auth_users ||--|| profiles : "trigger cria"
    profiles ||--o{ members : participa
    projects ||--o{ members : tem
    projects ||--o{ tasks : contém
    profiles |o--o{ tasks : "responsável (opcional)"

    profiles { uuid id PK; text name; text email; text initials; text color }
    projects { uuid id PK; text name; text subject; text description; date due_date; uuid created_by FK; bool archived }
    members  { uuid project_id PK; uuid user_id PK; text role; date joined_at }
    tasks    { uuid id PK; uuid project_id FK; text title; text status; smallint weight; uuid assignee_id FK; date due_date; date completed_at }
```

Regras garantidas pelo próprio banco (`check`): `weight in (1,2,3,5,8)`, `status in ('todo','doing','review','done')`, `role in ('owner','member')`. O `ProjectBalance` **não** é tabela: é recalculado no app a partir das tarefas (ver [`src/utils/workload.ts`](../src/utils/workload.ts)).

Script completo: [`supabase/schema.sql`](../supabase/schema.sql).

## 2. Segurança (RLS)

| Tabela | Ler | Escrever |
|---|---|---|
| `profiles` | qualquer usuário logado (necessário para convidar por e-mail) | só o próprio perfil |
| `projects` | integrantes do projeto | criar: qualquer logado como `created_by`; editar: integrantes; excluir: criador |
| `members` | integrantes | adicionar: integrantes ou criador; remover: integrantes |
| `tasks` | integrantes | integrantes |

A função `is_member(project_id)` é `security definer` para evitar recursão de políticas entre `projects` e `members`.

## 3. Configurar (≈5 minutos)

1. Crie uma conta e um projeto gratuito em <https://supabase.com/dashboard>.
2. **SQL Editor → New query**, cole o conteúdo de [`supabase/schema.sql`](../supabase/schema.sql) e clique **Run**.
3. **Authentication → Sign In / Providers → Email**: desligue **Confirm email** (para o cadastro entrar direto, sem precisar abrir o e-mail).
4. **Project Settings → API**: copie a *Project URL* e a chave *anon public*.
5. Na raiz do repositório, copie `.env.example` para `.env` e preencha:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

6. Reinicie o Expo (`npx expo start -c`). No app, **Perfil → Sobre** mostra *Dados: Supabase (nuvem)*.

Para o APK, as variáveis `EXPO_PUBLIC_*` são embutidas no momento do build — gere o APK depois de criar o `.env`.

> A chave *anon* é pública por design (vai dentro do app); a proteção dos dados vem das políticas RLS acima. **Nunca** coloque a chave `service_role` no app.

## 4. Modo local (sem Supabase)

Sem as variáveis, o app entra no **modo local**: os dados de [`src/mocks/`](../src/mocks) são copiados para o AsyncStorage na primeira execução e todas as alterações ficam salvas no aparelho. É o modo usado pelos testes automatizados e serve de demonstração offline. Conta de demonstração: `glauco@fiap.com.br` / `123456` (as quatro contas dos mocks usam a mesma senha).
