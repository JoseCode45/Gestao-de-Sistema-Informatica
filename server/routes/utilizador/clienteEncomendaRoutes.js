import { Router } from 'express';
const router = Router();
import { ClienteEncomenda } from '../../models/utilizador/ClienteEncomendaModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';
import pool from '../../database.js';
import { confirmarNovaEncomenda } from '../../services/encomenda.js';


router.use(authenticateToken);

const IVA = 0.13;

router.get('/user', async (req, res) => {
  const user = req.user.id;
  const Encomendas = await ClienteEncomenda.getEncomendasCliente(user);
  res.json(Encomendas);
});




router.post('/encomendas/confirmar', authenticateToken, async (req, res) => {
  const { carrinho } = req.body;
  const IVA = 0.13;
  const totalTransporte = 5.00;

  if (!carrinho || !Array.isArray(carrinho) || carrinho.length === 0) {
    return res.status(400).json({ message: 'Carrinho inválido' });
  }
  await pool.query('START TRANSACTION'); //Começa a transação, caso alguma coisa dê errado, será dado ROLLBACK e voltará ao estado anterior
  try {
    const utilizadorID = req.user.id;

    // Buscar ClienteID correspondente ao UtilizadorID autenticado
    const [clienteRows] = await pool.query(
      'SELECT ID FROM Cliente WHERE UtilizadorID = ?',
      [utilizadorID]
    );

    //Caso não encontre um ClienteID
    if (clienteRows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado para este utilizador' });
    }
    const clienteID = clienteRows[0].ID;

    // Criar nova encomenda (temporariamente sem os totais)
    const [encomendaResult] = await pool.query(
      'INSERT INTO ClienteEncomenda (DataEnvio, ClienteID, EstadoID) VALUES (NOW(), ?, ?)',
      [clienteID, 1]
    );
    const encomendaID = encomendaResult.insertId;

    // Inicializar totais, serão usados para inserir em ClienteEncomenda
    let totalProduto = 0;
    let totalImpostos = 0;
      
    //Ações para cada item de um carrinho.
for (const item of carrinho) {
  const { ProdutoID, quantity } = item;

  // Verificar o stock disponível
  const [stockRows] = await pool.query(
    'SELECT Quantidade FROM ProdutoStock WHERE ProdutoID = ? FOR UPDATE',
    [ProdutoID]
  );

  if (stockRows.length === 0) {
    return res.status(400).json({ message: `Stock não encontrado para o Produto ID ${ProdutoID}.` });
  }

  const stockAtual = stockRows[0].Quantidade;

  if (stockAtual < quantity) {
    await pool.query('ROLLBACK');
    return res.status(400).json({
      message: `Stock insuficiente para o Produto ID ${ProdutoID}. Disponível: ${stockAtual}, Solicitado: ${quantity}`
    });
  }

  // Buscar preço e promoções
  const [produtoRows] = await pool.query(`
    SELECT 
      p.Preco, 
      pr.DescontoTipo, 
      pr.DescontoValor
    FROM Produto p
    LEFT JOIN ProdutoPromocao pp ON pp.ProdutoID = p.ID
    LEFT JOIN Promocao pr ON pr.ID = pp.PromocaoID
      AND pr.EstadoID = 3
      AND pr.DataInicio <= NOW()
      AND (pr.DataValidade IS NULL OR pr.DataValidade >= NOW())
    WHERE p.ID = ?
  `, [ProdutoID]);

  //Se não encontrou o ID da Promoção
  if (produtoRows.length === 0) {
    return res.status(400).json({ message: `Produto com ID ${ProdutoID} não encontrado.` });
  }


  const produto = produtoRows[0];
  let precoUnitario = produto.Preco;

  // Aplicar desconto se houver
  if (produto.DescontoTipo && produto.DescontoValor != null) {
    if (produto.DescontoTipo === 'percentual') {
      precoUnitario -= (precoUnitario * produto.DescontoValor / 100);
    } else if (produto.DescontoTipo === 'fixo') {
      precoUnitario -= produto.DescontoValor;
    }
  }

  precoUnitario = Math.max(precoUnitario, 0);

  const subtotal = precoUnitario * quantity;
  const valorIVA = subtotal * IVA;
  const total = subtotal + valorIVA;

  //Aumentar IVA e Produto 
  totalProduto += subtotal;
  totalImpostos += valorIVA;

  // Inserir produto na encomenda
  await pool.query(
    `INSERT INTO ClienteEncomendaProdutos 
     (EncomendaID, ProdutoID, Quantidade, ValorUnitario, ValorIVA, Total) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [encomendaID, ProdutoID, quantity, precoUnitario, valorIVA, total]
  );

  // Atualizar Stock
  await pool.query(
    'UPDATE ProdutoStock SET Quantidade = Quantidade - ?, UltimaSaida = NOW() WHERE ProdutoID = ?',
    [quantity, ProdutoID]
  );
}

    const totalEncomenda = totalProduto + totalImpostos + totalTransporte;

    // Atualizar ClienteEncomenda com os totais finais
    await pool.query(
      `UPDATE ClienteEncomenda
       SET TotalProduto = ?, totalImpostos = ?, TotalTransporte = ?, TotalEncomenda = ?
       WHERE ID = ?`,
      [totalProduto, totalImpostos, totalTransporte, totalEncomenda, encomendaID]
    );

    await pool.query('COMMIT');
    return res.status(201).json({ message: 'Encomenda confirmada com sucesso', encomendaID });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Erro ao confirmar encomenda:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});




// Obter todas as ClienteEncomenda
router.get('/', async (req, res) => {
  const result = await ClienteEncomenda.getAll();
  res.json(result);
});

// Obter ClienteEncomenda por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await ClienteEncomenda.getById(req.params.id);
    if (!result) return res.status(404).json({ erro: 'Encomenda não encontrada' });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar encomenda' });
  }
});

// Obter produtos de uma encomenda
router.get('/:id/produtos', async (req, res) => {
  try {
    const produtos = await ClienteEncomenda.getProdutos(req.params.id);
    res.json(produtos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar produtos da encomenda' });
  }
});

//Atualizar encomenda
router.put('/:id', async (req, res) => {
  try {
    const alteradorID = req.user.id;
    const { clienteID, dataEnvio, estadoID } = req.body;

    if (!clienteID || !dataEnvio || !estadoID) {
      return res.status(400).json({ erro: 'Campos obrigatórios em falta.' });
    }

    await ClienteEncomenda.update(req.params.id, clienteID, dataEnvio, estadoID, alteradorID);

    res.json({ message: 'Encomenda atualizada com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar encomenda' });
  }
});


//Atualizar produtos de encomenda
router.put('/:id/produtos', async (req, res) => {
  try {
    const encomendaID = Number(req.params.id);
    const alteradorID = req.user.id;
    const produtos = req.body;

    if (!Array.isArray(produtos)) {
      return res.status(400).json({ erro: '"produtos" deve ser um array.' });
    }

    // Remover produtos antigos
    await ClienteEncomenda.removerTodosProdutos(encomendaID);

    for (const prod of produtos) {
      const { ProdutoID, Quantidade } = prod;

      if (!ProdutoID || !Quantidade || Quantidade <= 0) {
        return res.status(400).json({ erro: 'ProdutoID e Quantidade são obrigatórios e válidos.' });
      }

      // Buscar dados do produto no banco
      const [rows] = await pool.query('SELECT Preco FROM Produto WHERE ID = ?', [ProdutoID]);
      if (rows.length === 0) {
        return res.status(400).json({ erro: `Produto com ID ${ProdutoID} não encontrado.` });
      }
      const produtoDB = rows[0];

      const ValorUnitario = produtoDB.Preco;
      const ValorIVA = (ValorUnitario * Quantidade) * (IVA);
      const Total = (ValorUnitario * Quantidade) + ValorIVA;

      // Inserir produto na encomenda com valores calculados
      await ClienteEncomenda.adicionarProduto(
        encomendaID,
        ProdutoID,
        Quantidade,
        ValorUnitario,
        ValorIVA,
        Total
      );
    }

    res.json({ message: 'Produtos da encomenda atualizados com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao atualizar produtos da encomenda.' });
  }
});


// Adicionar ClienteEncomenda
router.post('/', async (req, res) => {
  const criadorID = req.user.id;
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
  return res.status(400).json({ erro: 'Nome inválido' });
}

  const id = await ClienteEncomenda.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar ClienteEncomenda
router.put('/:id/up', async (req, res) => {
  const alteradorID = req.user.id; 
  const {nome} = req.body;
  await ClienteEncomenda.update(req.params.id, nome, alteradorID);
  res.json({ message: 'ClienteEncomenda atualizada' });
});

// Desativar ClienteEncomenda
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await ClienteEncomenda.remove(req.params.id, alteradorID);
  res.json({ message: 'ClienteEncomenda desativada' });
});

// Ativar ClienteEncomenda
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await ClienteEncomenda.ativar(req.params.id, alteradorID);
  res.json({ message: 'ClienteEncomenda ativada' });
});
export default router;