import { Router } from 'express';
const router = Router();
import { EstadoOcorrencia } from '../../models/estados/EstadoOcorrenciaModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as EstadoOcorrencia
router.get('/', async (req, res) => {
  const result = await EstadoOcorrencia.getAll();
  res.json(result);
});

// Obter EstadoOcorrencia por ID
router.get('/:id', async (req, res) => {
  const result = await EstadoOcorrencia.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'EstadoOcorrencia não encontrada' });
  res.json(result);
});

// Adicionar EstadoOcorrencia
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await EstadoOcorrencia.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar EstadoOcorrencia
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await EstadoOcorrencia.update(req.params.id, nome, alteradorID);
  res.json({ message: 'EstadoOcorrencia atualizada' });
});

// Desativar EstadoOcorrencia
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoOcorrencia.remove(req.params.id, alteradorID);
  res.json({ message: 'EstadoOcorrencia desativada' });
});

// Ativar EstadoOcorrencia
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoOcorrencia.ativar(req.params.id, alteradorID);
  res.json({ message: 'EstadoOcorrencia ativada' });
});
export default router;