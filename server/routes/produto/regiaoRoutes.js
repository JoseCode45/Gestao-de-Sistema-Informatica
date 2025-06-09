import { Router } from 'express';
const router = Router();
import { Regiao } from '../../models/produto/RegiaoModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as regioes
router.get('/', async (req, res) => {
  const result = await Regiao.getAll();
  res.json(result);
});

// Obter Regiao por ID
router.get('/:id', async (req, res) => {
  const result = await Regiao.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'Regiao não encontrada' });
  res.json(result);
});

// Adicionar Regiao
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await Regiao.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar Regiao
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await Regiao.update(req.params.id, nome, alteradorID);
  res.json({ message: 'Regiao atualizada' });
});

// Desativar Regiao
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Regiao.remove(req.params.id, alteradorID);
  res.json({ message: 'Regiao desativada' });
});

// Ativar Regiao
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Regiao.ativar(req.params.id, alteradorID);
  res.json({ message: 'Regiao ativada' });
});
export default router;