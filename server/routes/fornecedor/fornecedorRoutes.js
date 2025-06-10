import { Router } from 'express';
const router = Router();
import { Fornecedor } from '../../models/fornecedor/FornecedorModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';
import validarNIF from '../../services/validarNIF.js'

router.use(authenticateToken);

// Obter todas as Fornecedor
router.get('/', async (req, res) => {
  const result = await Fornecedor.getAll();
  res.json(result);
});

// Obter Fornecedor por ID
router.get('/:id', async (req, res) => {
  const result = await Fornecedor.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'Fornecedor não encontrada' });
  res.json(result);
});

// Adicionar Fornecedor
router.post('/', async (req, res) => {
  const criadorID = req.user.id;
  const { nome, morada, NIF, responsavel } = req.body;

  if (!validarNIF(NIF)) {
    return res.status(400).json({ error: 'NIF inválido.' });
  }

  try {
    const id = await Fornecedor.create(nome, morada, NIF, responsavel, criadorID);
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar fornecedor.' });
  }
});


// Atualizar Fornecedor
router.put('/:id', async (req, res) => {
  const alteradorID = req.user.id;
  const { nome, morada, NIF, responsavel } = req.body;

    if (!validarNIF(NIF)) {
    return res.status(400).json({ error: 'NIF inválido.' });
  }

  try{
  await Fornecedor.update(req.params.id, nome, morada, NIF, responsavel, alteradorID);
  res.json({ message: 'Fornecedor atualizada' });
  }catch(error){
    console.error(error);
    res.status(500).json({ error: 'Erro ao editar fornecedor.' });  
  }
});

// PUT /fornecedor/:id/produtos, Substituir todos os produtos do fornecedor pelos produtos selecionados.
router.put('/:id/produtos', async (req, res) => {
  const fornecedorID = Number(req.params.id);
  const alteradorID = req.user.id;
  const { produtos } = req.body;

  if (!Array.isArray(produtos)) {
    return res.status(400).json({ message: 'Campo "produtos" deve ser um array de IDs.' });
  }

  try {
    // 1. Desassociar produtos atuais do fornecedor
    const produtosAtuais = await Fornecedor.listarProdutosFornecedor(fornecedorID);
    for (const produto of produtosAtuais) {
      await Fornecedor.desassociarProdutoFornecedor(fornecedorID, produto.ID);
    }

    // 2. Associar novos produtos
    for (const produtoID of produtos) {
      const result = await Fornecedor.associarProdutoFornecedor(fornecedorID, produtoID);
      if (!result.success) {
        return res.status(400).json({ message: `Erro ao associar produto ID ${produtoID}: ${result.message}` });
      }
    }

    // 3. Atualizar alterador e data
    await Fornecedor.atualizarAlterador(fornecedorID, alteradorID);

    res.json({ message: 'Produtos associados ao fornecedor com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar produtos do fornecedor:', err);
    res.status(500).json({ message: 'Erro interno ao atualizar produtos.' });
  }
});

//Obter lista de produtos de um fornecedor
router.get('/:id/produtos', async (req, res) => {
  const fornecedorID = req.params.id;

  try {
    const produtos = await Fornecedor.listar(fornecedorID);
    res.json(produtos);
  } catch (err) {
    console.error('Erro ao buscar produtos do fornecedor:', err);
    res.status(500).json({ message: 'Erro interno ao buscar produtos do fornecedor.' });
  }
});

// Desativar Fornecedor
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Fornecedor.remove(req.params.id, alteradorID);
  res.json({ message: 'Fornecedor desativada' });
});

// Ativar Fornecedor
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Fornecedor.ativar(req.params.id, alteradorID);
  res.json({ message: 'Fornecedor ativada' });
});
export default router;  