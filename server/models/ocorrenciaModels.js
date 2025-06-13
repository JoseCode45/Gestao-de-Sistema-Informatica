
// models/Ocorrencia.model.js
import pool from '../database.js';

export const Ocorrencia = {
    async getAll() {
        const [rows] = await pool.query(
            `SELECT 
    Ocorrencia.ID, Ocorrencia.DataRegisto, Ocorrencia.DataResolucao, Ocorrencia.Motivo, Ocorrencia.Descricao,
    Ocorrencia.RegistouID, u1.Nome AS NomeRegistou,
    Ocorrencia.ResolveuID, u2.Nome AS NomeResolveu,
    Ocorrencia.EstadoID, EstadoOcorrencia.Nome AS EstadoOcorrencia,
    Ocorrencia.CriadorID, u3.Nome AS NomeCriador,
    Ocorrencia.AlteradorID, u4.Nome AS NomeAlterador,
    Ocorrencia.DataCriacao, Ocorrencia.DataAlteracao, Ocorrencia.Solucao
    FROM Ocorrencia
     LEFT JOIN Utilizador u1 ON Ocorrencia.RegistouID = u1.ID
     LEFT JOIN Utilizador u2 ON Ocorrencia.ResolveuID = u2.ID
     LEFT JOIN EstadoOcorrencia ON Ocorrencia.EstadoID = EstadoOcorrencia.ID
      LEFT JOIN Utilizador u3 ON Ocorrencia.CriadorID = u3.ID
      LEFT JOIN Utilizador u4 ON Ocorrencia.AlteradorID = u4.ID
      ORDER BY Ocorrencia.EstadoID ASC`
        );
        return rows;
    },

    async resolver(id, alteradorID) {
        const [result] = await pool.query(
            'UPDATE Ocorrencia SET DataResolucao = NOW(), ResolveuID = ?, EstadoID = ?, AlteradorID = ? WHERE ID = ?',
            [alteradorID, 5, alteradorID, id]
        );
    },

    async getByUser(user) {
        const [rows] = await pool.query(`SELECT 
    Ocorrencia.ID, Ocorrencia.DataRegisto, Ocorrencia.DataResolucao, Ocorrencia.Motivo, Ocorrencia.Descricao,
    Ocorrencia.RegistouID, u1.Nome AS NomeRegistou,
    Ocorrencia.ResolveuID, u2.Nome AS NomeResolveu,
    Ocorrencia.EstadoID, EstadoOcorrencia.Nome AS EstadoOcorrencia,
    Ocorrencia.CriadorID, u3.Nome AS NomeCriador, Ocorrencia.Solucao
    FROM Ocorrencia
     LEFT JOIN Utilizador u1 ON Ocorrencia.RegistouID = u1.ID
     LEFT JOIN Utilizador u2 ON Ocorrencia.ResolveuID = u2.ID
     LEFT JOIN EstadoOcorrencia ON Ocorrencia.EstadoID = EstadoOcorrencia.ID
      LEFT JOIN Utilizador u3 ON Ocorrencia.CriadorID = u3.ID
      LEFT JOIN Utilizador u4 ON Ocorrencia.AlteradorID = u4.ID
      WHERE u1.ID = ?
      ORDER BY Ocorrencia.EstadoID ASC`, [user]);
        return rows;
    },

    async getById(id) {
        const [rows] = await pool.query(`SELECT 
    Ocorrencia.ID, Ocorrencia.DataRegisto, Ocorrencia.DataResolucao, Ocorrencia.Motivo, Ocorrencia.Descricao,
    Ocorrencia.RegistouID, u1.Nome AS NomeRegistou,
    Ocorrencia.ResolveuID, u2.Nome AS NomeResolveu,
    Ocorrencia.EstadoID, EstadoOcorrencia.Nome AS EstadoOcorrencia,
    Ocorrencia.CriadorID, u3.Nome AS NomeCriador,
    Ocorrencia.AlteradorID, u4.Nome AS NomeAlterador,
    Ocorrencia.DataCriacao, Ocorrencia.DataAlteracao, Ocorrencia.Solucao
    FROM Ocorrencia
     LEFT JOIN Utilizador u1 ON Ocorrencia.RegistouID = u1.ID
     LEFT JOIN Utilizador u2 ON Ocorrencia.ResolveuID = u2.ID
     LEFT JOIN EstadoOcorrencia ON Ocorrencia.EstadoID = EstadoOcorrencia.ID
      LEFT JOIN Utilizador u3 ON Ocorrencia.CriadorID = u3.ID
      LEFT JOIN Utilizador u4 ON Ocorrencia.AlteradorID = u4.ID
      WHERE Ocorrencia.ID = ?
      ORDER BY Ocorrencia.EstadoID ASC`, [id]);
        return rows[0];
    },
    //Criar Ocorrencia
    async create(motivo, descricao, registouID) {
        const [result] = await pool.query(
            'INSERT INTO Ocorrencia (Motivo, Descricao, RegistouID, EstadoID, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?)',
            [motivo, descricao, registouID, 1, registouID, registouID]
        );
        return result.insertId;
    },

    //Atualizar Ocorrencia
    async update(id, dataResolucao, motivo, descricao, resolveuID, estadoID, alteradorID) {
        await pool.query(
            'UPDATE Ocorrencia SET DataResolucao = ?, Motivo = ?, Descricao = ?, ResolveuID = ?, EstadoID = ?, AlteradorID = ? WHERE ID = ?',
            [dataResolucao, motivo, descricao, resolveuID, estadoID, alteradorID, id]
        );
    },

    //Resolver Ocorrencia
    async resolver(id, resolveuID, Solucao) {
        await pool.query(
            'UPDATE Ocorrencia SET DataResolucao = NOW(), ResolveuID = ?, Solucao = ?, EstadoID = 5 WHERE ID = ?',
            [resolveuID, Solucao, id]
        );
    },

    //Cancelar Ocorrencia
    async cancelar(id, resolveuID, Solucao) {
        await pool.query(
            'UPDATE Ocorrencia SET DataResolucao = NOW(), ResolveuID = ?, Solucao = ?, EstadoID = 6 WHERE ID = ?',
            [resolveuID, Solucao, id]
        );
    },

    //Ocorrencia em Analise
    async analise(id) {
        await pool.query(
            'UPDATE Ocorrencia SET EstadoID = 2 WHERE ID = ?',
            [id]
        );
    },

    //Definida a Reposiçao
    async reposicao(id, solucao) {
        await pool.query(
            'UPDATE Ocorrencia SET EstadoID = 3, Solucao = ? WHERE ID = ?',
            [solucao, id]
        );
    },

    //Definido Credito
    async credito(id, solucao) {
        await pool.query(
            'UPDATE Ocorrencia SET EstadoID = 4, Solucao = ? WHERE ID = ?',
            [solucao, id]
        );
    }

};
