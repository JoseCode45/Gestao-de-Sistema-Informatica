// models/Transporte.model.js
import pool from '../database.js';

export const Transporte = {
  async getAll() {
    const [rows] = await pool.query(`SELECT
       t.ID, t.DataSaida, t.DataEntrega, t.CustoTotal, 
       t.ClienteEncomendaID, t.FornecedorEncomendaID, t.TransportadoraID, tr.Nome AS Transportadora,
       t.CriadorID, uc.Nome AS CriadorNome,
       t.AlteradorID, ua.Nome As AlteradorNome,
       t.DataCriacao, t.DataAlteracao,
       t.EstadoID, et.Nome AS EstadoTransporte
       FROM Transporte t
    LEFT JOIN Utilizador uc ON t.CriadorID = uc.ID
    LEFT JOIN Utilizador ua ON t.AlteradorID = ua.ID
    LEFT JOIN Transportadora tr ON t.TransportadoraID = tr.ID
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

  async create(dataSaida, dataEntrega, custoTotal, clienteEncomendaID, fornecedorEncomendaID, transportadoraID, criadorID) {
    const [result] = await pool.query(
      'INSERT INTO Transporte (DataSaida, DataEntrega, CustoTotal, ClienteEncomendaID, FornecedorEncomendaID, TransportadoraID, CriadorID, AlteradorID, EstadoID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)',
      [dataSaida, dataEntrega, custoTotal, clienteEncomendaID, fornecedorEncomendaID, transportadoraID, criadorID, criadorID]
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

  //#########################
// Fornecedor
//#########################


  //Confiramr encomenda a fornecedor
  async confirmarFornecedor(id, alteradorID) {
    await pool.query(
      'UPDATE FornecedorEncomenda SET EstadoID = 4, AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );

    const [rows] = await pool.query(`
   SELECT 
      fe.ID, fe.FornecedorID, fc.Nome AS FornecedorNome, fe.DataPedido, fe.DataEntrega,
      fe.TotalEncomenda, fe.TotalIva, fe.EstadoID,
      ee.Nome AS EstadoNome, fe.CriadorID, u1.Nome AS CriadorNome, fe.AlteradorID, u2.Nome AS AlteradorNome, fe.DataCriacao,
      fe.DataAlteracao
    FROM FornecedorEncomenda fe
    LEFT JOIN Fornecedor fc ON fe.FornecedorID = fc.ID
    LEFT JOIN EstadoEncomenda ee ON fe.EstadoID = ee.ID
    LEFT JOIN Utilizador u1 ON fe.CriadorID = u1.ID
    LEFT JOIN Utilizador u2 ON fe.AlteradorID = u2.ID
    WHERE fe.ID = ?
    ORDER BY fe.ID DESC
  `, [id]);

    const [result] = await pool.query(
      'INSERT INTO Transporte (DataSaida, DataEntrega, CustoTotal, ClienteEncomendaID, FornecedorEncomendaID, TransportadoraID, CriadorID, AlteradorID, EstadoID) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, 1)',
      [rows.DataEntrega, 10, null, id, 17, alteradorID, alteradorID]
    );
  },


  //cancelar encomenda a fornecedor
  async cancelarFornecedor(id, alteradorID) {

    const [result] = await pool.query(
      'SELECT * FROM FornecedorEncomenda WHERE ID = ?',
      [id]
    );

    const encomenda = result[0];

    if (encomenda.EstadoID === 3 || encomenda.EstadoID === 5) {
      throw new Error('Cancelamento não permitido: encomenda já está cancelada ou em estado final.');
    }


    await pool.query(
      'UPDATE FornecedorEncomenda SET EstadoID = 3, AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );

    await pool.query(
      'UPDATE FornecedorFatura SET EstadoID = 4, AlteradorID = ? WHERE EncomendaID = ?',
      [alteradorID, id]
    );


    await pool.query(
      'UPDATE Transporte SET EstadoID = 4, AlteradorID = ? WHERE FornecedorEncomendaID = ?',
      [alteradorID, id]
    );
  },


//Ativar proxima fase do transporte
  async proxfaseTransporte(id, alteradorID) {
    const [result] = await pool.query(
      `SELECT * FROM Transporte WHERE ID = ?`,
      [id]
    );

    const transporte = result[0];
    console.log("Transporte encontrado:", transporte);

    if (transporte.EstadoID == 1) {
      await pool.query(
        'UPDATE Transporte SET EstadoID = 2, AlteradorID = ? WHERE ID = ?',
        [alteradorID, id]
      );
    } else if (transporte.EstadoID == 2 || transporte.EstadoID == 3) {
      await pool.query(
        'UPDATE Transporte SET EstadoID = 3, AlteradorID = ? WHERE ID = ?',
        [alteradorID, id]
      );

      const [encomenda] = await pool.query(
        `SELECT fe.*
          FROM Transporte t
          JOIN FornecedorEncomenda fe ON t.FornecedorEncomendaID = fe.ID
          WHERE t.ID = ?`,
          [id]
      )

      const fornecedorEncomenda = encomenda[0];

      await pool.query(
        'UPDATE FornecedorEncomenda SET EstadoID = 5, DataEntrega = NOW(), AlteradorID = ? WHERE ID = ?',
        [alteradorID, fornecedorEncomenda.ID]
      );

          // Buscar todos os produtos da encomenda
    const [produtos] = await pool.query(
      `SELECT ProdutoID, Quantidade FROM FornecedorEncomendaProdutos WHERE EncomendaID = ?`,
      [fornecedorEncomenda.ID]
    );

    // Para cada produto, somar a quantidade ao stock atual
    for (const produto of produtos) {
      console.log('ProdutoID:', produto.ProdutoID, 'Quantidade:', produto.Quantidade, 'EncomendaID:', fornecedorEncomenda.ID);
      // Atualizar ProdutoStock: adicionar
      //  Quantidade à Quantidade existente
      await pool.query(
        `UPDATE ProdutoStock 
         SET Quantidade = Quantidade + ?, UltimaEntrada = NOW(), AlteradorID = ?
         WHERE ProdutoID = ?`,
        [produto.Quantidade, alteradorID, produto.ProdutoID]
      );
    }

    }
  },

  //#########################
// Cliente
//#########################


  //Confiramr encomenda a cliente
  async confirmarCliente(id, alteradorID) {
    await pool.query(
      'UPDATE ClienteEncomenda SET EstadoID = 4, AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );

    const [rows] = await pool.query(`
   SELECT 
      ce.ID, ce.ClienteID, c.Nome AS ClienteNome, ce.DataEnvio, ce.DataEntrega,
      ce.TotalEncomenda, ce.TotalProduto, ce.TotalTransporte, ce.TotalImpostos, ce.EstadoID, ce.Morada,
      ee.Nome AS EstadoNome, ce.CriadorID, u1.Nome AS CriadorNome, ce.AlteradorID, u2.Nome AS AlteradorNome, ce.DataCriacao,
      ce.DataAlteracao
    FROM ClienteEncomenda ce
    LEFT JOIN Cliente ct ON ce.ClienteID = ct.ID
    LEFT JOIN Utilizador c ON ct.UtilizadorID = c.ID
    LEFT JOIN EstadoEncomenda ee ON ce.EstadoID = ee.ID
    LEFT JOIN Utilizador u1 ON ce.CriadorID = u1.ID
    LEFT JOIN Utilizador u2 ON ce.AlteradorID = u2.ID
    WHERE ce.ID = ?
    ORDER BY ce.ID DESC
  `, [id]);

    const [result] = await pool.query(
      'INSERT INTO Transporte (DataSaida, DataEntrega, CustoTotal, ClienteEncomendaID, FornecedorEncomendaID, TransportadoraID, CriadorID, AlteradorID, EstadoID) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, 1)',
      [rows.DataEntrega, 10, id, null, 17, alteradorID, alteradorID]
    );

  },


  //cancelar encomenda a cliente
  async cancelarCliente(id, alteradorID) {

    const [result] = await pool.query(
      'SELECT * FROM ClienteEncomenda WHERE ID = ?',
      [id]
    );

    const encomenda = result[0];

    if (encomenda.EstadoID === 3 || encomenda.EstadoID === 5) {
      throw new Error('Cancelamento não permitido: encomenda já está cancelada ou em estado final.');
    }

    
    await pool.query(
      'UPDATE ClienteEncomenda SET EstadoID = 3, AlteradorID = ? WHERE ID = ?',
      [alteradorID, id]
    );
    
    
    await pool.query(
      'UPDATE ClienteFatura SET EstadoID = 4, AlteradorID = ? WHERE EncomendaID = ?',
      [alteradorID, id]
    );
    

    await pool.query(
      'UPDATE Transporte SET EstadoID = 4, AlteradorID = ? WHERE ClienteEncomendaID = ?',
      [alteradorID, id]
    );

                      // Buscar todos os produtos da encomenda
    const [produtos] = await pool.query(
      `SELECT ProdutoID, Quantidade FROM ClienteEncomendaProdutos WHERE EncomendaID = ?`,
      [id]
    );

    // Para cada produto, somar a quantidade ao stock atual
    for (const produto of produtos) {
       console.log('ProdutoID:', produto.ProdutoID, 'Quantidade:', produto.Quantidade, 'EncomendaID:', encomenda.ID);
      // Atualizar ProdutoStock: adicionar
      //  Quantidade à Quantidade existente
      await pool.query(
        `UPDATE ProdutoStock 
         SET Quantidade = Quantidade + ?, UltimaEntrada = NOW(), AlteradorID = ?
         WHERE ProdutoID = ?`,
        [produto.Quantidade, alteradorID, produto.ProdutoID]
      );
    }

  },


//Ativar proxima fase do transporte
  async proxfaseTransporteCliente(id, alteradorID) {
    const [result] = await pool.query(
      `SELECT * FROM Transporte WHERE ID = ?`,
      [id]
    );

    const transporte = result[0];
    console.log("Transporte encontrado:", transporte);

    if (transporte.EstadoID == 1) {
      await pool.query(
        'UPDATE Transporte SET EstadoID = 2, AlteradorID = ? WHERE ID = ?',
        [alteradorID, id]
      );
    } else if (transporte.EstadoID == 2 || transporte.EstadoID == 3) {
      await pool.query(
        'UPDATE Transporte SET EstadoID = 3, AlteradorID = ? WHERE ID = ?',
        [alteradorID, id]
      );

      const [encomenda] = await pool.query(
        `SELECT fe.*
          FROM Transporte t
          JOIN ClienteEncomenda fe ON t.ClienteEncomendaID = fe.ID
          WHERE t.ID = ?`,
          [id]
      )

      const clienteEncomenda = encomenda[0];

      await pool.query(
        'UPDATE ClienteEncomenda SET EstadoID = 5, DataEntrega = NOW(), AlteradorID = ? WHERE ID = ?',
        [alteradorID, clienteEncomenda.ID]
      );
    }
  },


};
