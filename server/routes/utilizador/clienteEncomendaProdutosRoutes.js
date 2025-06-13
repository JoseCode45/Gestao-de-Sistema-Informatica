import { Router } from 'express';
const router = Router();
import { ClienteEncomendaProdutos } from '../../models/utilizador/ClienteEncomendaProdutosModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

//Obter Produtos por ID de Encomenda
router.get('/encomenda/:id', async (req, res) => {
  const encomendaID = req.params.id;
  const produtos = await ClienteEncomendaProdutos.getUserEncomenda(encomendaID);
  if (!produtos) return res.status(404).json({ error: 'ClienteEncomendaProdutos não encontrada' });
  res.json(produtos);
});


// Obter todas as ClienteEncomendaProdutoss
router.get('/', async (req, res) => {
  const ClienteEncomendaProdutoss = await ClienteEncomendaProdutos.getAll();
  res.json(ClienteEncomendaProdutoss);
});

// Obter ClienteEncomendaProdutos por ID
router.get('/:id', async (req, res) => {
  const ClienteEncomendaProdutos = await ClienteEncomendaProdutos.getById(req.params.id);
  if (!ClienteEncomendaProdutos) return res.status(404).json({ error: 'ClienteEncomendaProdutos não encontrada' });
  res.json(ClienteEncomendaProdutos);
});

// Adicionar ClienteEncomendaProdutos
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { nome } = req.body;
  const id = await ClienteEncomendaProdutos.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar ClienteEncomendaProdutos
router.put('/:id', async (req, res) => {
  alteradorID = req.user.id; 
  const {nome} = req.body;
  await ClienteEncomendaProdutos.update(req.params.id, nome, alteradorID);
  res.json({ message: 'ClienteEncomendaProdutos atualizada' });
});

// Desativar ClienteEncomendaProdutos
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await ClienteEncomendaProdutos.remove(req.params.id, alteradorID);
  res.json({ message: 'ClienteEncomendaProdutos desativada' });
});

// Ativar ClienteEncomendaProdutos
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await ClienteEncomendaProdutos.ativar(req.params.id, alteradorID);
  res.json({ message: 'ClienteEncomendaProdutos ativada' });
});
export default router;