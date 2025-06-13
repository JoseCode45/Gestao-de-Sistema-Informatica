// models/FornecedorEncomenda.model.js
import pool from '../../database.js';

export const FornecedorEncomenda = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM FornecedorEncomenda');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM FornecedorEncomenda WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(fornecedorID, dataPedido, dataEntrega, totalEncomenda, totalIVA, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO FornecedorEncomenda (FornecedorID, DataPedido, DataEntrega, TotalEncomenda, TotalIva, CriadorID, AlteradorID ) VALUES (?, ?, ?, ?, ?, ?)',
      [fornecedorID, dataPedido, dataEntrega, totalEncomenda, totalIVA, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, fornecedorID, dataPedido, dataEntrega, totalEncomenda, totalIVA, alteradorID) {
    await pool.query(
      'UPDATE FornecedorEncomenda SET FornecedorID = ?, DataPedido = ?, DataEntrega = ?, TotalEncomenda = ?, TotalIva = ?, AlteradorID = ? WHERE ID = ?',
      [fornecedorID, dataPedido, dataEntrega, totalEncomenda, totalIVA, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE FornecedorEncomenda SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE FornecedorEncomenda SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
