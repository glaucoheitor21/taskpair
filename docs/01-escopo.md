# Documento de Escopo — TaskPair

> **TaskPair — trabalhos em grupo sem trabalho desigual.**

| | |
|---|---|
| **Disciplina** | Mobile Development |
| **Checkpoint** | CP4 — Idealização |
| **Versão** | 1.0 — setembro de 2026 |
| **Autores** | Glauco Heitor Gonçalves e Silva (RM 555978) · Pedro Henrique Junqueira (RM 556278) |

---

## 1. O problema

Trabalho em grupo é obrigatório na graduação e quase sempre mal distribuído. O fenômeno tem nome na literatura de psicologia organizacional — *social loafing*, ou "efeito carona": quanto maior o grupo, menor o esforço individual percebido como necessário, porque a contribuição de cada um deixa de ser identificável.

O detalhe importante é **onde** o problema mora. Não é falta de ferramenta de tarefas: existem dezenas. É que as ferramentas existentes tornam visível **o que falta fazer**, e nunca **quem está fazendo quanto**. Um quadro Kanban com 40 cartões, dos quais 31 têm o mesmo rosto no avatar, não avisa ninguém de nada — a informação está lá, mas ninguém soma.

Três consequências práticas, todas familiares para qualquer estudante:

1. **A conversa difícil nunca acontece na hora certa.** O desequilíbrio só vira assunto na véspera da entrega, quando já não dá para redistribuir. Antes disso, cobrar um colega parece acusação — falta um dado neutro em que se apoiar.
2. **O grupo perde o controle do prazo.** Sem visão consolidada, ninguém sabe se o trabalho está a 30% ou a 70% até alguém abrir todos os arquivos.
3. **A avaliação é injusta e todos sabem.** O professor atribui uma nota única a um esforço que não foi único, e não tem como saber de outra forma.

### O que já se tenta hoje (e por que não resolve)

| Solução improvisada | Por que falha |
|---|---|
| Grupo de WhatsApp | Combinado se perde no scroll; ninguém tem visão de estado |
| Planilha compartilhada no Drive | Precisa de disciplina manual de atualização; morre na segunda semana |
| Trello / Notion | Bom para *o que fazer*; não mede *quem fez quanto*, e o plano gratuito trava em 10 quadros por workspace |
| Nada — "a gente se vira" | É o caso mais comum, e é o pior |

---

## 2. Público-alvo

### Público primário

**Estudantes de graduação brasileiros que fazem trabalho em grupo com frequência.** Segundo o Censo da Educação Superior 2024 do Inep, o Brasil ultrapassou **10 milhões de matrículas** no ensino superior, com 50,7% delas em EaD — modalidade em que o trabalho em grupo é ainda mais dependente de coordenação assíncrona, porque o grupo raramente se encontra.

Recorte de uso: cursos com muitos projetos em equipe (Engenharia, ADS, Design, Administração, Ciências da Saúde), tipicamente em grupos de 3 a 6 pessoas, com 2 a 5 trabalhos em grupo simultâneos por semestre.

### Público secundário

- **Professores e coordenadores**, que podem receber, com consentimento do grupo, um relatório de contribuição como insumo — nunca como substituto — da avaliação.
- **Grupos de estudo e projetos de extensão**, que têm a mesma dinâmica sem a pressão da nota.

### Personas

**Glauco, 21 anos, 4º semestre de ADS.**
É quem puxa o trabalho. Já assumiu a apresentação inteira duas vezes porque "não ia dar tempo de esperar". Não quer brigar com ninguém; quer poder mostrar a divisão na tela e deixar o grupo tirar a própria conclusão.
*Precisa de:* um dado neutro que substitua a acusação.

**Marina, 19 anos, 2º semestre.**
Quer participar, mas chega no grupo já formado e não sabe o que pegar. Fica com as tarefas menores por padrão e depois é vista como quem fez pouco.
*Precisa de:* enxergar o que está livre e reivindicar antes que alguém pegue.

**Prof. Rafael, coordenador de disciplina.**
Avalia 12 grupos por semestre. Suspeita do desequilíbrio, não tem como comprovar.
*Precisa de:* evidência opcional, gerada pelo próprio grupo, sem virar vigilância.

---

## 3. Proposta de valor

> **O TaskPair não organiza tarefas. Ele torna a divisão de esforço visível cedo o bastante para o grupo consertá-la sozinho.**

O que sustenta essa promessa é uma decisão de produto: **toda tarefa tem um peso**. Escrever a fundamentação teórica não é o mesmo esforço que formatar as referências, e um app que conta cartões finge que é. Com peso, o TaskPair consegue responder a pergunta que nenhum concorrente responde — *"quanto do trabalho é meu?"* — em uma barra, na tela inicial, na segunda semana e não na véspera.

### Painel de Equilíbrio

O recurso central. Uma barra empilhada, uma faixa por integrante, proporcional ao peso das tarefas atribuídas. Abaixo dela, um **Balance Score** de 0 a 100, onde 100 é divisão perfeitamente igual. Quando alguém ultrapassa 15 pontos percentuais acima da divisão ideal, o app sinaliza — sem julgamento, sem ranking, sem notificar o resto do grupo às escondidas. A frase que aparece é *"a carga está concentrada. Querem redistribuir?"*, e não *"fulano está fazendo pouco"*.

O cálculo é público e documentado (`src/utils/workload.ts`). Isso é deliberado: uma métrica que decide sobre pessoas precisa ser auditável, ou vira arbitrariedade.

### Princípios de design que decorrem disso

1. **Transparência, não vigilância.** O app mostra dados que o próprio grupo inseriu. Não rastreia tempo de tela, não monitora atividade, não pontua pessoas.
2. **O grupo decide, o app informa.** Nenhuma redistribuição é automática. O TaskPair aponta; a conversa é humana.
3. **Peso antes de contagem.** Toda métrica do produto é ponderada por esforço, incluindo a barra de progresso do projeto.
4. **Custo de entrada zero.** Se exigir 15 minutos de configuração, o grupo volta para o WhatsApp. Criar projeto e convidar por link tem que caber em um minuto.

---

## 4. Escopo funcional

### MVP — o que entra até o CP6

| # | Requisito | Prioridade |
|---|---|---|
| RF01 | Cadastro e login com e-mail e senha | Must |
| RF02 | Criar, editar e arquivar projetos (nome, disciplina, prazo final) | Must |
| RF03 | Convidar integrantes por link ou e-mail; papéis *owner* e *member* | Must |
| RF04 | Criar tarefa com título, descrição, **peso (1, 2, 3, 5, 8)**, responsável e prazo | Must |
| RF05 | Quadro Kanban com quatro colunas: A fazer · Fazendo · Revisão · Concluído | Must |
| RF06 | Mover tarefa entre colunas | Must |
| RF07 | **Painel de Equilíbrio** com Balance Score e alerta de concentração | Must |
| RF08 | Home com próximos prazos, pendências e carga individual | Must |
| RF09 | Progresso do projeto calculado por peso concluído | Must |
| RF10 | Perfil com histórico de contribuição | Should |
| RF11 | Notificação local de prazo próximo (D-3 e D-1) | Should |
| RF12 | Tarefas sem responsável ficam em um "pool" que qualquer integrante pode reivindicar | Should |
| RF13 | Exportar relatório de contribuição em PDF | Could |
| RF14 | Modo escuro | Could |

### Fora de escopo neste semestre

Chat interno (o grupo já tem WhatsApp e não vai migrar), upload de arquivos, integração com Google Classroom / Canvas, versão web, e qualquer forma de gamificação por pontos — que empurraria o produto exatamente para o lado da vigilância que ele recusa.

### Requisitos não funcionais

| # | Requisito |
|---|---|
| RNF01 | Android 8+ (API 26), entregue como APK instalável |
| RNF02 | React Native com Expo, TypeScript em modo `strict` |
| RNF03 | Interface em português do Brasil |
| RNF04 | Contraste mínimo AA (WCAG 2.1) em todo texto; alvos de toque ≥ 44 dp |
| RNF05 | Telas principais respondendo em até 300 ms com dados mockados |
| RNF06 | Nenhuma cor, fonte ou espaçamento fora dos tokens de `src/theme` |
| RNF07 | Dados sensíveis apenas em `AsyncStorage`; nenhum segredo no repositório |

---

## 5. Fluxo principal do usuário

```
Cadastro/Login
      │
      ▼
   Home ──────────────► "3 tarefas suas vencem esta semana"
      │                 "Você está com 52% da carga do Trabalho de Mobile"
      │
      ├─► Criar projeto ─► Convidar por link ─► Criar tarefas (com peso)
      │
      └─► Abrir projeto
                │
                ├─► Kanban ──► arrastar tarefa ──► status atualizado
                │
                └─► Painel de Equilíbrio
                          │
                          ├─ equilibrado  ─► segue o jogo
                          └─ concentrado  ─► "querem redistribuir?"
                                              │
                                              └─► reatribuir tarefas do pool
```

---

## 6. Métricas de sucesso

Como saberíamos que o TaskPair funcionou, e não apenas que foi instalado:

| Métrica | Alvo |
|---|---|
| Grupos que atribuem peso a ≥ 80% das tarefas | 70% |
| Balance Score médio dos projetos concluídos | ≥ 75 |
| Projetos em que uma redistribuição aconteceu após um alerta | ≥ 40% |
| Retenção do grupo até a data de entrega do trabalho | ≥ 60% |

A terceira linha é a que importa. Um alerta que ninguém age é um alerta inútil.

---

## 7. Riscos e mitigações

| Risco | Impacto | Mitigação |
|---|---|---|
| Grupo não atribui peso e a métrica perde sentido | Alto | Peso padrão 2, sugestão automática por título, e o Painel avisa quando há muitas tarefas sem peso |
| App vira instrumento de cobrança agressiva | Alto | Linguagem sempre coletiva; nenhum ranking individual; nenhuma notificação sobre um integrante para os demais |
| Adoção parcial — só uma pessoa usa | Médio | Convite por link sem cadastro prévio; leitura do quadro funciona antes do login |
| Escopo maior que o semestre | Médio | MVP fechado acima; RF13/RF14 só se sobrar tempo |
| Dupla pequena para backend + frontend | Médio | CP5 inteiro com dados mockados; API só no CP6, com contrato já definido em `src/services/api.ts` |

---

## Fontes

- [Inep — Censo da Educação Superior 2024](https://www.gov.br/inep/pt-br/centrais-de-conteudo/noticias/censo-da-educacao-superior/inep-divulga-resultado-do-censo-superior-2024)
- [Trello — planos e preços](https://trello.com/pricing)
