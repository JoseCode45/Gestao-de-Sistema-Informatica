import { Router } from 'express';
const router = Router();
import { Promocao } from '../../models/produto/PromocaoModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as promocoes
router.get('/', async (req, res) => {
  const result = await Promocao.getAll();
  res.json(result);
});

//Criar promoção
// Adicionar Promocao
router.post('/', async (req, res) => {
  try {
    const criadorID = req.user.id;
    const { dataInicio, dataValidade, descontoTipo, descontoValor, motivo } = req.body;

    if (new Date(dataInicio) >= new Date(dataValidade)) {
      return res.status(400).json({ erro: 'Data de início deve ser anterior à data de validade.' });
    }

    if (descontoValor < 0) {
      return res.status(400).json({ erro: 'Um desconto deve ter valor positivo.' });
    } 

    const valor = Number(descontoValor);
    if (isNaN(valor)) {
      return res.status(400).json({ erro: 'Valor do desconto inválido.' });
    }

    const result = await Promocao.create(dataInicio, dataValidade, descontoTipo, valor, motivo, criadorID);
    res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

//Associar produtos a promoção .

// Obter Promocao por ID
router.get('/:id', async (req, res) => {
  const result = await Promocao.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'Promocao não encontrada' });
  res.json(result);
});



// Atualizar Promocao
router.put('/:id', async (req, res) => {
  const alteradorID = req.user.id; 
  const {dataInicio, dataValidade, descontoTipo, descontoValor, motivo} = req.body;

      // Validação de datas
    if (new Date(dataInicio) >= new Date(dataValidade)) {
      return res.status(400).json({ erro: 'Data de início deve ser anterior à data de validade.' });
    }

    if (descontoValor < 0) {
      return res.status(400).json({ erro: 'Um desconto deve ter valor positivo.' });
    } 

    if (descontoValor > 100 && descontoTipo == 'percentual') {
      return res.status(400).json({ erro: 'Um desconto percentual deve ser menor que 100%.' });
    } 

  await Promocao.update(req.params.id, dataInicio, dataValidade, descontoTipo, descontoValor, motivo, alteradorID);
  res.json({ message: 'Promocao atualizada' });
});


// PUT /promocao/:id/produtos, Substituir todos os produtos da promocao pelos produtos selecionados.
router.put('/:id/produtos', async (req, res) => {
  const promocaoID = Number(req.params.id);
  const alteradorID = req.user.id;
  const { produtos } = req.body;

  if (!Array.isArray(produtos)) {
    return res.status(400).json({ message: 'Campo "produtos" deve ser um array de IDs.' });
  }

  try {
    // 1. Desassociar produtos atuais da promocao
    const produtosAtuais = await Promocao.listarProdutosPromocao(promocaoID);
    for (const produto of produtosAtuais) {
      await Promocao.desassociarProdutoPromocao(promocaoID, produto.ID);
    }

    // 2. Associar novos produtos
    for (const produtoID of produtos) {
      const result = await Promocao.associarProdutoPromocao(promocaoID, produtoID);
      if (!result.success) {
        return res.status(400).json({ message: `Erro ao associar produto ID ${produtoID}: ${result.message}` });
      }
    }

    // 3. Atualizar alterador e data
    await Promocao.atualizarAlterador(promocaoID, alteradorID);

    res.json({ message: 'Produtos associados ao Promocao com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar produtos do Promocao:', err);
    res.status(500).json({ message: 'Erro interno ao atualizar produtos.' });
  }
});

//Obter lista de produtos de uma promocao
router.get('/:id/produtos', async (req, res) => {
  const promocaoID = req.params.id;

  try {
    const produtos = await Promocao.listar(promocaoID);
    res.json(produtos);
  } catch (err) {
    console.error('Erro ao buscar produtos do Promocao:', err);
    res.status(500).json({ message: 'Erro interno ao buscar produtos do Promocao.' });
  }
});

// Desativar Promocao
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Promocao.remove(req.params.id, alteradorID);
  res.json({ message: 'Promocao desativada' });
});

// Ativar Promocao
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Promocao.ativar(req.params.id, alteradorID);
  res.json({ message: 'Promocao ativada' });
});
export default router;