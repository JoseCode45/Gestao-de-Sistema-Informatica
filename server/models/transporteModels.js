// models/Transporte.model.js
import pool from '../database.js';

export const Transporte = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM Transporte WHERE Estado = "ativo"');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM Transporte WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(nome, dataSaida, dataEntrega, custo, clienteEncomendaID, fornecedorEncomendaID, transportadoraID,  criadorID) { 
    const [result] = await pool.query(
      'INSERT INTO Transporte (Nome, DataSaida, DataEntrega, Custo, ClienteEncomendaID, FornecedorEncomendaID, TransportadoraID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nome, dataSaida, dataEntrega, custo, clienteEncomendaID, fornecedorEncomendaID, transportadoraID,  criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, nome, dataSaida, dataEntrega, custo, clienteEncomendaID, fornecedorEncomendaID, transportadoraID, alteradorID) {
    await pool.query(
      'UPDATE Transporte SET Nome = ?, DataSaida = ?, DataEntrega = ?, Custo = ?, ClienteEncomendaID = ?, FornecedorEncomendaID = ?, TransportadoraID = ?, AlteradorID = ? WHERE ID = ?',
      [nome, dataSaida, dataEntrega, custo, clienteEncomendaID, fornecedorEncomendaID, transportadoraID, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE Transporte SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE Transporte SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
