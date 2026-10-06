Readme - Projeto

🛒 Grupo 6 — E-commerce de Cupons
Projeto desenvolvido para a aplicação prática de Testes Unitários em Node.js, utilizando Jest com ES Modules (ESM).
O projeto simula um sistema de aplicação de cupons de desconto em um e-commerce, permitindo testar diferentes regras de negócio, validações, descontos, limites de utilização, fidelidade de clientes e tratamento de exceções.

📌 Objetivo do Projeto
O objetivo deste projeto é desenvolver e testar um serviço responsável pelo gerenciamento e aplicação de cupons de desconto em um e-commerce.
Durante o desenvolvimento, foram aplicados conceitos de:

- Testes unitários;
- Jest;
- ES Modules (ESM);
- Padrão AAA (Arrange, Act, Assert);
- Factory para criação de dados de teste;
- Mocks com jest.fn();
- Funções assíncronas;
- Testes de exceções;
- Cobertura de código;
- Organização e colaboração utilizando Git e GitHub.

## 🧩 Organização do Projeto
O projeto foi dividido entre os 7 integrantes do grupo, de forma que cada integrante realizasse uma contribuição específica e registrasse sua participação através de um commit separado.
### Integrante 1 — Configuração do projeto

**Responsabilidade:** Configuração do projeto, Node.js, ESM e Jest.

**Commit:** `chore: configura ambiente do projeto`

### Integrante 2 — Implementação do CupomService

**Responsabilidade:** Implementação das regras de negócio dos cupons.

**Commit:** `feat: implementa service de cupons`

### Integrante 3 — Criação das Factories

**Responsabilidade:** Criação das Factories para os dados de teste.

**Commit:** `test: adiciona factories de teste`

### Integrante 4 — Testes de descontos

**Responsabilidade:** Testes relacionados aos descontos dos cupons.

**Commit:** `test: adiciona testes de descontos`

### Integrante 5 — Testes de validações e exceções

**Responsabilidade:** Testes de validações e tratamento de exceções.

**Commit:** `test: adiciona testes de validacao`

### Integrante 6 — Testes de fidelidade e Mocks

**Responsabilidade:** Testes de fidelidade, limites e utilização de Mocks.

**Commit:** `test: adiciona testes de fidelidade e mocks`

### Integrante 7 — Documentação

**Responsabilidade:** Organização do README, documentação e revisão final.

**Commit:** `docs: adiciona documentacao e resultados`


## 📁 Estrutura do Projeto

```text
grupo6-ecommerce-cupons/
│
├── src/
│   ├── services/
│   │   ├── CupomService.js
│   │   └── CupomService.test.js
│   │
│   └── factories/
│       └── cupomFactory.js
│
├── coverage/
│
├── .gitignore
├── jest.config.js
├── package.json
├── package-lock.json
└── README.md
```

A pasta coverage/ é gerada automaticamente pelo Jest quando os testes são executados com cobertura e não deve ser enviada para o repositório.

---------------------------------------------------------------------------------------------------------

## 🧪 Regras de Negócio Testadas
O sistema possui diferentes regras relacionadas à utilização de cupons.
💰 Desconto Percentual
Permite aplicar um desconto baseado em uma porcentagem sobre o valor do carrinho.
Exemplo:
Carrinho: R$ 500,00
Cupom: 10%

Desconto: R$ 50,00
Total: R$ 450,00

---------------------------------------------------------------------------------------------------------

## 💵 Desconto Fixo
Permite aplicar um valor fixo de desconto sobre o carrinho.
Exemplo:
Carrinho: R$ 500,00
Cupom: R$ 50,00

Desconto: R$ 50,00
Total: R$ 450,00

---------------------------------------------------------------------------------------------------------

## 🛑 Limite de Desconto
O sistema deve impedir que o desconto ultrapasse o limite máximo definido pelo cupom.
Essa regra evita que um desconto percentual gere um valor superior ao permitido.

---------------------------------------------------------------------------------------------------------

## 📦 Valor Mínimo do Carrinho
Alguns cupons possuem um valor mínimo necessário para serem utilizados.
Exemplo:
Valor mínimo: R$ 100,00
Carrinho: R$ 80,00

Resultado: cupom não pode ser utilizado.

---------------------------------------------------------------------------------------------------------

## ⏰ Cupom Expirado
Cupons possuem uma data de expiração.
Caso a data atual seja posterior à data de validade, o sistema deve impedir sua utilização.
❌ Cupom expirado

---------------------------------------------------------------------------------------------------------

## 🚫 Cupom Inativo
Um cupom pode estar desativado.
Nesse caso, mesmo que esteja dentro da validade, ele não poderá ser utilizado.
❌ Cupom inativo

---------------------------------------------------------------------------------------------------------

## 🔢 Limite de Utilizações
Os cupons podem possuir um limite máximo de utilização.
Quando esse limite é atingido, novas utilizações devem ser bloqueadas.
❌ Limite de usos atingido

---------------------------------------------------------------------------------------------------------

## 👤 Fidelidade do Cliente
Alguns cupons podem ser exclusivos para clientes fidelidade.
O cliente precisa possuir a quantidade mínima de pontos definida pela regra.
Exemplo:
Cliente com 99 pontos
→ ❌ Não pode utilizar

Cliente com 100 pontos
→ ✅ Pode utilizar

---------------------------------------------------------------------------------------------------------

## 🏭 Factory
Para facilitar a criação dos dados utilizados nos testes, foi utilizado o padrão Factory.
A Factory permite criar objetos de teste com valores padrão, possibilitando alterar somente as informações necessárias para cada cenário.
Exemplo:
export function criarCupom(overrides = {}) {
  return {
    id: 1,
    codigo: "DESCONTO10",
    tipo: "percentual",
    valor: 10,
    valorMinimo: 100,
    limiteDesconto: null,
    usos: 0,
    limiteUsos: 100,
    ativo: true,
    apenasFidelidade: false,
    dataExpiracao: new Date(Date.now() + 86400000),
    ...overrides
  };
}

Dessa forma, um teste pode modificar somente uma propriedade:
const cupom = criarCupom({
  ativo: false
});

Isso deixa os testes mais organizados, reutilizáveis e fáceis de manter.

---------------------------------------------------------------------------------------------------------

## 🎭 Mocks
O projeto também utiliza Mocks para simular dependências externas do serviço.
Foi utilizado o jest.fn() para criar funções simuladas.
Exemplo:
const repository = {
  buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
  registrarUso: jest.fn().mockResolvedValue(undefined)
};

Com isso, é possível testar o CupomService sem depender de um banco de dados real.
Também é possível verificar se uma função foi chamada corretamente:
expect(repository.buscarPorCodigo)
  .toHaveBeenCalledWith("DESCONTO10");

E:
expect(repository.registrarUso)
  .toHaveBeenCalledWith(cupom.id);

---------------------------------------------------------------------------------------------------------

## 🧱 Padrão AAA
Os testes seguem o padrão AAA — Arrange, Act, Assert.
Arrange
Prepara os dados necessários para o teste.
Act
Executa a função que está sendo testada.
Assert
Verifica se o resultado obtido é o esperado.
Exemplo:
// Arrange
const cupom = criarCupom({
  tipo: "percentual",
  valor: 10
});

const carrinho = criarCarrinho({
  total: 500
});

// Act
const resultado = await service.aplicarCupom(carrinho, cupom);

// Assert
expect(resultado.desconto).toBe(50);

A utilização desse padrão ajuda a deixar os testes mais claros e organizados.

---------------------------------------------------------------------------------------------------------

## ⚠️ Testes de Exceções
O projeto também testa situações em que o sistema deve rejeitar uma operação.
Como o serviço possui funções assíncronas, foi utilizado o rejects.toThrow() do Jest.
Exemplo:
await expect(
  service.validarECobrar(...)
).rejects.toThrow("Cupom expirado");

Entre as situações testadas estão:
Cupom inexistente;
Cupom expirado;
Cupom inativo;
Limite de utilizações atingido;
Carrinho abaixo do valor mínimo;
Cliente sem pontuação suficiente para cupom de fidelidade.

---------------------------------------------------------------------------------------------------------

## 🏗️ Pirâmide de Testes
A Pirâmide de Testes representa uma estratégia para organizar diferentes níveis de testes.
Neste projeto, o foco principal está nos testes unitários, pois eles permitem verificar pequenas partes da aplicação de maneira rápida e isolada.
          /\
          /  \
         / E2E\
        /------\
       / Integração \
      /--------------\
     /  Unitários     \
    /------------------\

Os testes unitários formam a base porque normalmente são mais rápidos, possuem menor custo de execução e permitem identificar problemas diretamente nas funções ou serviços testados.

---------------------------------------------------------------------------------------------------------

## 🧪 F.I.R.S.T.
Os testes foram desenvolvidos considerando os princípios do F.I.R.S.T.:
Fast — devem ser rápidos para executar.
Independent — cada teste deve funcionar de forma independente.
Repeatable — o resultado deve ser reproduzível.
Self-validating — o próprio teste deve informar se passou ou falhou.
Timely — os testes devem ser desenvolvidos em um momento adequado do processo de desenvolvimento.
Esses princípios ajudam a criar uma suíte de testes confiável e fácil de manter.

---------------------------------------------------------------------------------------------------------

## 📊 Cobertura de Testes
Para verificar a cobertura do código, foi utilizado o recurso de cobertura do Jest.
Execute:
npm run test:coverage

O Jest apresenta informações relacionadas a:
Statements;
Branches;
Functions;
Lines.
A configuração do projeto estabelece como meta mínima 80% de cobertura global.
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  }
}

Resultado
O resultado abaixo deve ser atualizado após a execução real dos testes:
Test Suites: 1 passed
Tests:       XX passed

A cobertura apresentada no README deve corresponder ao resultado real obtido pelo grupo ao executar:
npm run test:coverage

---------------------------------------------------------------------------------------------------------

## 🚀 Como Executar o Projeto
1. Clonar o repositório
git clone URL_DO_REPOSITORIO

Entre na pasta:
cd grupo6-ecommerce-cupons


2. Instalar as dependências
npm install


3. Executar os testes
npm test


4. Executar os testes com cobertura
npm run test:coverage

---------------------------------------------------------------------------------------------------------

## 🛠️ Tecnologias Utilizadas
Node.js — ambiente de execução JavaScript;
Jest — framework utilizado para os testes automatizados;
JavaScript — linguagem utilizada no projeto;
ES Modules (ESM) — sistema de módulos utilizado na aplicação;
Git — controle de versão;
GitHub — hospedagem e colaboração do projeto.

---------------------------------------------------------------------------------------------------------

## 🌿 Organização com Git
O desenvolvimento foi organizado de maneira colaborativa, utilizando commits separados para registrar a contribuição dos integrantes.
O histórico esperado do projeto é:

- docs: adiciona documentacao e resultados
- test: adiciona testes de fidelidade e mocks
- test: adiciona testes de validacao
- test: adiciona testes de descontos
- test: adiciona factories de teste
- feat: implementa service de cupons
- chore: configura ambiente do projeto

Cada integrante ficou responsável por uma parte específica do projeto, permitindo identificar as contribuições individuais através do histórico do Git.
Para manter a organização, recomenda-se que cada integrante trabalhe em sua própria branch e posteriormente abra um Pull Request para a branch principal.

---------------------------------------------------------------------------------------------------------

## 👥 Participantes

Integrante     |   Responsabilidade

Integrante 1   |   Configuração do ambiente

Integrante 2   |    CupomService

Integrante 3   |    Factories

Integrante 4   |    Testes de descontos

Integrante 5   |    Testes de validações

Integrante 6   |    Testes de fidelidade e Mocks

Integrante 7   |    Documentação e revisão

---------------------------------------------------------------------------------------------------------

## ✅ Conclusão
O projeto permitiu aplicar, na prática, conceitos de testes automatizados em aplicações Node.js. Foram utilizados testes unitários com Jest, padrão AAA, Factory, Mocks, testes de funções assíncronas, tratamento de exceções e análise de cobertura.
Além da parte técnica, a utilização do Git e GitHub possibilitou organizar o trabalho colaborativo, permitindo que cada integrante contribuísse com uma parte específica do projeto e tivesse sua participação registrada no histórico de commits.
Dessa forma, o projeto demonstra não apenas o funcionamento das regras de cupons de desconto, mas também a aplicação de boas práticas de desenvolvimento e testes de software.

