import { Router } from 'express';
const router = Router();
import { Transportadora } from '../models/TransportadoraModels.js';
import authenticateToken from '../services/authenticateToken.js';
import authorizeRole from '../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as transportadoras
router.get('/', async (req, res) => {
  const transportadoras = await Transportadora.getAll();
  res.json(transportadoras);
});

// Obter Transportadora por ID
router.get('/:id', async (req, res) => {
  const Transportadoras = await Transportadora.getById(req.params.id);
  if (!Transportadoras) return res.status(404).json({ error: 'Transportadora não encontrada' });
  res.json(Transportadoras);
});

// Adicionar Transportadora
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await Transportadora.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar Transportadora
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await Transportadora.update(req.params.id, nome, alteradorID);
  res.json({ message: 'Transportadora atualizada' });
});

// Desativar Transportadora
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Transportadora.remove(req.params.id, alteradorID);
  res.json({ message: 'Transportadora desativada' });
});

// Ativar Transportadora
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Transportadora.ativar(req.params.id, alteradorID);
  res.json({ message: 'Transportadora ativada' });
});
export default router;