// models/Fornecedor.model.js
import pool from '../../database.js';

export const Fornecedor = {
  async getAll() {
    const [rows] = await pool.query(`
    SELECT 
      f.ID, f.Nome, f.Morada, f.NIF, f.Responsavel, f.CriadorID,
      uc.Nome AS CriadorNome, f.AlteradorID, ua.Nome AS AlteradorNome, f.DataCriacao, f.DataAlteracao, f.Estado
    FROM Fornecedor f
    LEFT JOIN Utilizador uc ON f.CriadorID = uc.ID
    LEFT JOIN Utilizador ua ON f.AlteradorID = ua.ID
  `);
    return rows;
  },


  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM Fornecedor WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(nome, morada, NIF, responsavel, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO Fornecedor (Nome, Morada, NIF, Responsavel, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, morada, NIF, responsavel, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, nome, morada, NIF, responsavel, alteradorID) {
    await pool.query(
      'UPDATE Fornecedor SET Nome = ?, Morada = ?, NIF = ?, Responsavel = ?, AlteradorID = ? WHERE ID = ?',
      [nome, morada, NIF, responsavel, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE Fornecedor SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

  async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE Fornecedor SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
