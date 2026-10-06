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
    dataExpiracao: new Date(Date.now() + 24 * 60 * 60 * 1000),
    ...overrides
  };
}

export function criarCarrinho(overrides = {}) {
  return {
    itens: [
      { produto: "Notebook", quantidade: 1, preco: 1000 }
    ],
    total: 1000,
    ...overrides
  };
}

export function criarCliente(overrides = {}) {
  return {
    id: 10,
    nome: "Cliente Teste",
    pontos: 0,
    ...overrides
  };
}
