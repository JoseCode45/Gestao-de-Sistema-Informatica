import { Router } from 'express';
const router = Router();
import { EstadoPromocao } from '../../models/estados/EstadoPromocaoModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as EstadoPromocao
router.get('/', async (req, res) => {
  const result = await EstadoPromocao.getAll();
  res.json(result);
});

// Obter EstadoPromocao por ID
router.get('/:id', async (req, res) => {
  const result = await EstadoPromocao.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'EstadoPromocao não encontrada' });
  res.json(result);
});

// Adicionar EstadoPromocao
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await EstadoPromocao.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar EstadoPromocao
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await EstadoPromocao.update(req.params.id, nome, alteradorID);
  res.json({ message: 'EstadoPromocao atualizada' });
});

// Desativar EstadoPromocao
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoPromocao.remove(req.params.id, alteradorID);
  res.json({ message: 'EstadoPromocao desativada' });
});

// Ativar EstadoPromocao
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoPromocao.ativar(req.params.id, alteradorID);
  res.json({ message: 'EstadoPromocao ativada' });
});
export default router;