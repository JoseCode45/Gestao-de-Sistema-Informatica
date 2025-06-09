
// models/Transportadora.model.js
import pool from '../database.js';

export const Transportadora = {
    async getAll() {
        const [rows] = await pool.query('SELECT * FROM Transportadora WHERE Estado = "ativo"');
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query('SELECT * FROM Transportadora WHERE ID = ?', [id]);
        return rows[0];
    },

    async create(nome, NIF, valor, morada, responsavel, criadorID) {
        const [result] = await pool.query(
            'INSERT INTO Transportadora (Nome, NIF, Valor, Morada, Responsavel, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nome, NIF, valor, morada, responsavel, criadorID, criadorID]
        );
        return result.insertId;
    },


    async update(id, nome, NIF, valor, morada, responsavel, alteradorID) {
        await pool.query(
            'UPDATE Transportadora SET Nome = ?, NIF = ?, Valor = ?, Morada = ?, Responsavel = ?, AlteradorID = ? WHERE ID = ?',
            [nome, NIF, valor, morada, responsavel, alteradorID, id]
        );
    },

    async remove(id, alteradorID) {
        await pool.query(
            'UPDATE Transportadora SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
            [alteradorID, id]
        );
    },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE Transportadora SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
