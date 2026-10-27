# Manual de uso — TaskPair

Guia rápido para quem vai usar o app no trabalho em grupo.

---

## Instalar

**Android (APK):** baixe na página de [Releases](https://github.com/glaucoheitor21/taskpair/releases) do repositório, abra o arquivo no celular e permita *instalar apps desta fonte* quando o Android pedir. O app aparece com o ícone violeta do check.

- `TaskPair-v1.0.0.apk` — versão conectada ao banco (Supabase). Precisa de internet; cada pessoa cria a própria conta.
- `TaskPair-v1.0.0-offline-demo.apk` — versão de demonstração, funciona sem internet com dados de exemplo.

**Expo Go (desenvolvimento):** veja *Como rodar* no [README](../README.md#como-rodar).

## 1. Entrar

- **Tem conta?** Digite e-mail e senha e toque **Entrar**.
- **Primeira vez?** Toque **Criar conta**, informe nome, e-mail e uma senha de pelo menos 6 caracteres.
- **Só quer conhecer?** No APK *offline-demo*, toque no cartão **Modo demonstração** — você entra como *Glauco* com três projetos de exemplo.

A sessão fica salva: da próxima vez o app abre direto na tela inicial.

## 2. Tela Início

- **Sua carga total** — quanto do trabalho distribuído nos seus projetos está com você, e se isso está acima, abaixo ou na média da divisão dos seus grupos.
- **Alerta amarelo** — aparece quando a carga de algum projeto está concentrada em alguém. Toque em *Ver Painel de Equilíbrio*.
- **Próximos prazos** — suas tarefas abertas, das mais urgentes para as menos. Vermelho = atrasada; âmbar = vence em até 3 dias.
- **Tarefas sem responsável** — quantas estão no pool esperando alguém pegar.

Puxe a tela para baixo para atualizar.

## 3. Criar um projeto e chamar o grupo

1. Aba **Projetos** → botão **+** (canto inferior direito).
2. Preencha nome do trabalho, disciplina e data de entrega (use os atalhos *+1 semana*, *+2 semanas* ou digite DD/MM/AAAA).
3. No projeto criado, desça até **Convidar integrante** e digite o e-mail da conta TaskPair do colega. Ele precisa ter criado a conta antes.

## 4. Criar tarefas — e por que o peso importa

Toque **Nova tarefa** no projeto (ou **+** no quadro).

- **Peso** é obrigatório: 1 (rapidinha), 2 (uma tarde), 3 (um ou dois dias), 5 (boa parte da semana), 8 (enorme — considere dividir). É o peso, não a quantidade de tarefas, que o app usa para medir quem está fazendo quanto.
- **Responsável** pode ser alguém do grupo ou *Ninguém (pool)* — tarefas no pool podem ser pegas por qualquer integrante.
- **Prazo** é opcional.

## 5. Quadro Kanban

Toque **Ver quadro** no projeto.

- Arraste para o lado (ou toque nas abas do topo) para ver as colunas **A fazer → Fazendo → Revisão → Concluído**.
- **Pegar esta tarefa** coloca a tarefa do pool no seu nome.
- O botão **Fazendo →** (ou a próxima coluna) avança o cartão.
- Filtros: **Todas**, **Minhas**, **Sem responsável**.
- Toque no cartão para abrir os detalhes, editar qualquer campo, mudar a coluna, reatribuir ou excluir.

## 6. Painel de Equilíbrio

No detalhe do projeto:

- **Balance Score** de 0 a 100 — 100 é a divisão perfeitamente igual.
- **Barra colorida** — a fatia de cada integrante, na cor do avatar dele.
- **Por integrante** — percentual da carga e quantos pontos percentuais (p.p.) acima ou abaixo da divisão ideal.
- **Pontos sem responsável** — o peso que ainda está no pool e, por isso, fica fora da conta.

Quando alguém passa de 15 p.p. acima do ideal, o app sugere redistribuir. A decisão é sempre do grupo: o TaskPair aponta, a conversa é humana.

## 7. Perfil

- Suas estatísticas: tarefas concluídas, em aberto e peso entregue.
- **Minha contribuição** — sua fatia em cada projeto comparada à divisão ideal.
- **Aparência** — tema do sistema, claro ou escuro.
- **Sobre** — mostra se o app está usando o Supabase (nuvem) ou dados locais.
- **Sair** encerra a sessão. No modo demonstração há também *Restaurar dados de demonstração*.

## Perguntas frequentes

**Convidei e deu "Nenhuma conta com esse e-mail".** O colega precisa criar a conta no app primeiro, com o mesmo e-mail.

**Por que minha tarefa de peso 8 pesa mais do que três de peso 2?** Porque esforço não é contagem de cartões. É o princípio do app.

**O app avisa o professor?** Não. Os dados são só do grupo e ninguém é pontuado.
