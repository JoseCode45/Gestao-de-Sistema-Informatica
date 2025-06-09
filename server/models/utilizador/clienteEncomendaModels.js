// models/ClienteEncomenda.model.js
import pool from '../../database.js';

export const ClienteEncomenda = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM ClienteEncomenda WHERE Estado = "ativo"');
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM ClienteEncomenda WHERE ID = ?', [id]);
    return rows[0];
  },

  async create(clienteID, dataEnvio, dataEntrega, totalEncomenda, totalIVA, totalProduto, totalTransporte, totalImpostos, criadorID) {
    const [result] = await pool.query(
      `INSERT INTO ClienteEncomenda 
      (ClienteID, DataEnvio, DataEntrega, TotalEncomenda, TotalIva, TotalProduto, TotalTransporte, TotalImpostos, CriadorID, AlteradorID ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [clienteID, dataEnvio, dataEntrega, totalEncomenda, totalIVA, totalProduto, totalTransporte, totalImpostos, criadorID]
    );
    return result.insertId;
  },



  async update(id, clienteID, dataEnvio, dataEntrega, totalEncomenda, totalIVA, totalProduto, totalTransporte, totalImpostos, alteradorID) {
    await pool.query(
      'UPDATE ClienteEncomenda SET ClienteID = ?, DataEnvio = ?, DataEntrega = ?, TotalEncomenda = ?, TotalIva = ?, TotalProduto = ?, TotalTransporte = ?, TotalImpostos = ?, AlteradorID = ? WHERE ID = ?',
      [clienteID, dataEnvio, dataEntrega, totalEncomenda, totalIVA, totalProduto, totalTransporte, totalImpostos, alteradorID, id]
    );
  },

  async remove(id, alteradorID) {
    await pool.query(
      'UPDATE ClienteEncomenda SET Estado = "inativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

    async ativar(id, alteradorID) {
    await pool.query(
      'UPDATE ClienteEncomenda SET Estado = "ativo", AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
  },

async updateTotals(encomendaID) {
  const [rows] = await pool.query(
    `SELECT 
       SUM(Quantidade * ValorUnitario) AS TotalProduto,
       SUM(Quantidade * ValorIVA) AS TotalIVA,
       SUM(Total) AS TotalEncomenda
     FROM ClienteEncomendaProdutos WHERE EncomendaID = ?`,
    [encomendaID]
  );

  const totais = rows[0];

  const totalTransporte = 5.00;  // Exemplo fixo
  const totalImpostos = (totais.TotalEncomenda || 0) * 0.23; // Exemplo 23% impostos

  await pool.query(
    `UPDATE ClienteEncomenda
     SET TotalProduto = ?, TotalIVA = ?, TotalEncomenda = ?, TotalTransporte = ?, TotalImpostos = ?, UpdateTime = NOW()
     WHERE ID = ?`,
    [
      totais.TotalProduto || 0,
      totais.TotalIVA || 0,
      totais.TotalEncomenda || 0,
      totalTransporte,
      totalImpostos,
      encomendaID
    ]
  );
},

async confirmar(encomendaID, alteradorID) {
  const estadoConfirmadoID = 2; // Exemplo para "confirmado"

  const [result] = await pool.query(
    `UPDATE ClienteEncomenda
     SET EstadoID = ?, AlteradorID = ?, UpdateTime = NOW()
     WHERE ID = ?`,
    [estadoConfirmadoID, alteradorID, encomendaID]
  );

  if (result.affectedRows === 0) {
    throw new Error('Encomenda não encontrada');
  }
  return true;
},

};
