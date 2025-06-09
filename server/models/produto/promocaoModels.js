// models/Promocao.model.js
import pool from '../../database.js';

export const Promocao = {
  //Obter todas as promoções
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM Promocao WHERE Estado = "ativo"');
    return rows;
  },

  //Obter promoção por ID
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM Promocao WHERE ID = ?', [id]);
    return rows[0];
  },

  //Criar promoção
  async create(dataInicio, dataValidade, descontoTipo, descontoValor, motivo, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO Promocao (DataInicio, DataValidade, DescontoTipo, Valor, Motivo, CriadorID, AlteradorID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [dataInicio, dataValidade, descontoTipo, descontoValor, motivo, criadorID, criadorID]
    );
    return result.insertId;
  },

  //Atualizar promoção
  async update(id, dataInicio, dataValidade, descontoTipo, descontoValor, motivo, alteradorID) {
    await pool.query(
      'UPDATE Promocao SET DataInicio = ?, DataValidade = ?, DescontoTipo = ?, Valor = ?, Motivo = ?, AlteradorID = ? WHERE ID = ?',
      [dataInicio, dataValidade, descontoTipo, descontoValor, motivo, alteradorID, id]
    );
  },

  //Remover promoção
  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE Promocao SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

  //Ativar promoção
  async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE Promocao SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },


  //Ver produtos com promoção ativa
  async produtosComPromocaoAtiva(ids) {
    const [rows] = await pool.query('SELECT ID, Nome FROM Produto WHERE ID IN (?) AND PromocaoID IS NOT NULL', [ids]);
    return rows;
  },


};
