import { Router } from 'express';
const router = Router();
import { CategoriaFunc } from '../../models/utilizador/CategoriaFuncModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as categoriaFunc
router.get('/', async (req, res) => {
  const categoriaFunc = await CategoriaFunc.getAll();
  res.json(categoriaFunc);
});



// Obter CategoriaFunc por ID
router.get('/:id', async (req, res) => {
  const CategoriaFunc = await CategoriaFunc.getById(req.params.id);
  if (!CategoriaFunc) return res.status(404).json({ error: 'CategoriaFunc não encontrada' });
  res.json(CategoriaFunc);
});

// Adicionar CategoriaFunc
router.post('/', async (req, res) => {
  const criadorID = req.user.id;
  const { nome } = req.body;
  const id = await CategoriaFunc.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar CategoriaFunc
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await CategoriaFunc.update(req.params.id, nome, alteradorID);
  res.json({ message: 'CategoriaFunc atualizada' });
});

// Desativar CategoriaFunc
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await CategoriaFunc.remove(req.params.id, alteradorID);
  res.json({ message: 'CategoriaFunc desativada' });
});

// Ativar CategoriaFunc
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await CategoriaFunc.ativar(req.params.id, alteradorID);
  res.json({ message: 'CategoriaFunc ativada' });
});
export default router;