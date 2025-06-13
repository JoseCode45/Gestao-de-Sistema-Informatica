// models/Transporte.model.js
import pool from '../database.js';

export const Transporte = {
  async getAll() {
    const [rows] = await pool.query(`SELECT
       t.ID, t.DataSaida, t.DataEntrega, t.CustoTotal, 
       t.ClienteEncomendaID, t.FornecedorEncomendaID, t.TransportadoraID, 
       t.CriadorID, uc.Nome AS CriadorNome,
       t.AlteradorID, ua.Nome As AlteradorNome,
       t.DataCriacao, t.DataAlteracao,
       t.EstadoID, et.Nome AS EstadoTransporte
       FROM Transporte t
    LEFT JOIN Utilizador uc ON t.CriadorID = uc.ID
    LEFT JOIN Utilizador ua ON t.AlteradorID = ua.ID
    LEFT JOIN EstadoTransporte et ON t.EstadoID = et.ID`);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(`SELECT
       t.ID, t.DataSaida, t.DataEntrega, t.CustoTotal, 
       t.ClienteEncomendaID, t.FornecedorEncomendaID, t.TransportadoraID, 
       t.CriadorID, uc.Nome AS CriadorNome,
       t.AlteradorID, ua.Nome As AlteradorNome,
       t.DataCriacao, t.DataAlteracao,
       t.EstadoID, et.Nome AS EstadoTransporte
       FROM Transporte t
    LEFT JOIN Utilizador uc ON t.CriadorID = uc.ID
    LEFT JOIN Utilizador ua ON t.AlteradorID = ua.ID
    LEFT JOIN EstadoTransporte et ON t.EstadoID = et.ID
    WHERE t.ID = ?`, [id]);
    return rows[0];
  },

  async create(dataSaida, dataEntrega, custoTotal, clienteEncomendaID, fornecedorEncomendaID, transportadoraID,  criadorID) { 
    const [result] = await pool.query(
      'INSERT INTO Transporte (DataSaida, DataEntrega, CustoTotal, ClienteEncomendaID, FornecedorEncomendaID, TransportadoraID, CriadorID, AlteradorID, EstadoID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)',
      [dataSaida, dataEntrega, custoTotal, clienteEncomendaID, fornecedorEncomendaID, transportadoraID,  criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, dataSaida, dataEntrega, custoTotal, clienteEncomendaID, fornecedorEncomendaID, transportadoraID, estadoID, alteradorID) {
    await pool.query(
      'UPDATE Transporte SET DataSaida = ?, DataEntrega = ?, CustoTotal = ?, ClienteEncomendaID = ?, FornecedorEncomendaID = ?, TransportadoraID = ?, EstadoID = ?, AlteradorID = ? WHERE ID = ?',
      [dataSaida, dataEntrega, custoTotal, clienteEncomendaID, fornecedorEncomendaID, transportadoraID, estadoID, alteradorID, id]
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
