import { Router } from 'express';
const router = Router();
import { Transportadora } from '../models/transportadoraModels.js';
import authenticateToken from '../services/authenticateToken.js';
import authorizeRole from '../services/authorizeRole.js';
import validarNIF from '../services/validarNIF.js';

router.use(authenticateToken);

// Obter todas as transportadoras
router.get('/', async (req, res) => {
  const transportadoras = await Transportadora.getAll();
  res.json(transportadoras);
});

// Obter Transportadora por ID
router.get('/:id', async (req, res) => {
  const transportadoras = await Transportadora.getById(req.params.id);
  res.json(transportadoras);
});


router.post('/', async (req, res) => {
  const criadorID = req.user.id;
  const { nome, morada, NIF, responsavel } = req.body;

  if (!validarNIF(NIF)) {
    return res.status(400).json({ error: 'NIF inválido.' });
  }

  try {
    const id = await Transportadora.create(nome, morada, NIF, responsavel, criadorID);
    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar transportadora.' });
  }
});

// PUT /transportatora /:id/distritos, Substituir todos os distritos da transportadora pelos distritos selecionados.
router.put('/:id/distritos', async (req, res) => {
  const transportadoraID = Number(req.params.id);
  const alteradorID = req.user.id;
  const { distritos } = req.body;

  if (!Array.isArray(distritos)) {
    return res.status(400).json({ message: 'Campo "distritos" deve ser um array de IDs.' });
  }

  try {
    // 1. Desassociar distritos atuais do transportadora
    const distritosAtuais = await Transportadora.listarTransportadoraDistrito(transportadoraID);
    for (const distrito of distritosAtuais) {
      await Transportadora.desassociarTransportadoraDistrito(transportadoraID, distrito.ID);
    }

    // 2. Associar novos distritos
    for (const distritoID of distritos) {
      const result = await Transportadora.associarTransportadoraDistrito(transportadoraID, distritoID);
      if (!result.success) {
        return res.status(400).json({ message: `Erro ao associar distrito ID ${distritoID}: ${result.message}` });
      }
    }

    // 3. Atualizar alterador e data
    await Transportadora.atualizarAlterador(transportadoraID, alteradorID);

    res.json({ message: 'distritos associados ao transportadora com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar distritos do transportadora:', err);
    res.status(500).json({ message: 'Erro interno ao atualizar distritos.' });
  }
});

//Obter lista de distritos de um transportadora
router.get('/:id/distritos', async (req, res) => {
  const fornecedorID = req.params.id;

  try {
    const distritos = await Transportadora.listar(fornecedorID);
    res.json(distritos);
  } catch (err) {
    console.error('Erro ao buscar distritos do transportadora:', err);
    res.status(500).json({ message: 'Erro interno ao buscar distritos do transportadora.' });
  }
});

// Adicionar Transportadora
router.post('/', async (req, res) => {
  const criadorID = req.user.id;
  const { nome, morada, NIF, responsavel } = req.body;

  const id = await Transportadora.create(nome, criadorID);
  res.status(201).json({ id });
});

// Atualizar Transportadora
router.put('/:id', async (req, res) => {
  const alteradorID = req.user.id; 
  const {nome, NIF, morada, responsavel} = req.body;
  await Transportadora.update(req.params.id, nome, NIF, morada, responsavel, alteradorID)
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