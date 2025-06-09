// models/FornecedorFatura.model.js
import pool from '../../database.js';

export const FornecedorFatura = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM FornecedorFatura WHERE Estado = "ativo"');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM FornecedorFatura WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(dataEmissao, dataValidade, dataPagamento, encomendaID, totalFaturado, totalIVA, estadoID, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO FornecedorFatura (DataEmissao, DataValidade, DataPagamento, EncomendaID, TotalFaturado, TotalIVA, EstadoID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [dataEmissao, dataValidade, dataPagamento, encomendaID, totalFaturado, totalIVA, estadoID, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, dataValidade, dataPagamento, encomendaID, totalFaturado, totalIVA, estadoID, alteradorID) {
    await pool.query(
      'UPDATE FornecedorFatura SET DataValidade = ?, DataPagamento = ?, EncomendaID = ?, TotalFaturado = ?, TotalIVA = ?, EstadoID = ?, AlteradorID = ? WHERE ID = ?',
      [dataValidade, dataPagamento, encomendaID, totalFaturado, totalIVA, estadoID, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE FornecedorFatura SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE FornecedorFatura SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
