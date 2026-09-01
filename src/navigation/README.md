# Navegação

```
RootNavigator
├── AuthNavigator (usuário não autenticado)
│   ├── SignIn
│   └── SignUp
└── AppTabs (usuário autenticado)
    ├── Home       — próximos prazos, pendências, minha carga
    ├── Projects   — ProjectsStack
    │   ├── ProjectList
    │   ├── ProjectDetail  (Painel de Equilíbrio)
    │   ├── Kanban
    │   ├── NewProject
    │   ├── TaskDetail
    │   └── NewTask
    └── Profile    — dados do usuário e histórico de contribuição
```

A troca entre `Auth` e `App` é feita pelo `AuthContext`: enquanto não há
sessão, o `RootNavigator` monta apenas a pilha de autenticação.

Biblioteca prevista: `@react-navigation/native` com `native-stack` e
`bottom-tabs`. Implementação no CP5.
