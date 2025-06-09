// models/Empregado.model.js
import pool from '../../database.js';

export const Empregado = {
async getAll() {
  const [rows] = await pool.query(`
    SELECT 
      Empregado.ID AS EmpregadoID, Empregado.DataNascimento, Utilizador.ID AS UtilizadorID, Utilizador.Nome AS Nome,
      Utilizador.Email AS Email, Utilizador.Morada AS Morada, Genero.Nome AS Genero, Nacionalidade.Nome AS Nacionalidade, CategoriaFunc.Nome AS CategoriaFuncional, AreaFunc.Nome AS AreaFuncional,
      Utilizador.DataCriacao, Utilizador.DataAlteracao,Utilizador.CriadorID,Criador.Nome AS CriadorNome,Utilizador.AlteradorID,Alterador.Nome AS AlteradorNome, Empregado.Estado
    FROM Empregado
    INNER JOIN Utilizador ON Empregado.UtilizadorID = Utilizador.ID
    LEFT JOIN Genero ON Utilizador.GeneroID = Genero.ID
    LEFT JOIN Nacionalidade ON Empregado.NacionalidadeID = Nacionalidade.ID
    LEFT JOIN CategoriaFunc ON Empregado.CategoriaFuncID = CategoriaFunc.ID
    LEFT JOIN AreaFunc ON CategoriaFunc.AreaFuncID = AreaFunc.ID
    LEFT JOIN Utilizador AS Criador ON Utilizador.CriadorID = Criador.ID
    LEFT JOIN Utilizador AS Alterador ON Utilizador.AlteradorID = Alterador.ID
  `);
  return rows;
},


  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM Empregado WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(dataNascimento, categoriaFuncID, nacionalidadeID, utilizadorID, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO Empregado (DataNascimento, CategoriaFuncID, NacionalidadeID, UtilizadorID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?)',
      [dataNascimento, categoriaFuncID, nacionalidadeID, utilizadorID, criadorID, criadorID]
    );
    return result.insertId;
  },

  async update(id, dataNascimento, categoriaFuncID, nacionalidadeID, utilizadorID, alteradorID) {
    await pool.query(
      'UPDATE Empregado SET dataNascimento = ?, categoriaFuncID = ?, nacionalidadeID = ?, utilizadorID = ?, AlteradorID = ? WHERE ID = ?',
      [dataNascimento, categoriaFuncID, nacionalidadeID, utilizadorID, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE Empregado SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE Empregado SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },
};
