// models/Cliente.model.js
import pool from '../../database.js';

export const Cliente = {
  async getAll() {
    const [rows] = await pool.query(`SELECT Cliente.ID, Cliente.NIF, Cliente.UtilizadorID, UT.Nome AS Utilizador,
                                    Cliente.CriadorID, Criador.Nome AS Criador, Cliente.AlteradorID, Alterador.Nome AS Alterador, Cliente.DataCriacao, 
                                    Cliente.DataAlteracao, Cliente.Estado FROM Cliente
                                    LEFT JOIN Utilizador UT ON Cliente.UtilizadorID = UT.ID
                                    LEFT JOIN Utilizador Criador ON Cliente.CriadorID = Criador.ID
                                    LEFT JOIN Utilizador Alterador ON Cliente.AlteradorID = Alterador.ID`);
    return rows;
  },

  // Retorna lista de clientes ativos com seus nomes
async listarClientesAtivos() {
  const [clientes] = await pool.query(`
    SELECT 
      Cliente.ID, 
      Utilizador.Nome 
    FROM Cliente
    INNER JOIN Utilizador ON Cliente.UtilizadorID = Utilizador.ID
    WHERE Cliente.Estado = 'ativo'
  `);
  return clientes;
},

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM Cliente WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(NIF, utilizadorID, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO Cliente (NIF, UtilizadorID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?)',
      [NIF, utilizadorID, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, NIF, utilizadorID, alteradorID) {
    await pool.query(
      'UPDATE Cliente SET NIF = ?, utilizadorID = ?, AlteradorID = ? WHERE ID = ?',
      [NIF, utilizadorID, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE Cliente SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

  async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE Cliente SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
