# Finance Tracker

Uma aplicação moderna para gerenciamento financeiro pessoal que permite rastrear despesas e receitas, visualizar estatísticas em tempo real e obter insights sobre seus hábitos financeiros.

![Dashboard Principal](prints/dashboard5.png)

## 🌟 Funcionalidades

- **Dashboard Interativo**: Visualize suas finanças com gráficos intuitivos e estatísticas em tempo real
- **Registro de Transações**: Adicione receitas e despesas com categorização detalhada
- **Análise de Gastos por Categoria**: Veja onde seu dinheiro está sendo gasto com gráficos detalhados
- **Histórico Mensal**: Acompanhe sua evolução financeira ao longo do tempo
- **Design Responsivo**: Acesse suas finanças de qualquer dispositivo
- **Autenticação Segura**: Proteção de dados com Next Auth
- **Experiência de Onboarding**: Tutorial interativo para novos usuários
- **Notificações Toast**: Feedback instantâneo sobre ações realizadas
- **Tema Claro/Escuro**: Interface adaptável à sua preferência visual

## 📸 Screenshots

### Dashboard e Análises

![Dashboard com Transações](prints/dashboard4.png)
*Dashboard com visão geral das finanças, mostrando gastos por categoria e histórico mensal*

### Adicionar Transações

![Adicionar Transação](prints/addTransaction.png)
*Interface intuitiva para adicionar novas transações com categorização*

### Experiência de Primeiro Acesso

![Primeiro Acesso](prints/primeiroAcesso.png)
*Tela de boas-vindas para novos usuários*

![Etapas Iniciais](prints/primeiroAcesso2.png)
*Guia de recursos disponíveis para novos usuários*

![Dicas Financeiras](prints/primeiroAcesso3.png)
*Dicas para melhor gerenciamento financeiro*

### Fluxo de Onboarding

![Onboarding - Passo 1](prints/onboarding.png)
![Onboarding - Passo 2](prints/onboarding2.png)
![Onboarding - Passo 3](prints/onboarding3.png)
*Sequência de onboarding que guia o usuário pelos primeiros passos*

## 💡 Diferencial

O Finance Tracker se destaca por sua experiência de usuário intuitiva e interface moderna. Diferente de outras ferramentas financeiras que podem ser complexas ou básicas demais, nosso aplicativo encontra o equilíbrio perfeito entre funcionalidade e simplicidade.

Focamos em criar uma experiência agradável para novos usuários, com mensagens claras quando não há dados e um sistema de onboarding que facilita os primeiros passos.

## 🚀 Objetivo

Ajudar pessoas a tomarem controle de suas finanças pessoais de forma simples e eficiente, fornecendo insights valiosos sobre padrões de gastos e economias, sem a complexidade de ferramentas financeiras tradicionais.

## 📋 Tecnologias Utilizadas

- **Next.js**: Framework React para renderização no servidor
- **TypeScript**: Tipagem estática para código mais seguro
- **Tailwind CSS**: Framework CSS utilitário para design rápido
- **Prisma**: ORM para interação com banco de dados
- **NextAuth.js**: Autenticação simplificada
- **Chart.js & Recharts**: Visualização de dados
- **ShadcnUI**: Componentes de UI com acessibilidade
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de dados

## 🛠️ Como Executar Localmente

Siga estas etapas para configurar o projeto em sua máquina local:

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Git

### Passo a Passo para Iniciantes

1. **Clone o repositório**

   Abra o terminal (CMD no Windows) e execute:

   ```bash
   git clone https://github.com/kkademorais/finance-tracker.git
   cd finance-tracker
   ```

2. **Instale as dependências**

   Execute:

   ```bash
   npm install
   ```

   Ou se preferir usar yarn:

   ```bash
   yarn
   ```

3. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto e adicione:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/financetracker"
   NEXTAUTH_SECRET="seu-segredo-aqui"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   Substitua os valores conforme necessário para seu ambiente.

4. **Configure o banco de dados**

   Execute:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   Isso irá inicializar o banco de dados com as tabelas necessárias.

5. **Execute a aplicação em modo de desenvolvimento**

   ```bash
   npm run dev
   ```

   Ou com yarn:

   ```bash
   yarn dev
   ```

6. **Acesse a aplicação**

   Abra o navegador e acesse: [http://localhost:3000](http://localhost:3000)

7. **Registre uma conta**

   Clique em "Sign Up" e crie uma conta para começar a usar.

### Solução de Problemas Comuns

- **Erro ao conectar com o banco de dados**: Verifique se o valor da DATABASE_URL está correto e se o serviço de banco de dados está em execução.
- **Tela em branco após login**: Limpe o cache do browser ou execute `npm run build && npm start` para gerar uma nova versão de produção.
- **Dependências quebradas**: Execute `npm install` novamente para atualizar as dependências.
- **Erro no carregamento de componentes**: Verifique se todas as dependências do Shadcn UI foram instaladas com `npx shadcn-ui@latest add [nome-do-componente]`.

## 📊 Estrutura do Projeto

```
finance-tracker/
├── prisma/               # Configurações do Prisma e esquema do banco de dados
├── public/               # Arquivos estáticos
├── src/
│   ├── app/              # Rotas da aplicação (App Router do Next.js 13+)
│   ├── components/       # Componentes React
│   │   ├── atoms/        # Componentes básicos de UI
│   │   ├── molecules/    # Componentes compostos por atoms
│   │   ├── organisms/    # Componentes maiores (ex: gráficos, forms)
│   │   └── templates/    # Layouts de página
│   ├── context/          # Contextos globais do React
│   ├── hooks/            # Hooks customizados
│   ├── lib/              # Funções utilitárias e configurações
│   ├── styles/           # Estilos globais
│   └── types/            # Definições de tipos TypeScript
├── .env.example          # Exemplo de variáveis de ambiente
├── next.config.js        # Configuração do Next.js
└── package.json          # Dependências e scripts
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, sinta-se à vontade para enviar um Pull Request.

## 📜 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

---

Desenvolvido com ❤️ para ajudar pessoas a conquistarem seu controle financeiro.
