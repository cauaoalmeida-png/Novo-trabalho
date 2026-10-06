export class CupomService {
  constructor(cupomRepository) {
    this.cupomRepository = cupomRepository;
  }

  async validarECobrar(codigo, carrinho, cliente) {
    if (!codigo || !carrinho || !cliente) {
      throw new Error("Dados obrigatórios não informados");
    }

    const cupom = await this.cupomRepository.buscarPorCodigo(codigo);

    if (!cupom) {
      throw new Error("Cupom não encontrado");
    }

    if (!cupom.ativo) {
      throw new Error("Cupom inativo");
    }

    if (cupom.dataExpiracao < new Date()) {
      throw new Error("Cupom expirado");
    }

    if (cupom.limiteUsos !== null && cupom.usos >= cupom.limiteUsos) {
      throw new Error("Limite de usos do cupom atingido");
    }

    if (carrinho.total < cupom.valorMinimo) {
      throw new Error(`Valor mínimo do carrinho: R$ ${cupom.valorMinimo.toFixed(2)}`);
    }

    if (cupom.apenasFidelidade && cliente.pontos < 100) {
      throw new Error("Cliente não atende à regra de fidelidade");
    }

    const desconto = this.calcularDesconto(cupom, carrinho.total);

    await this.cupomRepository.registrarUso(cupom.id);

    return {
      codigo: cupom.codigo,
      desconto,
      totalFinal: Math.max(0, carrinho.total - desconto)
    };
  }

  calcularDesconto(cupom, totalCarrinho) {
    if (cupom.tipo === "percentual") {
      const desconto = totalCarrinho * (cupom.valor / 100);
      return Number(Math.min(desconto, cupom.limiteDesconto ?? Infinity).toFixed(2));
    }

    if (cupom.tipo === "fixo") {
      return Number(Math.min(cupom.valor, totalCarrinho).toFixed(2));
    }

    throw new Error("Tipo de desconto inválido");
  }
}