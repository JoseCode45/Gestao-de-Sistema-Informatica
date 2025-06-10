import { Router } from 'express';
const router = Router();
import { Casta } from '../../models/produto/castaModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

//router.use(authenticateToken);

// Obter todas as Castas
router.get('/', async (req, res) => {
  const result = await Casta.getAll();
  res.json(result);
});

// Obter Casta por ID
router.get('/:id', async (req, res) => {
  const result = await Casta.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'Casta não encontrada' });
  res.json(result);
});

// Adicionar Casta
router.post('/', async (req, res) => {
  const criadorID = req.user.id;
  const { nome } = req.body;
  const id = await Casta.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar Casta
router.put('/:id', async (req, res) => {
  const alteradorID = req.user.id; 
  const {nome} = req.body;
  await Casta.update(req.params.id, nome, alteradorID);
  res.json({ message: 'Casta atualizada' });
});

// Desativar Casta
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Casta.remove(req.params.id, alteradorID);
  res.json({ message: 'Casta desativada' });
});

// Ativar Casta
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Casta.ativar(req.params.id, alteradorID);
  res.json({ message: 'Casta ativada' });
});
export default router;