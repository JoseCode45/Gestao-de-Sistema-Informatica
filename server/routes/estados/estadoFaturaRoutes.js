import { Router } from 'express';
const router = Router();
import { EstadoFatura } from '../../models/estados/EstadoFaturaModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as EstadoFatura
router.get('/', async (req, res) => {
  const result = await EstadoFatura.getAll();
  res.json(result);
});

// Obter EstadoFatura por ID
router.get('/:id', async (req, res) => {
  const result = await EstadoFatura.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'EstadoFatura não encontrada' });
  res.json(result);
});

// Adicionar EstadoFatura
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await EstadoFatura.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar EstadoFatura
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await EstadoFatura.update(req.params.id, nome, alteradorID);
  res.json({ message: 'EstadoFatura atualizada' });
});

// Desativar EstadoFatura
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoFatura.remove(req.params.id, alteradorID);
  res.json({ message: 'EstadoFatura desativada' });
});

// Ativar EstadoFatura
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoFatura.ativar(req.params.id, alteradorID);
  res.json({ message: 'EstadoFatura ativada' });
});
export default router;