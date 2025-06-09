import { Router } from 'express';
const router = Router();
import { Cliente } from '../../models/utilizador/ClienteModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as Cliente
router.get('/', async (req, res) => {
  const result = await Cliente.getAll();
  res.json(result);
});

// Obter Cliente por ID
router.get('/:id', async (req, res) => {
  const result = await Cliente.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'Cliente não encontrada' });
  res.json(result);
});

// Adicionar Cliente
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await Cliente.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar Cliente
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await Cliente.update(req.params.id, nome, alteradorID);
  res.json({ message: 'Cliente atualizada' });
});

// Desativar Cliente
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Cliente.remove(req.params.id, alteradorID);
  res.json({ message: 'Cliente desativada' });
});

// Ativar Cliente
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Cliente.ativar(req.params.id, alteradorID);
  res.json({ message: 'Cliente ativada' });
});
export default router;