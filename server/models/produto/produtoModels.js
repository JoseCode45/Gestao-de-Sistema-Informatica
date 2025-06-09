// models/produto.model.js
import pool from '../../database.js';

export const produto = {

  async MostrarProdutos() {
    const [rows] = await pool.query(`
    SELECT Produto.*
    FROM Produto
    INNER JOIN ProdutoStock ON Produto.ID = ProdutoStock.ProdutoID
    WHERE Produto.Estado = 'ativo' AND ProdutoStock.Quantidade > 0
    ORDER BY Produto.PromocaoID DESC
  `);
    return rows;
  },


  async getAll() {
    const [rows] = await pool.query(`
    SELECT 
      p.ID,
      p.Nome,
      p.Preco,
      r.Nome AS RegiaoNome,
      p.PromocaoID,
      uc.Nome AS CriadorNome,
      ua.Nome AS AlteradorNome,
      p.DataCriacao,
      p.DataAlteracao,
      p.Estado,
      ps.Quantidade,
      ps.UltimaEntrada,
      ps.UltimaSaida,
      a.Morada AS Armazem
    FROM Produto p
    LEFT JOIN Regiao r ON p.RegiaoID = r.ID
    LEFT JOIN ProdutoStock ps ON p.ID = ps.ProdutoID
    LEFT JOIN Armazem a ON ps.ArmazemID = a.ID
    LEFT JOIN Utilizador uc ON p.CriadorID = uc.ID
    LEFT JOIN Utilizador ua ON p.AlteradorID = ua.ID
  `);
    return rows;
  },


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
       VALUES (?, 0, NULL, NULL, NULL, NULL, ?, ?)`,
      [produtoID, armazemID, localArmazem, criadorID, criadorID]
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
      const [promoRows] = await conn.query('SELECT ID FROM Promocao WHERE ID = ?', [PromocaoID]);
      if (promoRows.length === 0) {
        return { success: false, message: 'Promoção não encontrada.' };
      }

      //Verificar existência de produtos
      const [prodRows] = await conn.query('SELECT ID FROM Produto WHERE ID = ?', [ProdutoID]);
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
      const [promoRows] = await conn.query('SELECT ID FROM Fornecedor WHERE ID = ?', [FornecedorID]);
      if (promoRows.length === 0) {
        return { success: false, message: 'Fornecedor não encontrado.' };
      }

      //Verificar existência de produtos
      const [prodRows] = await conn.query('SELECT ID FROM Produto WHERE ID = ?', [ProdutoID]);
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
      const [promoRows] = await conn.query('SELECT ID FROM Regiao WHERE ID = ?', [RegiaoID]);
      if (promoRows.length === 0) {
        return { success: false, message: 'Regiao não encontrada.' };
      }

      //Verificar existência de produtos
      const [prodRows] = await conn.query('SELECT ID FROM Produto WHERE ID = ?', [ProdutoID]);
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
      //Verificar existência de castas
      const [promoRows] = await conn.query('SELECT ID FROM Casta WHERE ID = ?', [CastaID]);
      if (promoRows.length === 0) {
        return { success: false, message: 'Casta não encontrada.' };
      }

      //Verificar existência de produtos
      const [prodRows] = await conn.query('SELECT ID FROM Produto WHERE ID = ?', [produtoID]);
      if (prodRows.length === 0) {
        return { success: false, message: 'Produto não encontrado.' };
      }

      await pool.query(
        'INSERT INTO ProdutoCasta (CastaID,ProdutoID) VALUES (?,?)', [CastaID, ProdutoID]);
    } catch (err) {
      console.error('Erro ao associar produto a casta: ', err);
      return { success: false, message: 'Erro interno ao associar.' };
    }
  },

  //Desassociar produto de casta
  async desassociarProdutoCasta(ProdutoID, CastaID) {

    try {
      //Verificar existência de castas
      const [promoRows] = await conn.query('SELECT ID FROM Casta WHERE ID = ?', [CastaID]);
      if (promoRows.length === 0) {
        return { success: false, message: 'Casta não encontrada.' };
      }

      //Verificar existência de produtos
      const [prodRows] = await conn.query('SELECT ID FROM Produto WHERE ID = ?', [produtoID]);
      if (prodRows.length === 0) {
        return { success: false, message: 'Produto não encontrado.' };
      }

      await pool.query(
        'DELETE FROM ProdutoCasta WHERE ProdutoID = ? AND CastaID = ?', [CastaID, ProdutoID]);
    } catch (err) {
      console.error('Erro ao associar produto a promoção: ', err);
      return { success: false, message: 'Erro interno ao associar.' };
    }
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE produto SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

  async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE Produto SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

};
