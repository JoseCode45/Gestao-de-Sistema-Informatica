import { Router } from 'express';
const router = Router();
import { Ocorrencia } from '../models/OcorrenciaModels.js';
import authenticateToken from '../services/authenticateToken.js';
import authorizeRole from '../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as ocorrencia
router.get('/', async (req, res) => {
  const ocorrencia = await Ocorrencia.getAll();
  res.json(ocorrencia);
});

// Obter Ocorrencia por ID
router.get('/:id', async (req, res) => {
  const Ocorrencias = await Ocorrencia.getById(req.params.id);
  if (!Ocorrencias) return res.status(404).json({ error: 'Ocorrencia não encontrada' });
  res.json(Ocorrencias);
});

// Resolver Ocorrencia por ID
router.post('/:id/resolver', authorizeRole('Técnico/a Marketing e Comunicação'), async (req, res) => {
  const utilizador = req.user.id;
  const Ocorrencias = await Ocorrencia.resolver(req.params.id, utilizador);
  if (!Ocorrencias) return res.status(404).json({ error: 'Ocorrencia não encontrada' });
  res.json(Ocorrencias);
});

// Adicionar Ocorrencia
router.post('/', async (req, res) => {
  const registouID = req.user.id;
  const {motivo, descricao} = req.body;
  if(!motivo || !descricao){
    return res.status(404).json({ error: 'Ocorrencia inválida' });
  }
  const id = await Ocorrencia.create(motivo, descricao, registouID);
  res.status(201).json({ id });
});

// Atualizar Ocorrencia
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {dataResolucao, motivo, descricao, resolveuID, estadoID} = req.body;
  await Ocorrencia.update(req.params.id, dataResolucao, motivo, descricao, resolveuID, estadoID, alteradorID);
  res.json({ message: 'Ocorrencia atualizada' });
});

// Desativar Ocorrencia
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Ocorrencia.remove(req.params.id, alteradorID);
  res.json({ message: 'Ocorrencia desativada' });
});

// Ativar Ocorrencia
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Ocorrencia.ativar(req.params.id, alteradorID);
  res.json({ message: 'Ocorrencia ativada' });
});
export default router;