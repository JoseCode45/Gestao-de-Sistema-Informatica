import { Router } from 'express';
const router = Router();
import { Fornecedor } from '../../models/fornecedor/FornecedorModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as Fornecedor
router.get('/', async (req, res) => {
  const result = await Fornecedor.getAll();
  res.json(result);
});

// Obter Fornecedor por ID
router.get('/:id', async (req, res) => {
  const result = await Fornecedor.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'Fornecedor não encontrada' });
  res.json(result);
});

// Adicionar Fornecedor
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await Fornecedor.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar Fornecedor
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await Fornecedor.update(req.params.id, nome, alteradorID);
  res.json({ message: 'Fornecedor atualizada' });
});

// Desativar Fornecedor
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Fornecedor.remove(req.params.id, alteradorID);
  res.json({ message: 'Fornecedor desativada' });
});

// Ativar Fornecedor
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Fornecedor.ativar(req.params.id, alteradorID);
  res.json({ message: 'Fornecedor ativada' });
});
export default router;