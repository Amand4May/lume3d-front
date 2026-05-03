# LUME 3D | Impressão 3D sob Demanda

O LUME 3D é uma plataforma de e-commerce especializada no mercado de impressão 3D. O sistema foi projetado para oferecer uma experiência de compra ágil e intuitiva, fornecendo um ambiente robusto e seguro para as compras no site.

Acesse em: [lume3d-front.vercel.app](https://lume3d-front.vercel.app)

## Equipe e Desenvolvedores
* **Amanda Mayumi** ([Amand4May](https://github.com/Amand4May))
* **Asla** ([Aslalol](https://github.com/Aslalol))


## Tecnologias e Arquitetura

O ecossistema do LUME 3D foi construído utilizando tecnologias modernas de desenvolvimento web, garantindo alta performance, escalabilidade e manutenibilidade:

* **React 18.3.1:** Biblioteca principal para a construção de interfaces.
* **React Router DOM 6.30.1:** Roteamento SPA com suporte a query parameters e navegação programática.
* **TypeScript 5.8.3:** Base de código tipada, assegurando maior previsibilidade e redução de bugs.
* **Vite 5.4.19:** Ferramenta de build para um desenvolvimento rápido com HMR.
* **Tailwind CSS 3.4.17:** Framework CSS utility-first com suporte a dark mode.
* **JavaScript (ES6+):** Utilizado para lógica de programação e manipulação de estado.

### Dependências Principais

* **cep-promise 4.4.1:** Busca de endereços por CEP com suporte a vários provedores. Retorna `{ cep, state, city, neighborhood, street }`.
* **@tanstack/react-query 5.83.0:** Gerenciamento de dados remotos com cache e sincronização.
* **Shadcn/ui:** Componentes UI acessíveis e customizáveis (Button, Input, Card, Tabs, Dialog, etc).
* **Lucide React 0.462.0:** Biblioteca de ícones modernos e customizáveis.
* **Sonner 1.7.4:** Sistema de notificações toast para feedback do usuário.
* **Zod 3.25.76:** Validação de schemas TypeScript.

* **Git & GitHub:** Gestão de controle de versão, CI/CD.

## Funcionalidades

* Catálogo de produtos com impressão 3D sob demanda
* Ambiente seguro para realização de compras
* Interface responsiva para todos os dispositivos
* Navegação rápida e intuitiva

## Estrutura do Projeto

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── data/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.js
├── components.json
└── vitest.config.ts
```

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

* Node.js (versão 18 ou superior)
* Git

## Instalação e Execução (Ambiente de Desenvolvimento)

Para rodar a plataforma localmente, certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

1. Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
```

2. Entre na pasta do projeto:
```bash
cd NOME_DO_REPOSITORIO
```

3. Instale as dependências:
```bash
npm install
```

4. Execute o projeto em ambiente de desenvolvimento:
```bash
npm run dev
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev         # Inicia servidor de desenvolvimento com Vite

# Build
npm run build       # Compila o projeto para produção

# Preview
npm run preview     # Visualiza build de produção localmente

# Linting
npm run lint        # Executa ESLint para verificar estilo do código

# Testes
npm run test        # Executa testes unitários com Vitest
npm run test:ui     # Interface de testes interativa
```

## Dependência Importante: cep-promise

O `cep-promise` é uma biblioteca crucial para integração com o ShippingCalculator e qualquer funcionalidade que envolva cálculo de fretes baseado em CEP.

### Como usar:

```typescript
import cep from 'cep-promise';

// Buscar dados do CEP
const endereco = await cep('01234567');
// Retorna: { cep: '01234-567', state: 'SP', city: 'São Paulo', neighborhood: 'Bom Retiro', street: 'Rua Augusta' }
```

### Contexto de Uso:
- **ShippingContext:** Calcula fretes baseado no CEP fornecido
- **CheckoutPage:** Integração com busca de endereço durante checkout
- **ShippingCalculator:** Componente que exibe opções de frete

**Importante:** Certifique-se que o cep-promise está instalado ao clonar o repositório:
```bash
npm install
```

## Environment Variables

O projeto pode utilizar variáveis de ambiente para configurações sensíveis. Crie um arquivo `.env.local` na raiz do projeto com as variáveis necessárias (confira `.env.example` se existir).

## Equipe e Desenvolvedores

O sucesso do LUME 3D é resultado do trabalho de desenvolvedores focados na entrega de valor e qualidade técnica.

---
© 2026 LUME 3D. Todos os direitos reservados.