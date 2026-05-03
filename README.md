# 🛒 Lume 3D

Projeto acadêmico (e-commerce focado em impressão 3D) criado para a disciplina de Desenvolvimento Web. Contém catálogo de produtos, filtros, carrinho, cálculo de frete (simulado) e área de pedidos/serviços.

---

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação rápida](#instalação-rápida)
- [Scripts disponíveis](#scripts-disponíveis)
- [Dependências importantes](#dependências-importantes)
- [Testes](#testes)
- [Config / Variáveis de ambiente](#config--variáveis-de-ambiente)
- [Notas de desenvolvimento](#notas-de-desenvolvimento)
- [Contribuição](#contribuição)

---

## Pré-requisitos

- Node.js 18+ (recomendo a versão LTS mais recente)
- npm, yarn ou pnpm (qualquer gerenciador que prefira)

> Observação: há um `bun.lockb` no repositório — se você usar Bun, pode executar `bun install` em vez de `npm install`.

---

## Instalação rápida

1. Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
cd NOME_DO_REPOSITORIO
```

2. Instale dependências (escolha um):

```bash
npm install
# ou
pnpm install
# ou
yarn install
# ou (opcional)
bun install
```

3. Iniciar servidor de desenvolvimento:

```bash
npm run dev
# ou pnpm/yarn equivalente
```

4. Build para produção:

```bash
npm run build
npm run preview   # pré-visualizar build localmente
```

---

## Scripts disponíveis

Extraídos do `package.json`:

- `dev` — inicia o servidor de desenvolvimento (Vite)
- `build` — cria build de produção
- `build:dev` — build em modo `development`
- `preview` — serve o build localmente
- `lint` — roda ESLint
- `test` — executa os testes com Vitest
- `test:watch` — executa Vitest em modo watch

Use por exemplo `npm run dev` ou `pnpm dev`.

---

## Dependências importantes

Algumas bibliotecas relevantes usadas no projeto e por que elas estão aqui:

- `cep-promise` — Biblioteca para consulta de CEP (ViaCEP / Correios / etc.). Usada em `src/contexts/ShippingContext.tsx` para obter cidade/estado a partir do CEP. Não requer chave de API para os provedores públicos padrão.

  Exemplo de uso:

  ```ts
  import cep from 'cep-promise'

  const info = await cep('01001000')
  // info => { cep: '01001000', state: 'SP', city: 'São Paulo', neighborhood: '...', street: '...' }
  ```

  Nos testes o `cep-promise` é mockado com Vitest (`vi.mock('cep-promise', () => ({ default: vi.fn() }))`). Veja `src/test/ShippingContext.test.tsx`.

- `react-router-dom` — routing das páginas
- `@tanstack/react-query` — cache/requests e gerenciamento de estado para dados remotos
- `tailwindcss` + `tailwindcss-animate` — framework CSS utilitário e animações
- `sonner` — notificações/toasts usados no app
- `lucide-react` — ícones

Veja o `package.json` para a lista completa de dependências.

---

## Testes

Rodar testes:

```bash
npm test
```

Dica: para testes que usam `cep-promise`, há mocks no diretório `src/test`. Se precisar simular respostas, use `vi.mock('cep-promise', ...)`.

---

## Config / Variáveis de ambiente

Este projeto não exige variáveis de ambiente obrigatórias por padrão (nenhuma referência `process.env` encontrada). Algumas integrações externas poderiam ser adicionadas no futuro — caso precise, documente aqui.

Tema: o estado do tema (claro / escuro) é armazenado em `localStorage` pela `ThemeContext` (`localStorage.theme`).

---

## Notas de desenvolvimento

- O cálculo de frete é simulado em `src/contexts/ShippingContext.tsx` e usa `cep-promise` apenas para obter cidade/estado a partir do CEP.
- Componentes principais estão em `src/components` e páginas em `src/pages`.
- Configurações do Tailwind em `tailwind.config.ts` e tokens em `src/index.css`.

---

## Contribuição

1. Crie uma branch com a sua feature/bugfix: `git checkout -b feat/minha-coisa`
2. Faça commits pequenos e claros.
3. Abra um pull request.

Por favor rode `npm run lint` e `npm test` antes de abrir PR.

---

## Problemas comuns / Troubleshooting

- Se a consulta de CEP falhar, verifique conexão com a internet e tente novamente (provedores externos podem ocasionalmente retornar erro).
- Caso algum pacote não instale corretamente, remova `node_modules` e execute `npm install` novamente. Se estiver usando `pnpm`, rode `pnpm install`.

---

Se quiser, posso ajustar este README com instruções específicas de deploy (Netlify / Vercel / Docker) ou incluir passos para CI/CD.

