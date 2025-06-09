// models/CategoriaFunc.model.js
import pool from '../../database.js';

export const CategoriaFunc = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM CategoriaFunc WHERE Estado = "ativo"');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM CategoriaFunc WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(nome, AreaFuncID, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO CategoriaFunc (Nome, AreaFuncID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?)',
      [nome, AreaFuncID, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, nome, AreaFuncID, alteradorID) {
    await pool.query(
      'UPDATE CategoriaFunc SET Nome = ?, AreaFuncID = ? AlteradorID = ? WHERE ID = ?',
      [nome, AreaFuncID, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE CategoriaFunc SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE CategoriaFunc SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
