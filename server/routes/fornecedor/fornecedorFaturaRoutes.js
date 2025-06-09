import { Router } from 'express';
const router = Router();
import { FornecedorFatura } from '../../models/fornecedor/FornecedorFaturaModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as FornecedorFatura
router.get('/', async (req, res) => {
  const result = await FornecedorFatura.getAll();
  res.json(result);
});

// Obter FornecedorFatura por ID
router.get('/:id', async (req, res) => {
  const result = await FornecedorFatura.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'FornecedorFatura não encontrada' });
  res.json(result);
});

// Adicionar FornecedorFatura
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await FornecedorFatura.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar FornecedorFatura
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await FornecedorFatura.update(req.params.id, nome, alteradorID);
  res.json({ message: 'FornecedorFatura atualizada' });
});

// Desativar FornecedorFatura
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await FornecedorFatura.remove(req.params.id, alteradorID);
  res.json({ message: 'FornecedorFatura desativada' });
});

// Ativar FornecedorFatura
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await FornecedorFatura.ativar(req.params.id, alteradorID);
  res.json({ message: 'FornecedorFatura ativada' });
});
export default router;