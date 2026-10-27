# Navegação

```
RootNavigator (native-stack)
├── Auth → AuthNavigator          usuário sem sessão
│   ├── SignIn
│   └── SignUp
└── (com sessão)
    ├── App → AppTabs (bottom-tabs)
    │   ├── Home       — minha carga, alertas, próximos prazos
    │   ├── Projects   — lista de projetos
    │   └── Profile    — contribuição, aparência, sair
    ├── ProjectDetail  — Painel de Equilíbrio, integrantes, convite
    ├── Kanban         — quadro com quatro colunas
    ├── TaskDetail     — editar / mover / excluir tarefa
    ├── NewProject     (modal)
    └── NewTask        (modal)
```

A troca entre `Auth` e o app é feita pelo `AuthContext`: enquanto não há
sessão, o `RootNavigator` monta apenas a pilha de autenticação.

As telas de detalhe ficam na pilha raiz (e não dentro da aba Projetos) para
que a Home também possa abri-las e o "voltar" retorne à origem. Detalhes em
[`docs/06-telas-e-fluxos.md`](../../docs/06-telas-e-fluxos.md).
