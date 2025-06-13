// services/encomenda.service.js
import pool from '../database.js';
import { ClienteEncomenda } from '../models/utilizador/clienteEncomendaModels.js';

export async function confirmarNovaEncomenda(clienteID, carrinho) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Criar encomenda inicial (vazia)
    const encomendaID = await ClienteEncomenda.createBegin(clienteID);

    const IVA_TAXA = 0.23;
    let totalProduto = 0;
    let totalImpostos = 0;

    // 2. Loop por produto no carrinho
    for (const item of carrinho) {
      const { ProdutoID, quantity } = item;

      // 3. Obter info do produto e promoção
      const [rows] = await conn.query(`
        SELECT 
          p.Preco AS precoOriginal,
          ps.Quantidade AS stock,
          pr.DescontoTipo AS tipoDesconto,
          pr.Valor AS valorDesconto
        FROM Produto p
        JOIN ProdutoStock ps ON ps.ProdutoID = p.ID
        LEFT JOIN Promocao pr 
          ON p.PromocaoID = pr.ID
          AND pr.DataInicio <= NOW()
          AND (pr.DataValidade IS NULL OR pr.DataValidade >= NOW())
        WHERE p.ID = ?
        FOR UPDATE
      `, [ProdutoID]);

      if (rows.length === 0) {
        throw new Error(`Produto ${ProdutoID} não encontrado`);
      }

      const { precoOriginal, stock, tipoDesconto, valorDesconto } = rows[0];

      if (stock < quantity) {
        throw new Error(`Stock insuficiente para produto ${ProdutoID}`);
      }

      // 4. Calcular preço com desconto
      let valorUnitario = precoOriginal;
      if (tipoDesconto === 'percentual') {
        valorUnitario -= precoOriginal * (valorDesconto / 100);
      } else if (tipoDesconto === 'fixo') {
        valorUnitario -= valorDesconto;
      }
      valorUnitario = Math.max(0, valorUnitario);

      const valorBase = valorUnitario * quantity;
      const valorIVA = valorBase * IVA_TAXA;
      const total = valorBase + valorIVA;

      // 5. Inserir produto na encomenda
      await conn.query(`
        INSERT INTO ClienteEncomendaProdutos
        (EncomendaID, ProdutoID, Quantidade, ValorUnitario, ValorIVA, Total)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [encomendaID, ProdutoID, quantity, valorUnitario, valorIVA, total]
      );

      // 6. Atualizar stock
      await conn.query(`
        UPDATE ProdutoStock
        SET Quantidade = ?, UltimaSaida = NOW()
        WHERE ProdutoID = ?`,
        [stock - quantity, ProdutoID]
      );

      totalProduto += valorBase;
      totalImpostos += valorIVA;
    }

    // 7. Atualizar totais da encomenda
    const totalTransporte = 5.00;
    const totalEncomenda = totalProduto + totalImpostos + totalTransporte;

    await conn.query(`
      UPDATE ClienteEncomenda 
      SET 
        TotalProduto = ?, 
        TotalImpostos = ?, 
        TotalTransporte = ?, 
        TotalEncomenda = ?, 
        EstadoID = ?, 
        AlteradorID = ?, 
        DataAlteracao = NOW()
      WHERE ID = ?`,
      [totalProduto, totalImpostos, totalTransporte, totalEncomenda, 2, clienteID, encomendaID] // EstadoID 2 = Confirmado
    );

    await conn.commit();
    return { success: true, encomendaID };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
