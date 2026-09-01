# Marca e Identidade Visual — TaskPair

<img src="assets/logo-256.png" alt="Símbolo do TaskPair" width="120">

---

## 1. Nome

**TaskPair.**

`Task` entrega a categoria sem rodeio — é um app de tarefas, e o usuário sabe disso em meio segundo. `Pair` carrega o argumento: tarefa **em par**, dividida, com contrapartida. O nome já diz que o problema não é a tarefa, é a divisão dela.

Também funciona como verbo (*"pareia as tarefas"*), é pronunciável em português sem esforço, tem domínio e handle plausíveis, e não colide com marcas registradas relevantes na categoria de produtividade.

**Tagline:** *Trabalhos em grupo sem trabalho desigual.*

Ela faz o trabalho de posicionamento em seis palavras: repete "trabalho" em dois sentidos diferentes — o acadêmico e o esforço — e coloca o problema (desigualdade) no lugar da promessa genérica de organização que todo concorrente já usa.

---

## 2. Símbolo

O símbolo é **um check formado por dois traços de cores diferentes que se encontram**.

Por que este desenho e não outro:

- **O check é a categoria.** Ninguém precisa aprender o que ele significa — tarefa concluída. É o vocabulário visual que o usuário já tem.
- **A quebra é o argumento.** Um check normal é um traço só. O do TaskPair são dois, de cores distintas, que se tocam no vértice: cada traço é um integrante, e **o check só existe porque os dois aparecem**. A metáfora é a tese do produto inteiro em uma forma que cabe em 48 pixels.
- **A proporção não é acidental.** Os traços estão em razão aproximada de 1 : 1,6 — desiguais o bastante para o check ser legível como check, próximos o bastante para lerem como dois elementos de mesma importância. Um traço muito curto viraria um detalhe decorativo e a metáfora se perderia.

Teste de escala: o símbolo permanece legível a 24 px (favicon, avatar de grupo), que é o pior caso previsto.

### Arquivos

| Arquivo | Uso |
|---|---|
| `brand/taskpair-symbol.svg` | Símbolo em container violeta — ícone do app, avatar, splash |
| `brand/taskpair-symbol-light.svg` | Símbolo sem container, para fundos claros |
| `brand/taskpair-horizontal.svg` | Assinatura horizontal — README, apresentação, cabeçalho |
| `brand/*.png` | Exportações em 1024 px e 1280 px |

### Usos proibidos

Não distorcer proporção, não trocar as cores dos traços entre si, não aplicar contorno ou sombra no símbolo, não usar o símbolo violeta sobre fundo violeta, não rotacionar, e não reconstruir o check com um traço só.

**Área de respiro:** margem livre equivalente à espessura de um traço em todos os lados.

---

## 3. Paleta

A regra que organiza a paleta: **violeta é "eu", menta é "o grupo".** As duas cores nunca aparecem em proporção arbitrária — o equilíbrio entre elas na tela é a própria metáfora do produto. É por isso que o Painel de Equilíbrio é o lugar onde a marca aparece mais forte.

### Cores principais

| Token | Hex | Contraste sobre branco | Uso |
|---|---|---|---|
| `violet600` | `#5B3CF0` | **6,27:1** ✅ AA | Cor primária: botões, links, estado ativo, marca |
| `violet700` | `#4A2ED6` | **7,92:1** ✅ AAA | Estado pressionado, texto sobre fundo claro |
| `violet500` | `#7458F5` | 4,71:1 ✅ AA | Realce secundário |
| `violet50` | `#EFEBFE` | — | Fundo de destaque, cartão selecionado |
| `mint500` | `#14C4A9` | 2,21:1 ⚠️ | **Apenas preenchimento** — progresso, status concluído |
| `mint800` | `#0B7A6B` | **5,24:1** ✅ AA | Versão da menta segura para texto |

### Neutros

| Token | Hex | Contraste | Uso |
|---|---|---|---|
| `ink` | `#12121C` | 18,60:1 ✅ AAA | Texto principal |
| `ink70` | `#3A3F52` | 10,43:1 ✅ AAA | Texto secundário |
| `ink50` | `#5B6478` | 5,93:1 ✅ AA | Texto de apoio, legendas |
| `border` | `#E3E6F0` | — | Divisórias e bordas |
| `surface` | `#FFFFFF` | — | Cartões |
| `background` | `#F7F8FC` | — | Fundo das telas |

### Semânticas

| Token | Hex | Contraste | Uso |
|---|---|---|---|
| `amber500` | `#F5A524` | 2,04:1 ⚠️ | Preenchimento — prazo próximo |
| `amber800` | `#8A5A00` | **5,93:1** ✅ AA | Texto de aviso |
| `red500` | `#F04E5B` | 3,53:1 ⚠️ | Preenchimento — atrasado |
| `red700` | `#C4293A` | **5,64:1** ✅ AA | Texto de erro |

> **Regra de acessibilidade da marca:** menta, âmbar e vermelho vivos **nunca** carregam texto. Cada um tem um par escuro para isso. Todos os valores acima foram medidos com a fórmula de contraste da WCAG 2.1 (script em `docs/`), não estimados a olho.

### Modo escuro

| Token | Hex | Contraste sobre `#0E0E18` |
|---|---|---|
| `darkBackground` | `#0E0E18` | — |
| `darkSurface` | `#181828` | — |
| `darkInk` | `#EDEDF5` | 16,47:1 ✅ AAA |
| `darkInk50` | `#A0A4B8` | 7,76:1 ✅ AAA |
| `violet300` | `#A996FF` | 7,76:1 ✅ AAA — primária no escuro |
| `mint300` | `#4FE0C6` | 11,70:1 ✅ AAA |

A primária clareia no modo escuro porque `#5B3CF0` sobre `#0E0E18` não passa de 2:1. Manter a mesma cor nos dois temas é o erro mais comum de dark mode.

---

## 4. Tipografia

**Sora** para títulos e números. **Inter** para interface e corpo de texto.

Por quê: a Sora é geométrica, com terminações retas e um contraste de peso que dá autoridade a um número grande — e o TaskPair mostra números grandes o tempo todo (Balance Score, percentual de carga, dias até o prazo). A Inter foi desenhada especificamente para telas, com altura de x alta, o que mantém rótulos de 12–13 px legíveis num celular na mão.

As duas são open source (SIL Open Font License) e distribuídas via `@expo-google-fonts` — sem custo, sem risco de licença no APK, e sem download em tempo de execução.

### Escala tipográfica

Escala modular de razão ~1,20 sobre base 16.

| Token | Fonte / peso | Tamanho / entrelinha | Uso |
|---|---|---|---|
| `display` | Sora Bold | 32 / 38 | Balance Score, números de destaque |
| `h1` | Sora SemiBold | 24 / 30 | Título de tela |
| `h2` | Sora SemiBold | 20 / 26 | Título de seção, nome do projeto |
| `h3` | Inter SemiBold | 17 / 22 | Título de cartão |
| `body` | Inter Regular | 15 / 22 | Corpo de texto |
| `bodyStrong` | Inter Medium | 15 / 22 | Ênfase no corpo |
| `label` | Inter Medium | 13 / 18 | Rótulos de campo, chips |
| `caption` | Inter Regular | 12 / 16 | Metadados, datas |
| `overline` | Inter SemiBold | 11 / 14, +0,8 tracking, caixa alta | Cabeçalho de coluna do Kanban |

---

## 5. Tokens de layout

**Espaçamento** — escala de 4 pt: `2 · 4 · 8 · 12 · 16 · 24 · 32 · 48`. Todo padding e margem sai daqui; nenhum valor solto.

**Raios de canto** — `sm 8` · `md 12` · **`card 16`** · `lg 20` · `pill 999`. O raio 16 é o raio da marca: é a mesma proporção do container do símbolo, então cartão de tarefa e ícone do app compartilham a mesma silhueta.

**Elevação** — sombras usam violeta (`#2A1E6B`) em vez de preto. Sombra preta sobre fundo azulado acinzenta a interface; a sombra violeta se integra ao fundo.

**Toque** — alvo mínimo de 44 dp em qualquer elemento interativo.

Todos estes valores vivem em `src/theme/` e são a única fonte da verdade. Cor, fonte ou espaçamento escrito direto numa tela é considerado bug de revisão de código.

---

## 6. Voz e tom

O TaskPair fala como um colega de grupo organizado, não como um gerente de projeto e muito menos como um fiscal.

| Situação | ✅ Escrevemos | ❌ Não escrevemos |
|---|---|---|
| Carga concentrada | "A carga está concentrada. Querem redistribuir?" | "Glauco está sobrecarregado e Pedro está com 12%." |
| Tarefa atrasada | "Essa venceu ontem." | "ATRASADO! Ação necessária." |
| Estado vazio | "Nenhuma tarefa por aqui ainda. Que tal começar pela primeira?" | "Sem dados." |
| Conclusão | "Trabalho entregue. Vocês dividiram bem." | "Parabéns!! 🎉🎉🎉 +150 pontos!" |

Três regras: a frase é sempre sobre o grupo, nunca sobre um integrante; o app pergunta em vez de mandar; e nada de gamificação — pontos e troféus transformariam colaboração em competição, que é o oposto do que o produto quer.
