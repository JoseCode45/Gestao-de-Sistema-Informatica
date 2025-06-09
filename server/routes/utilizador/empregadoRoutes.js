import { Router } from 'express';
const router = Router();
import { Empregado } from '../../models/utilizador/EmpregadoModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as Empregado
router.get('/', async (req, res) => {
  const result = await Empregado.getAll();
  res.json(result);
});

// Obter Empregado por ID
router.get('/:id', async (req, res) => {
  const result = await Empregado.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'Empregado não encontrada' });
  res.json(result);
});

// Adicionar Empregado
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await Empregado.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar Empregado
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await Empregado.update(req.params.id, nome, alteradorID);
  res.json({ message: 'Empregado atualizada' });
});

// Desativar Empregado
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Empregado.remove(req.params.id, alteradorID);
  res.json({ message: 'Empregado desativada' });
});

// Ativar Empregado
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Empregado.ativar(req.params.id, alteradorID);
  res.json({ message: 'Empregado ativada' });
});
export default router;