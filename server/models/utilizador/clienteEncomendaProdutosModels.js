// models/ClienteEncomendaProdutos.model.js
import pool from '../../database.js';

export const ClienteEncomendaProdutos = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM ClienteEncomendaProdutos WHERE Estado = "ativo"');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM ClienteEncomendaProdutos WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(produtoID, encomendaID, quantidade, valorUnitario, valorIVA, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO ClienteEncomendaProdutos (ProdutoID, EncomendaID, Quantidade, ValorUnitario, ValorIVA, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [produtoID, encomendaID, quantidade, valorUnitario, valorIVA, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, produtoID, encomendaID, quantidade, valorUnitario, valorIVA, alteradorID) {
    await pool.query(
      'UPDATE ClienteEncomendaProdutos SET ProdutoID = ?, EncomendaID = ?, Quantidade = ?, ValorUnitario = ?, ValorIVA = ?, AlteradorID = ? WHERE ID = ?',
      [produtoID, encomendaID, quantidade, valorUnitario, valorIVA, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE ClienteEncomendaProdutos SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE ClienteEncomendaProdutos SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

  async  addProduto(encomendaID, produtoID, quantidade, valorUnitario, valorIVA) {
  const total = (valorUnitario + valorIVA) * quantidade;

  await pool.query(
    `INSERT INTO ClienteEncomendaProdutos (EncomendaID, ProdutoID, Quantidade, ValorUnitario, ValorIVA, Total)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       Quantidade = Quantidade + VALUES(Quantidade),
       Total = Total + VALUES(Total)`,
    [encomendaID, produtoID, quantidade, valorUnitario, valorIVA, total]
  );

  await updateTotals(encomendaID);
},
};
