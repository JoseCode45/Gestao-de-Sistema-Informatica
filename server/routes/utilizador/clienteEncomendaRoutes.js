import { Router } from 'express';
const router = Router();
import { ClienteEncomenda } from '../../models/utilizador/ClienteEncomendaModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as ClienteEncomenda
router.get('/', async (req, res) => {
  const result = await ClienteEncomenda.getAll();
  res.json(result);
});

// Obter ClienteEncomenda por ID
router.get('/:id', async (req, res) => {
  const result = await ClienteEncomenda.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'ClienteEncomenda não encontrada' });
  res.json(result);
});

// Adicionar ClienteEncomenda
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await ClienteEncomenda.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar ClienteEncomenda
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await ClienteEncomenda.update(req.params.id, nome, alteradorID);
  res.json({ message: 'ClienteEncomenda atualizada' });
});

// Desativar ClienteEncomenda
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await ClienteEncomenda.remove(req.params.id, alteradorID);
  res.json({ message: 'ClienteEncomenda desativada' });
});

// Ativar ClienteEncomenda
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await ClienteEncomenda.ativar(req.params.id, alteradorID);
  res.json({ message: 'ClienteEncomenda ativada' });
});
export default router;