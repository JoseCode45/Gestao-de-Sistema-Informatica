import { Router } from 'express';
const router = Router();
import { FornecedorEncomendaProdutos } from '../../models/fornecedor/FornecedorEncomendaProdutosModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

//Obter Produtos por ID de Encomenda
router.get('/encomenda/:id', async (req, res) => {
  const encomendaID = req.params.id;
  const produtos = await FornecedorEncomendaProdutos.getUserEncomenda(encomendaID);
  if (!produtos) return res.status(404).json({ error: 'FornecedorEncomendaProdutos não encontrada' });
  res.json(produtos);
});


// Obter todas as FornecedorEncomendaProdutoss
router.get('/', async (req, res) => {
  const result = await FornecedorEncomendaProdutos.getAll();
  res.json(result);
});

// Obter FornecedorEncomendaProdutos por ID
router.get('/:id', async (req, res) => {
  const result = await FornecedorEncomendaProdutos.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'FornecedorEncomendaProdutos não encontrada' });
  res.json(result);
});

// Adicionar FornecedorEncomendaProdutos
router.post('/', async (req, res) => {
  const criadorID = req.user.id;
  const { nome } = req.body;
  const id = await FornecedorEncomendaProdutos.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar FornecedorEncomendaProdutos
router.put('/:id', async (req, res) => {
  const alteradorID = req.user.id; 
  const {nome} = req.body;
  await FornecedorEncomendaProdutos.update(req.params.id, nome, alteradorID);
  res.json({ message: 'FornecedorEncomendaProdutos atualizada' });
});

// Desativar FornecedorEncomendaProdutos
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await FornecedorEncomendaProdutos.remove(req.params.id, alteradorID);
  res.json({ message: 'FornecedorEncomendaProdutos desativada' });
});

// Ativar FornecedorEncomendaProdutos
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await FornecedorEncomendaProdutos.ativar(req.params.id, alteradorID);
  res.json({ message: 'FornecedorEncomendaProdutos ativada' });
});
export default router;