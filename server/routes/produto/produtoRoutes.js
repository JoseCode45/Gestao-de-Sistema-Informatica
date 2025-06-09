import { Router } from 'express';
const router = Router();
import { produto } from '../../models/produto/produtoModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// GET /produto/
router.get('/', async (req, res) => {
  const produtos = await produto.getAll();
  res.json(produtos);
});

// GET /produto/:id
router.get('/:id', async (req, res) => {
  const result = await produto.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'produto não encontrado' });
  res.json(result);
});

// POST /produto/
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await produto.create(nome, criadorID);
  res.status(201).json({ id });
});

// PUT /produto/:id
router.put('/:id', async (req, res) => {
  const alteradorID = req.user.id; 
  const { nome, preco, regiaoID } = req.body;

  if (!nome || preco === undefined || !regiaoID) {
    return res.status(400).json({ message: 'Faltam dados obrigatórios' });
  }

  try {
    await produto.update(req.params.id, nome, preco, regiaoID, alteradorID);
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});


// DELETE /produto/:id
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await produto.remove(req.params.id, alteradorID);
  res.json({ message: 'produto desativado' });
});

// Ativar produto
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await produto.ativar(req.params.id, alteradorID);
  res.json({ message: 'produto ativado' });
});

export default router;