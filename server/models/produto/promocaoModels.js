// models/Promocao.model.js
import pool from '../../database.js';

export const Promocao = {
  //Obter todas as promoções
  async getAll() {
    const [rows] = await pool.query(`SELECT 
      p.ID, 
      p.DataInicio, p.DataValidade, p.DescontoValor, 
      p.DescontoTipo, p.Motivo,p.EstadoID, ep.Nome AS Estado,
      p.CriadorID, p.DataCriacao, uc.Nome AS CriadorNome, GROUP_CONCAT(pr.Nome SEPARATOR ', ') AS Produtos,
      p.AlteradorID, p.DataAlteracao, ua.Nome AS AlteradorNome
      FROM Promocao p
    LEFT JOIN Utilizador uc ON p.CriadorID = uc.ID
    LEFT JOIN Utilizador ua ON p.AlteradorID = ua.ID
    LEFT JOIN EstadoPromocao ep ON p.EstadoID = ep.ID
    LEFT JOIN ProdutoPromocao pp ON pp.PromocaoID = p.ID
    LEFT JOIN produto pr ON pr.ID = pp.ProdutoID AND pr.Estado = 'ativo'
    GROUP BY p.ID
    `);
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
      'INSERT INTO Promocao (DataInicio, DataValidade, DescontoTipo, DescontoValor, Motivo, CriadorID, AlteradorID, EstadoID) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
      [dataInicio, dataValidade, descontoTipo, descontoValor, motivo, criadorID, criadorID]
    );
    return result.insertId;
  },

  //Atualizar promoção
  async update(id, dataInicio, dataValidade, descontoTipo, descontoValor, motivo, alteradorID) {
    await pool.query(
      'UPDATE Promocao SET DataInicio = ?, DataValidade = ?, DescontoTipo = ?, DescontoValor = ?, Motivo = ?, AlteradorID = ? WHERE ID = ?',
      [dataInicio, dataValidade, descontoTipo, descontoValor, motivo, alteradorID, id]
    );
  },



  //Ver produtos com promoção ativa
  async produtosComPromocaoAtiva(ids) {
    const [rows] = await pool.query('SELECT ID, Nome FROM Produto WHERE ID IN (?) AND PromocaoID IS NOT NULL', [ids]);
    return rows;
  },

    // Associar produto a Promocao
async associarProdutoPromocao(PromocaoID, produtoID) {
  try {
    const [fornRows] = await pool.query('SELECT ID FROM Promocao WHERE ID = ?', [PromocaoID]);
    if (fornRows.length === 0) {
      return { success: false, message: 'Promocao não encontrado.' };
    }

    const [prodRows] = await pool.query('SELECT ID FROM Produto WHERE ID = ?', [produtoID]);
    if (prodRows.length === 0) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    await pool.query(
      'INSERT INTO ProdutoPromocao (PromocaoID, ProdutoID) VALUES (?, ?)', 
      [PromocaoID, produtoID]
    );

    return { success: true };
  } catch (err) {
    console.error('Erro ao associar produto a Promocao: ', err.message, err.stack);
    return { success: false, message: 'Erro interno ao associar.' };
  }
},

async desassociarProdutoPromocao(PromocaoID, produtoID) {
  try {
    const [fornRows] = await pool.query('SELECT ID FROM Promocao WHERE ID = ?', [PromocaoID]);
    if (fornRows.length === 0) {
      return { success: false, message: 'Promocao não encontrado.' };
    }

    const [prodRows] = await pool.query('SELECT ID FROM Produto WHERE ID = ?', [produtoID]);
    if (prodRows.length === 0) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    await pool.query(
      'DELETE FROM ProdutoPromocao WHERE PromocaoID = ? AND ProdutoID = ?', 
      [PromocaoID, produtoID]
    );

    return { success: true };
  } catch (err) {
    console.error('Erro ao desassociar produto do Promocao: ', err.message, err.stack);
    return { success: false, message: 'Erro interno ao desassociar.' };
  }
},

// Listar produtos de uma Promocao
async listarProdutosPromocao(PromocaoID) {
  const [rows] = await pool.query(
    `SELECT p.ID, p.Nome
     FROM ProdutoPromocao fp
     JOIN Produto p ON fp.ProdutoID = p.ID
     WHERE fp.PromocaoID = ? AND p.Estado = 'ativo'`,
    [PromocaoID]
  );
  return rows;
},

// Atualizar campos de auditoria do Promocao
async atualizarAlterador(promocaoID, alteradorID) {
  const dataAlteracao = new Date();
  await pool.query(
    'UPDATE Promocao SET AlteradorID = ?, DataAlteracao = ? WHERE ID = ?',
    [alteradorID, dataAlteracao, promocaoID]
  );
},

// Retorna os produtos fornecidos por um Promocao
async listar(promocaoID) {
  const [rows] = await pool.query(`
    SELECT p.ID, p.Nome
    FROM ProdutoPromocao fp
    JOIN Produto p ON p.ID = fp.ProdutoID
    WHERE fp.PromocaoID = ? AND p.Estado = 'ativo'
  `, [promocaoID]);

  return rows;
}



};
