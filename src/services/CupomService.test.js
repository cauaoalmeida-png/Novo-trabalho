import { describe, test, expect, jest } from "@jest/globals";
import { CupomService } from "./CupomService.js";
import {
  criarCarrinho,
  criarCliente,
  criarCupom
} from "../factories/cupomFactory.js";

describe("CupomService", () => {
  test("deve aplicar desconto percentual corretamente", async () => {
    // Arrange
    const cupom = criarCupom({
      tipo: "percentual",
      valor: 10
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);
    const carrinho = criarCarrinho({ total: 500 });
    const cliente = criarCliente();

    // Act
    const resultado = await service.validarECobrar(
      "DESCONTO10",
      carrinho,
      cliente
    );

    // Assert
    expect(resultado.desconto).toBe(50);
    expect(resultado.totalFinal).toBe(450);
    expect(repository.buscarPorCodigo).toHaveBeenCalledWith("DESCONTO10");
    expect(repository.registrarUso).toHaveBeenCalledWith(cupom.id);
  });

  test("deve aplicar desconto de valor fixo sem deixar o total negativo", async () => {
    // Arrange
    const cupom = criarCupom({
      codigo: "FIXO150",
      tipo: "fixo",
      valor: 150,
      valorMinimo: 100
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);
    const carrinho = criarCarrinho({ total: 100 });

    // Act
    const resultado = await service.validarECobrar(
      "FIXO150",
      carrinho,
      criarCliente()
    );

    // Assert
    expect(resultado.desconto).toBe(100);
    expect(resultado.totalFinal).toBe(0);
  });

  test("deve rejeitar cupom expirado", async () => {
    // Arrange
    const cupom = criarCupom({
      dataExpiracao: new Date(Date.now() - 1000)
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);

    // Act + Assert
    await expect(
      service.validarECobrar(
        "DESCONTO10",
        criarCarrinho(),
        criarCliente()
      )
    ).rejects.toThrow("Cupom expirado");
  });

  test("deve rejeitar cupom quando o limite de usos for atingido", async () => {
    // Arrange
    const cupom = criarCupom({
      usos: 100,
      limiteUsos: 100
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);

    // Act + Assert
    await expect(
      service.validarECobrar(
        "DESCONTO10",
        criarCarrinho(),
        criarCliente()
      )
    ).rejects.toThrow("Limite de usos do cupom atingido");
  });

  test("deve rejeitar quando o carrinho não atingir o valor mínimo", async () => {
    // Arrange
    const cupom = criarCupom({
      valorMinimo: 500
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);
    const carrinho = criarCarrinho({ total: 100 });

    // Act + Assert
    await expect(
      service.validarECobrar(
        "DESCONTO10",
        carrinho,
        criarCliente()
      )
    ).rejects.toThrow("Valor mínimo do carrinho");
  });

  test("deve rejeitar cupom de fidelidade para cliente sem pontos suficientes", async () => {
    // Arrange
    const cupom = criarCupom({
      apenasFidelidade: true
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);
    const cliente = criarCliente({
      pontos: 50
    });

    // Act + Assert
    await expect(
      service.validarECobrar(
        "DESCONTO10",
        criarCarrinho(),
        cliente
      )
    ).rejects.toThrow("Cliente não atende à regra de fidelidade");
  });

  test("deve permitir cupom de fidelidade para cliente com pontos suficientes", async () => {
    // Arrange
    const cupom = criarCupom({
      apenasFidelidade: true,
      valor: 10
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);
    const cliente = criarCliente({
      pontos: 100
    });

    // Act
    const resultado = await service.validarECobrar(
      "DESCONTO10",
      criarCarrinho({ total: 500 }),
      cliente
    );

    // Assert
    expect(resultado.desconto).toBe(50);
    expect(resultado.totalFinal).toBe(450);
    expect(repository.buscarPorCodigo).toHaveBeenCalledWith("DESCONTO10");
    expect(repository.registrarUso).toHaveBeenCalledWith(cupom.id);
  });

  test("deve rejeitar cupom inativo", async () => {
    // Arrange
    const cupom = criarCupom({
      ativo: false
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);

    // Act + Assert
    await expect(
      service.validarECobrar(
        "DESCONTO10",
        criarCarrinho(),
        criarCliente()
      )
    ).rejects.toThrow("Cupom inativo");
  });

  test("deve rejeitar tipo de desconto inválido", async () => {
    // Arrange
    const cupom = criarCupom({
      tipo: "invalido"
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);

    // Act + Assert
    await expect(
      service.validarECobrar(
        "DESCONTO10",
        criarCarrinho(),
        criarCliente()
      )
    ).rejects.toThrow("Tipo de desconto inválido");
  });

  test("deve respeitar o limite máximo de desconto percentual", async () => {
    // Arrange
    const cupom = criarCupom({
      tipo: "percentual",
      valor: 50,
      limiteDesconto: 100
    });

    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(cupom),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);

    // Act
    const resultado = await service.validarECobrar(
      "DESCONTO10",
      criarCarrinho({ total: 1000 }),
      criarCliente()
    );

    // Assert
    expect(resultado.desconto).toBe(100);
    expect(resultado.totalFinal).toBe(900);
  });

  test("deve rejeitar cupom inexistente", async () => {
    // Arrange
    const repository = {
      buscarPorCodigo: jest.fn().mockResolvedValue(null),
      registrarUso: jest.fn().mockResolvedValue(undefined)
    };

    const service = new CupomService(repository);

    // Act + Assert
    await expect(
      service.validarECobrar(
        "INEXISTENTE",
        criarCarrinho(),
        criarCliente()
      )
    ).rejects.toThrow("Cupom não encontrado");
  });
});
