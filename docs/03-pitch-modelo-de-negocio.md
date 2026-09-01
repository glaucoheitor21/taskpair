# Pitch e Modelo de Negócio — TaskPair

---

## 1. O pitch em trinta segundos

> Todo estudante já carregou um trabalho em grupo sozinho. O problema nunca foi falta de app de tarefas — é que Trello, Notion e Asana mostram **o que falta fazer**, e nenhum deles mostra **quem está fazendo quanto**.
>
> O TaskPair atribui um peso a cada tarefa e transforma isso em uma barra: a divisão de esforço do grupo, visível na tela inicial, na segunda semana e não na véspera da entrega.
>
> Não é vigilância. É o dado neutro que faz a conversa difícil acontecer enquanto ainda dá tempo de redistribuir.
>
> **TaskPair — trabalhos em grupo sem trabalho desigual.**

---

## 2. Por que agora

Três coisas mudaram e se somam:

1. **O mercado está no ponto máximo de matrículas.** O Censo do Inep de 2024 registrou mais de **10 milhões de estudantes** no ensino superior brasileiro, recorde histórico.
2. **Metade desse total é EaD** — 50,7%, e crescendo 5,6% ao ano. Grupo de EaD quase nunca se encontra presencialmente, o que torna a coordenação assíncrona não um conforto, mas a única opção.
3. **As ferramentas genéricas apertaram o plano gratuito.** O Trello limita o plano Free a 10 quadros e 10 colaboradores por workspace, com 250 execuções de automação por mês; o primeiro plano pago custa US$ 5 por usuário/mês. Cobrar por assento é exatamente o modelo errado para um grupo de cinco estudantes que existe por um semestre.

O produto que ganha esse usuário não é um Trello mais barato. É um produto que resolve o problema específico — divisão de esforço — que o Trello nunca se propôs a resolver.

---

## 3. Concorrência

### Comparativo direto

| | **TaskPair** | Trello | Notion | Asana | Google Classroom |
|---|---|---|---|---|---|
| Kanban | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Peso por tarefa** | ✅ nativo | ⚠️ só via Power-Up pago | ⚠️ campo manual | ⚠️ campo customizado (plano pago) | ❌ |
| **Divisão de esforço visível** | ✅ **Painel de Equilíbrio** | ❌ | ❌ | ❌ | ❌ |
| Alerta de concentração de carga | ✅ | ❌ | ❌ | ❌ | ❌ |
| Progresso ponderado por esforço | ✅ | ❌ (conta cartões) | ❌ | ❌ | ❌ |
| Feito para o ciclo acadêmico | ✅ | ❌ | ❌ | ❌ | ✅ |
| Custo de configuração inicial | Baixo | Médio | **Alto** | Alto | Baixo |
| Preço para um grupo de 5 | **Gratuito** | US$ 25/mês no Standard | Gratuito com limites | US$ 55/mês no Starter | Gratuito |

### Onde cada um erra, do ponto de vista deste usuário

- **Trello** — o mais próximo em uso real. Excelente em *estado da tarefa*, cego para *carga por pessoa*. Precificação por assento não faz sentido para um grupo temporário, e o plano gratuito estrangula justamente quem tem 4 trabalhos simultâneos.
- **Notion** — poderosíssimo e, por isso mesmo, um projeto em si. Montar a base de dados certa consome uma noite que o grupo não tem. Alta desistência antes do primeiro uso produtivo.
- **Asana / ClickUp** — construídos para empresas com processo e gestor. Vocabulário, densidade e preço fora do contexto acadêmico.
- **Google Classroom** — canal do professor para o aluno, não do aluno para o grupo. Não organiza trabalho interno de equipe.
- **WhatsApp + planilha** — o verdadeiro concorrente, com participação de mercado esmagadora. Custo zero, atrito zero, memória zero.

### O diferencial, em uma frase

**Todos os concorrentes medem progresso. Só o TaskPair mede equilíbrio.**

E o diferencial é defensável porque não é uma funcionalidade a mais: depende de o peso da tarefa ser obrigatório e nativo desde o primeiro cadastro. Um concorrente que quisesse copiar precisaria mudar o modelo de dados de milhões de quadros existentes — ou lançar um produto separado, que é onde nós já estaríamos.

---

## 4. Modelo de negócio

**Freemium com conversão institucional.** Três camadas, e a decisão mais importante é o que fica de fora do pagamento.

### TaskPair Free — R$ 0

Tudo que um grupo precisa para um trabalho: projetos ilimitados, integrantes ilimitados, Kanban completo, Painel de Equilíbrio e histórico do semestre corrente.

**O Painel de Equilíbrio nunca entra no plano pago.** É o recurso que define o produto; colocá-lo atrás de um paywall mataria a adoção e o boca a boca no mesmo movimento. O plano gratuito precisa ser bom o bastante para o grupo inteiro instalar sem discutir — porque cada instalação traz de 3 a 6 usuários de uma vez.

### TaskPair Plus — R$ 9,90/mês ou R$ 79/ano

Para o usuário individual que já adotou e quer mais:

- Histórico completo entre semestres e portfólio de contribuição exportável
- Relatório de contribuição em PDF assinado pelo grupo
- Integração de prazos com Google Calendar
- Modelos de projeto reutilizáveis (TCC, seminário, projeto integrador)
- Temas e personalização visual

Preço calibrado abaixo do Spotify universitário — a referência mental de "assinatura barata" desse público. O pagante é o estudante organizado, tipicamente o perfil da persona Glauco: aquele que já usa o app para 4 trabalhos ao mesmo tempo.

### TaskPair Edu — licença institucional

Venda para coordenações de curso e instituições, precificada por aluno ativo/semestre (faixa-alvo de R$ 4 a R$ 8, com desconto por volume). Entrega painel do professor com relatórios consentidos pelo grupo, SSO institucional e dados agregados por turma.

É onde a receita real mora. O B2C valida e distribui; o B2B sustenta.

### O que explicitamente não fazemos

**Anúncios.** Um app que exibe banner no meio de um quadro de trabalho perde a credibilidade que a proposta exige — e o CPM de estudante brasileiro não pagaria a conta de qualquer forma.

**Venda de dados de contribuição.** Os dados do TaskPair descrevem o desempenho de pessoas identificáveis. Vendê-los ou usá-los para treinar qualquer coisa sem consentimento explícito destruiria o princípio de "transparência, não vigilância" que sustenta o produto inteiro. Isso está no documento de escopo e vale como restrição de negócio, não só de engenharia.

---

## 5. Tamanho de mercado

Estimativa em três camadas, a partir do Censo 2024 do Inep:

| Camada | Cálculo | Resultado |
|---|---|---|
| **TAM** — estudantes de graduação no Brasil | Censo Inep 2024 | **10 milhões** |
| **SAM** — cursos com trabalho em grupo frequente (~40% das matrículas) | 10 mi × 40% | **4 milhões** |
| **SOM** — meta realista em 3 anos (1% do SAM) | 4 mi × 1% | **40 mil usuários ativos** |

Com 40 mil ativos e 4% de conversão para o Plus a R$ 79/ano, chega-se a **~R$ 126 mil/ano** de receita B2C. É pouco — e é justamente esse cálculo que mostra por que o TaskPair Edu não é um extra opcional: **cinco instituições de médio porte com 3 mil alunos cada, a R$ 6 por aluno/semestre, geram R$ 180 mil/ano** com um esforço comercial muito menor.

O B2C é o canal de aquisição e a prova social. O B2B é o negócio.

---

## 6. Aquisição

O ciclo do produto tem uma vantagem estrutural: **cada projeto criado convida de 2 a 5 pessoas**. O coeficiente viral está embutido no uso, não numa campanha.

1. **Convite por link.** O integrante entra no quadro antes de criar conta. Atrito de entrada quase zero.
2. **Boca a boca de sala.** O ganho é imediato e visível — a barra do Painel de Equilíbrio numa conversa de corredor vende sozinha.
3. **Embaixadores por curso.** Um estudante por curso, com acesso ao Plus, apresenta o app na primeira semana de aula.
4. **Do aluno para a coordenação.** Adoção orgânica em várias turmas é a porta de entrada da venda institucional — o caminho clássico de produtos como Notion e Figma.
5. **Conteúdo de nicho.** Material sobre divisão justa de trabalho acadêmico e *social loafing*, que atrai tanto estudante quanto professor.

**Sazonalidade a favor:** a demanda tem dois picos previsíveis por ano, no início de cada semestre letivo. É quando o marketing concentra esforço e quando os grupos se formam.

---

## Fontes

- [Inep — Censo da Educação Superior 2024](https://www.gov.br/inep/pt-br/centrais-de-conteudo/noticias/censo-da-educacao-superior/inep-divulga-resultado-do-censo-superior-2024)
- [Trello — planos e preços](https://trello.com/pricing)
- [Limites do plano gratuito do Trello em 2026 — Costbench](https://costbench.com/software/project-management/trello/free-plan/)
