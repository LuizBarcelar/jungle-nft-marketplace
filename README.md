# Kurio NFT Marketplace

Marketplace demonstrativo de NFTs desenvolvido com **React 19, TypeScript e Vite**, com foco em experiência do usuário, arquitetura modular, integração com APIs simuladas e testes automatizados.

Projeto desenvolvido como parte de um desafio técnico de desenvolvimento Front-End.

## Funcionalidades

- Catálogo de NFTs com busca, filtros, ordenação e paginação.
- Visualização detalhada dos NFTs.
- Cadastro, login e gerenciamento de sessão.
- Página de perfil do usuário.
- Carrinho de compras com atualização de quantidades.
- Checkout com confirmação de pedidos simulados.
- Simulação de conexão com carteira digital.
- Atualização de preços em tempo real com Socket.IO.
- Layout responsivo para desktop e dispositivos móveis.

**Observação:** esta é uma aplicação demonstrativa. Os dados de autenticação, pedidos e NFTs são simulados. Nenhuma transação real de criptomoedas é realizada.

## Acesso de demonstração

Para testar as funcionalidades autenticadas do marketplace, utilize:

**E-mail:** `demo@kurio.com`  
**Senha:** `Demo1234!`

A conta demonstrativa permite explorar o perfil, o carrinho e o checkout simulado.

Também é possível criar uma conta fictícia pela própria aplicação.

**Importante:** a autenticação utiliza Mock Service Worker (MSW). As credenciais são exclusivamente demonstrativas e não devem ser utilizadas em serviços reais.

## Tecnologias

| Categoria | Tecnologias |
|---|---|
| Front-End | React 19, TypeScript, Vite 8 |
| Estilização | Tailwind CSS 4, CSS, Radix UI |
| Navegação | TanStack Router |
| Gerenciamento de dados | TanStack Query |
| Requisições HTTP | Axios |
| API simulada | Mock Service Worker (MSW) |
| Tempo real | Socket.IO |
| Ícones | Lucide React |
| Testes E2E | Playwright |
| Qualidade | ESLint, TypeScript |

## Arquitetura

O projeto utiliza uma organização modular, separando funcionalidades, componentes reutilizáveis, serviços e configurações.

```text
jungle-nft-marketplace/
├── public/
│   └── nfts/
├── realtime/
│   └── server.ts
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── shared/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── catalog/
│   │   ├── checkout/
│   │   ├── nft-detail/
│   │   └── profile/
│   ├── lib/
│   ├── mocks/
│   │   └── handlers/
│   ├── providers/
│   ├── routes/
│   └── services/
│       ├── api/
│       └── realtime/
├── tests/
│   ├── catalog.spec.ts
│   └── e2e/
├── package.json
└── vite.config.ts
```

## Como executar

### Pré-requisitos

- Node.js compatível com o Vite 8.
- npm.

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone URL_DO_REPOSITORIO
cd jungle-nft-marketplace
npm install
```

Substitua `URL_DO_REPOSITORIO` pela URL do repositório publicado.

### Iniciar o Front-End

```bash
npm run dev
```

A aplicação estará disponível no endereço informado pelo Vite, normalmente:

`http://localhost:5173`

### Iniciar o servidor de tempo real

Em outro terminal, execute:

```bash
npx tsx realtime/server.ts
```

O servidor Socket.IO utiliza a porta `3001` na configuração atual.

**Importante:** o Front-End e o servidor de tempo real são processos separados. Sem o servidor Socket.IO, as atualizações de preços em tempo real não estarão disponíveis.

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Executa a verificação TypeScript e gera o build |
| `npm run preview` | Visualiza o build de produção |
| `npm run lint` | Executa a análise estática com ESLint |
| `npx playwright test` | Executa os testes E2E |
| `npx playwright show-report` | Abre o relatório HTML dos testes |

## Testes automatizados

O projeto utiliza Playwright para validar os principais fluxos da aplicação.

**17 testes E2E aprovados**, distribuídos entre:

| Módulo | Testes |
|---|---:|
| Catálogo | 4 |
| Autenticação | 5 |
| Carrinho | 4 |
| Checkout | 4 |
| **Total** | **17** |

Para instalar o navegador utilizado pelos testes:

```bash
npx playwright install chromium
```

Para executar todos os testes:

```bash
npx playwright test
```

Para visualizar o relatório:

```bash
npx playwright show-report
```

## Decisões técnicas

### Organização por funcionalidades

Os componentes e a lógica de negócio são agrupados por domínio, facilitando manutenção e evolução da aplicação.

### Mock Service Worker

O MSW permite simular endpoints de autenticação, catálogo e pedidos sem depender de um backend de produção.

### TanStack Query

Utilizado para gerenciar requisições e estados relacionados aos dados da aplicação.

### Socket.IO

Responsável pela comunicação em tempo real utilizada na demonstração de alterações de preços dos NFTs.

### Playwright

Os testes automatizados validam fluxos completos no navegador, incluindo cadastro, login, carrinho e finalização demonstrativa de pedidos.

## Limitações da demonstração

- Não há processamento de pagamentos reais.
- Não são realizadas transações em blockchain.
- Os preços em tempo real são simulados.
- Os serviços HTTP utilizam mocks.
- Os dados locais não substituem um banco de dados de produção.

## Melhorias futuras

- Backend persistente e banco de dados.
- Autenticação com infraestrutura de produção.
- Ampliação dos testes automatizados.
- Monitoramento e observabilidade.
- Otimizações de acessibilidade e desempenho.

## Autor

**Luiz Fernando Ferreira Barcelar**

Desenvolvedor Front-End / Full Stack

Portfólio: https://luizbarcelar-dev.vercel.app/

---

Projeto desenvolvido para fins de demonstração técnica e avaliação de competências em desenvolvimento web.