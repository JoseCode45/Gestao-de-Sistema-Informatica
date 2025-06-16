import { Router } from 'express';

import { Transporte } from '../models/transporteModels.js';
import authenticateToken from '../services/authenticateToken.js';
import authorizeRole from '../services/authorizeRole.js';

const router = Router();
router.use(authenticateToken);

// Obter todas as transportes
router.get('/', async (req, res) => {
  const transportes = await Transporte.getAll();
  res.json(transportes);
});

// Obter Transporte por ID
router.get('/:id', async (req, res) => {
  const transportes = await Transporte.getById(req.params.id);  
  if (!transportes) return res.status(404).json({ error: 'Transporte não encontrada' });
  res.json(transportes);
});

// Adicionar Transporte
router.post('/', async (req, res) => {
  const criadorID = req.user.id;
  const { dataSaida, dataEntrega, custoTotal, clienteEncomendaID, fornecedorEncomendaID, transportadoraID } = req.body;
  
  const id = await Transporte.create(dataSaida, dataEntrega, custoTotal, clienteEncomendaID || null, fornecedorEncomendaID || null, transportadoraID, criadorID);
  res.status(201).json({ id });
});

// Atualizar Transporte
router.put('/:id', async (req, res) => {
  const alteradorID = req.user.id;
  const id = req.params.id;
  const {dataSaida, dataEntrega, custoTotal, clienteEncomendaID, fornecedorEncomendaID, transportadoraID, estadoID} = req.body;
  await Transporte.update(id, dataSaida, dataEntrega, custoTotal, clienteEncomendaID || null, fornecedorEncomendaID || null, transportadoraID, estadoID, alteradorID);
  res.json({ message: 'Transporte atualizado' });
});

// Desativar Transporte
router.delete('/:id', async (req, res) => {
  const alteradorID = req.user.id;
  await Transporte.remove(req.params.id, alteradorID);
  res.json({ message: 'Transporte desativada' });
});

// Ativar Transporte
router.patch('/:id', async (req, res) => {
  const alteradorID = req.user.id;
  await Transporte.ativar(req.params.id, alteradorID);
  res.json({ message: 'Transporte ativada' });
});


//#########################
// FORNECEDOR
//#########################

//Confirmar encomenda Fornecedor
router.patch('/fornecedor/:id', async (req, res) => {
  const alteradorID = req.user.id;
  await Transporte.confirmarFornecedor(req.params.id, alteradorID);
  res.json({ message: 'Encomenda Transporte Cancelada' });
});


//Cancelar Encomenda Fornecedor
router.patch('/fornecedor/cancelar/:id', async (req, res) => {
  const alteradorID = req.user.id;
  try {
    await Transporte.cancelarFornecedor(req.params.id, alteradorID);
    res.json({ message: 'Encomenda cancelada com sucesso!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//Colocar transporte para a próxima fase (Em trânsito e concluido)
router.patch('/fornecedor/step/:id', async (req, res) => {
  const alteradorID = req.user.id;
  try {
    await Transporte.proxfaseTransporte(req.params.id, alteradorID);
    res.json({ message: 'Encomenda cancelada com sucesso!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//#########################
// Cliente
//#########################

//Confirmar encomenda Cliente
router.patch('/cliente/:id', async (req, res) => {
  const alteradorID = req.user.id;
  await Transporte.confirmarCliente(req.params.id, alteradorID);
  res.json({ message: 'Encomenda cliente confirmada' });
});


//Cancelar Encomenda Cliente
router.patch('/cliente/cancelar/:id', async (req, res) => {
  const alteradorID = req.user.id;
  try {
    await Transporte.cancelarCliente(req.params.id, alteradorID);
    res.json({ message: 'Encomenda cancelada com sucesso!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//Colocar transporte para a próxima fase (Em trânsito e concluido)
router.patch('/cliente/step/:id', async (req, res) => {
  const alteradorID = req.user.id;
  try {
    await Transporte.proxfaseTransporteCliente(req.params.id, alteradorID);
    res.json({ message: 'Encomenda cancelada com sucesso!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;