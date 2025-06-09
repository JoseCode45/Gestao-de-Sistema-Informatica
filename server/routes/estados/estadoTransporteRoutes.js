import { Router } from 'express';
const router = Router();
import { EstadoTransporte } from '../../models/estados/EstadoTransporteModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as EstadoTransporte
router.get('/', async (req, res) => {
  const result = await EstadoTransporte.getAll();
  res.json(result);
});

// Obter EstadoTransporte por ID
router.get('/:id', async (req, res) => {
  const result = await EstadoTransporte.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'EstadoTransporte não encontrada' });
  res.json(result);
});

// Adicionar EstadoTransporte
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await EstadoTransporte.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar EstadoTransporte
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await EstadoTransporte.update(req.params.id, nome, alteradorID);
  res.json({ message: 'EstadoTransporte atualizada' });
});

// Desativar EstadoTransporte
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoTransporte.remove(req.params.id, alteradorID);
  res.json({ message: 'EstadoTransporte desativada' });
});

// Ativar EstadoTransporte
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoTransporte.ativar(req.params.id, alteradorID);
  res.json({ message: 'EstadoTransporte ativada' });
});
export default router;