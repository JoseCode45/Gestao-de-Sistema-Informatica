// models/Armazem.model.js
import pool from '../database.js';

export const Armazem = {

    async getAll() {
    const [rows] = await pool.query(` SELECT A.ID, A.Morada, A.AreaM2, A.CriadorID, UC.nome AS CriadorNome, A.AlteradorID, UA.nome AS AlteradorNome, A.CreateTime, A.UpdateTime, A.Estado FROM Armazem A
LEFT JOIN Utilizador UC ON A.CriadorID = UC.ID
LEFT JOIN Utilizador UA ON A.AlteradorID = UA.ID`);
    return rows;
  },



  /*

  async getAll() {
    const [rows] = await pool.query('SELECT * FROM Armazem');
    return rows;
  },
*/
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM Armazem WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(Morada, AreaM2, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO Armazem (Morada, AreaM2, CriadorID, AlteradorID) VALUES (?, ?, ?, ?)',
      [Morada, AreaM2, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, Morada, AreaM2, alteradorID) {
    await pool.query(
      'UPDATE Armazem SET Morada = ?, AreaM2 = ?, AlteradorID = ? WHERE ID = ?',
      [Morada, AreaM2, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE Armazem SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE Armazem SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
