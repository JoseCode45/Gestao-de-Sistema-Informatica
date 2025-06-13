// models/produto.model.js
import pool from '../../database.js';

export const produto = {

  //Mostrar produtos no website
  async MostrarProdutos() {
    const [rows] = await pool.query(`SELECT 
    p.ID, p.Nome, p.Preco, r.Nome AS RegiaoNome, ps.Quantidade, GROUP_CONCAT(DISTINCT c.Nome SEPARATOR ', ') AS Castas,
     promo.Descontotipo, promo.DescontoValor, promo.Motivo, promo.DataInicio, promo.DataValidade, promo.EstadoID
     ,ps.Quantidade AS Stock
    FROM Produto p
    INNER JOIN ProdutoStock ON p.ID = ProdutoStock.ProdutoID
    LEFT JOIN Regiao r ON p.RegiaoID = r.ID
    LEFT JOIN ProdutoStock ps ON p.ID = ps.ProdutoID
    LEFT JOIN ProdutoCasta pc ON p.ID = pc.ProdutoID
    LEFT JOIN Casta c ON pc.CastaID = c.ID
    LEFT JOIN Produtopromocao pp ON p.ID = pp.ProdutoID
    LEFT JOIN Promocao promo ON promo.ID = pp.PromocaoID
    WHERE p.Estado = 'ativo' AND ProdutoStock.Quantidade > 0
    GROUP BY p.ID
    ORDER BY (promo.EstadoID = 3) DESC
  `);
    return rows;
  },

  //====================================

async  atualizarTotais(encomendaID, totalProdutos, totalImpostos, totalTransporte = 0, conn) {
  const totalEncomenda = totalProdutos + totalImpostos + totalTransporte;
  await conn.query(`
    UPDATE ClienteEncomenda
    SET TotalProduto = ?, TotalImpostos = ?, TotalTransporte = ?, TotalEncomenda = ?
    WHERE ID = ?`,
    [totalProdutos, totalImpostos, totalTransporte, totalEncomenda, encomendaID]
  );
},

  //====================================


  //
  async  buscarProdutoComPromocao(produtoID) {
  const [rows] = await pool.query(`
    SELECT 
      p.Preco AS precoOriginal,
      pr.DescontoTipo AS tipoDesconto,
      pr.Valor AS valorDesconto
    FROM Produto p
    LEFT JOIN Promocao pr 
      ON p.PromocaoID = pr.ID
      AND pr.DataInicio <= NOW()
      AND EstadoID = 3
    WHERE p.ID = ?
  `, [produtoID]);

  return rows[0];
},

  //Obter todos os produtos
  async getAll() {
    const [rows] = await pool.query(` SELECT 
      p.ID, p.Nome, p.Preco, r.Nome AS RegiaoNome, uc.Nome AS CriadorNome, ua.Nome AS AlteradorNome, p.DataCriacao,
      p.DataAlteracao, p.Estado, ps.Quantidade, ps.UltimaEntrada, ps.UltimaSaida,
      a.Morada AS Armazem,
      GROUP_CONCAT(c.Nome SEPARATOR ', ') AS Castas
    FROM Produto p
    LEFT JOIN Regiao r ON p.RegiaoID = r.ID
    LEFT JOIN ProdutoStock ps ON p.ID = ps.ProdutoID
    LEFT JOIN Armazem a ON ps.ArmazemID = a.ID
    LEFT JOIN Utilizador uc ON p.CriadorID = uc.ID
    LEFT JOIN Utilizador ua ON p.AlteradorID = ua.ID
    LEFT JOIN ProdutoCasta pc ON p.ID = pc.ProdutoID
    LEFT JOIN Casta c ON pc.CastaID = c.ID
    GROUP BY p.ID
  `);
    return rows;
  },

  async getList() {
    const [rows] = await pool.query(` SELECT 
      p.ID, p.Nome, p.Preco, r.Nome AS RegiaoNome, uc.Nome AS CriadorNome, ua.Nome AS AlteradorNome, p.DataCriacao,
      p.DataAlteracao, p.Estado, ps.Quantidade, ps.UltimaEntrada, ps.UltimaSaida, a.Morada AS Armazem,
      GROUP_CONCAT(c.Nome SEPARATOR ', ') AS Castas
    FROM Produto p
    LEFT JOIN Regiao r ON p.RegiaoID = r.ID
    LEFT JOIN ProdutoStock ps ON p.ID = ps.ProdutoID
    LEFT JOIN Armazem a ON ps.ArmazemID = a.ID
    LEFT JOIN Utilizador uc ON p.CriadorID = uc.ID
    LEFT JOIN Utilizador ua ON p.AlteradorID = ua.ID
    LEFT JOIN ProdutoCasta pc ON p.ID = pc.ProdutoID
    LEFT JOIN Casta c ON pc.CastaID = c.ID
    WHERE p.Estado = 'ativo'  
    GROUP BY p.ID
  `);
    return rows;
  },

  //Obter produto por ID
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM produto WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(nome, preco, regiaoID, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO produto (Nome, Preco, RegiaoID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?)',
      [nome, preco, regiaoID, criadorID, criadorID]
    );
    const produtoID = result.insertId;

    await pool.query(
      `INSERT INTO ProdutoStock
       (ProdutoID, Quantidade, UltimaEntrada, UltimaSaida, ArmazemID, LocalArmazem, CriadorID, AlteradorID)
       VALUES (?, 0, NULL, NULL, 1, NULL, ?, ?)`,
      [produtoID, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, nome, preco, regiaoID, alteradorID) {
    await pool.query(
      'UPDATE produto SET Nome = ?, preco = ?, regiaoID = ?, AlteradorID = ? WHERE ID = ?',
      [nome, preco, regiaoID, alteradorID, id]
    );
  },



  //Associar produto a promoção
  async associarProdutoPromocao(ProdutoID, PromocaoID) {

    try {
      //Verificar existência de promoções
      const [promoRows] = await pool.query('SELECT ID FROM Promocao WHERE ID = ?', [PromocaoID]);
      if (promoRows.length === 0) {
        return { success: false, message: 'Promoção não encontrada.' };
      }

      //Verificar existência de produtos
      const [prodRows] = await pool.query('SELECT ID FROM Produto WHERE ID = ?', [ProdutoID]);
      if (prodRows.length === 0) {
        return { success: false, message: 'Produto não encontrado.' };
      }

      await pool.query(
        'UPDATE Produto SET PromocaoID = ? WHERE ID = ?', [PromocaoID, ProdutoID]);
    } catch (err) {
      console.error('Erro ao associar produto a promoção: ', err);
      return { success: false, message: 'Erro interno ao associar.' };
    }
  },

  //Associar produto a fornecedor
  async associarProdutoFornecedor(ProdutoID, FornecedorID) {
    try {
      //Verificar existência de promoções
      const [promoRows] = await pool.query('SELECT ID FROM Fornecedor WHERE ID = ?', [FornecedorID]);
      if (promoRows.length === 0) {
        return { success: false, message: 'Fornecedor não encontrado.' };
      }

      //Verificar existência de produtos
      const [prodRows] = await pool.query('SELECT ID FROM Produto WHERE ID = ?', [ProdutoID]);
      if (prodRows.length === 0) {
        return { success: false, message: 'Produto não encontrado.' };
      }

      await pool.query(
        'UPDATE Produto SET FornecedorID = ? WHERE ID = ?', [FornecedorID, ProdutoID]);
    } catch (err) {
      console.error('Erro ao associar produto a fornecedor: ', err);
      return { success: false, message: 'Erro interno ao associar.' };
    }
  },

  //Associar produto a Regiao
  async associarProdutoRegiao(ProdutoID, RegiaoID) {
    try {
      //Verificar existência de promoções
      const [promoRows] = await pool.query('SELECT ID FROM Regiao WHERE ID = ?', [RegiaoID]);
      if (promoRows.length === 0) {
        return { success: false, message: 'Regiao não encontrada.' };
      }

      //Verificar existência de produtos
      const [prodRows] = await pool.query('SELECT ID FROM Produto WHERE ID = ?', [ProdutoID]);
      if (prodRows.length === 0) {
        return { success: false, message: 'Produto não encontrado.' };
      }

      await pool.query(
        'UPDATE Produto SET RegiaoID = ? WHERE ID = ?', [RegiaoID, ProdutoID]);
    } catch (err) {
      console.error('Erro ao associar produto a regiao: ', err);
      return { success: false, message: 'Erro interno ao associar.' };
    }
  },

  //Associar produto a casta
  async associarProdutoCasta(ProdutoID, CastaID) {
    try {
      // Usando apenas pool (certifique-se de que pool está importado corretamente)
      const [castaRows] = await pool.query('SELECT ID FROM Casta WHERE ID = ?', [CastaID]);
      if (castaRows.length === 0) {
        return { success: false, message: 'Casta não encontrada.' };
      }

      const [produtoRows] = await pool.query('SELECT ID FROM Produto WHERE ID = ?', [ProdutoID]);
      if (produtoRows.length === 0) {
        return { success: false, message: 'Produto não encontrado.' };
      }

      await pool.query(
        'INSERT INTO ProdutoCasta (CastaID, ProdutoID) VALUES (?, ?)', [CastaID, ProdutoID]
      );

      return { success: true };
    } catch (err) {
      console.error('Erro ao associar produto a casta: ', err.message, err.stack);
      return { success: false, message: 'Erro interno ao associar.' };
    }
  },


  //Desassociar produto de casta
  async desassociarProdutoCasta(ProdutoID, CastaID) {

    try {
      //Verificar existência de castas
      const [promoRows] = await pool.query('SELECT ID FROM Casta WHERE ID = ?', [CastaID]);
      if (promoRows.length === 0) {
        return { success: false, message: 'Casta não encontrada.' };
      }

      //Verificar existência de produtos
      const [prodRows] = await pool.query('SELECT ID FROM Produto WHERE ID = ?', [ProdutoID]);
      if (prodRows.length === 0) {
        return { success: false, message: 'Produto não encontrado.' };
      }

      await pool.query(
        'DELETE FROM ProdutoCasta WHERE CastaID = ? AND ProdutoID = ?', [CastaID, ProdutoID]);

      return { success: true };
    } catch (err) {
      console.error('Erro ao associar produto a promoção: ', err);
      return { success: false, message: 'Erro interno ao associar.' };
    }
  },

  //Desativar produto
  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE produto SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

  //Ativar produto
  async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE Produto SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

  //Ver todas as castas de um produto
  async listarCastasProduto(produtoID) {
    const [rows] = await pool.query(
      `SELECT c.ID, c.Nome
     FROM ProdutoCasta pc
     JOIN Casta c ON pc.CastaID = c.ID
     WHERE pc.ProdutoID = ? AND c.Estado = 'ativo'`,
      [produtoID]
    );
    return rows;
  },

  //Inserir utilizador que alterou o valor
  async alterador(produtoID, alteradorID) {
    const dataAlteracao = new Date();
    await pool.query(
      'UPDATE Produto SET AlteradorID = ?, DataAlteracao = ? WHERE ID = ?',
      [alteradorID, dataAlteracao, produtoID]
    );
  }
};
