// models/FornecedorEncomendaProdutos.model.js
import pool from '../../database.js';

export const FornecedorEncomendaProdutos = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM FornecedorEncomendaProdutos WHERE Estado = "ativo"');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM FornecedorEncomendaProdutos WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(produtoID, encomendaID, quantidade, valorUnitario, valorIVA, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO FornecedorEncomendaProdutos (ProdutoID, EncomendaID, Quantidade, ValorUnitario, ValorIVA, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [produtoID, encomendaID, quantidade, valorUnitario, valorIVA, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, produtoID, encomendaID, quantidade, valorUnitario, valorIVA, alteradorID) {
    await pool.query(
      'UPDATE FornecedorEncomendaProdutos SET ProdutoID = ?, EncomendaID = ?, Quantidade = ?, ValorUnitario = ?, ValorIVA = ?, AlteradorID = ? WHERE ID = ?',
      [produtoID, encomendaID, quantidade, valorUnitario, valorIVA, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE FornecedorEncomendaProdutos SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE FornecedorEncomendaProdutos SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
