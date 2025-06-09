import { Router } from 'express';
const router = Router();
import { EstadoEncomenda } from '../../models/estados/EstadoEncomendaModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';



// Obter todas as EstadoEncomenda
router.get('/', async (req, res) => {
  const result = await EstadoEncomenda.getAll();
  res.json(result);
});

// Obter EstadoEncomenda por ID
router.get('/:id', async (req, res) => {
  const result = await EstadoEncomenda.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'EstadoEncomenda não encontrada' });
  res.json(result);
});

// Adicionar EstadoEncomenda
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await EstadoEncomenda.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar EstadoEncomenda
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await EstadoEncomenda.update(req.params.id, nome, alteradorID);
  res.json({ message: 'EstadoEncomenda atualizada' });
});

// Desativar EstadoEncomenda
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoEncomenda.remove(req.params.id, alteradorID);
  res.json({ message: 'EstadoEncomenda desativada' });
});

// Ativar EstadoEncomenda
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await EstadoEncomenda.ativar(req.params.id, alteradorID);
  res.json({ message: 'EstadoEncomenda ativada' });
});
export default router;