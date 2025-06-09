// models/EstadoPromocao.model.js
import pool from '../../database.js';

export const EstadoPromocao = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM EstadoPromocao WHERE Estado = "ativo"');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM EstadoPromocao WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(nome, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO EstadoPromocao (Nome, CriadorID, AlteradorID) VALUES (?, ?, ?)',
      [nome, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, nome, alteradorID) {
    await pool.query(
      'UPDATE EstadoPromocao SET Nome = ?, AlteradorID = ? WHERE ID = ?',
      [nome, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE EstadoPromocao SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE EstadoPromocao SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
