import { Router } from 'express';
const router = Router();
import { AreaFunc } from '../../models/utilizador/AreaFuncModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as areaFunc
router.get('/', async (req, res) => {
  const areaFunc = await AreaFunc.getAll();
  res.json(areaFunc);
});

// Obter AreaFunc por ID
router.get('/:id', async (req, res) => {
  const AreaFunc = await AreaFunc.getById(req.params.id);
  if (!AreaFunc) return res.status(404).json({ error: 'AreaFunc não encontrada' });
  res.json(AreaFunc);
});

// Adicionar AreaFunc
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await AreaFunc.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar AreaFunc
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await AreaFunc.update(req.params.id, nome, alteradorID);
  res.json({ message: 'AreaFunc atualizada' });
});

// Desativar AreaFunc
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await AreaFunc.remove(req.params.id, alteradorID);
  res.json({ message: 'AreaFunc desativada' });
});

// Ativar AreaFunc
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await AreaFunc.ativar(req.params.id, alteradorID);
  res.json({ message: 'AreaFunc ativada' });
});
export default router;