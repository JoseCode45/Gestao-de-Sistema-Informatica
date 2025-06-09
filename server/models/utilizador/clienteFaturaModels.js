// models/ClienteFatura.model.js
import pool from '../../database.js';

export const ClienteFatura = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM ClienteFatura WHERE Estado = "ativo"');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM ClienteFatura WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(dataEmissao, dataValidade, dataPagamento, encomendaID, totalFaturado, totalIVA, estadoID, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO ClienteFatura (DataEmissao, DataValidade, DataPagamento, EncomendaID, TotalFaturado, TotalIVA, EstadoID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [dataEmissao, dataValidade, dataPagamento, encomendaID, totalFaturado, totalIVA, estadoID, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, dataValidade, dataPagamento, encomendaID, totalFaturado, totalIVA, estadoID, alteradorID) {
    await pool.query(
      'UPDATE ClienteFatura SET DataValidade = ?, DataPagamento = ?, EncomendaID = ?, TotalFaturado = ?, TotalIVA = ?, EstadoID = ?, AlteradorID = ? WHERE ID = ?',
      [dataValidade, dataPagamento, encomendaID, totalFaturado, totalIVA, estadoID, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE ClienteFatura SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE ClienteFatura SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
