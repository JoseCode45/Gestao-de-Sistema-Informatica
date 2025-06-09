import { Router } from 'express';
const router = Router();
import { FornecedorEncomenda } from '../../models/fornecedor/FornecedorEncomendaModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as FornecedorEncomenda
router.get('/', async (req, res) => {
  const result = await FornecedorEncomenda.getAll();
  res.json(result);
});

// Obter FornecedorEncomenda por ID
router.get('/:id', async (req, res) => {
  const result = await FornecedorEncomenda.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'FornecedorEncomenda não encontrada' });
  res.json(result);
});

// Adicionar FornecedorEncomenda
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await FornecedorEncomenda.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar FornecedorEncomenda
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await FornecedorEncomenda.update(req.params.id, nome, alteradorID);
  res.json({ message: 'FornecedorEncomenda atualizada' });
});

// Desativar FornecedorEncomenda
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await FornecedorEncomenda.remove(req.params.id, alteradorID);
  res.json({ message: 'FornecedorEncomenda desativada' });
});

// Ativar FornecedorEncomenda
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await FornecedorEncomenda.ativar(req.params.id, alteradorID);
  res.json({ message: 'FornecedorEncomenda ativada' });
});
export default router;