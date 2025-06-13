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
  const { alteradorID } = req.body;
  await Transporte.remove(req.params.id, alteradorID);
  res.json({ message: 'Transporte desativada' });
});

// Ativar Transporte
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Transporte.ativar(req.params.id, alteradorID);
  res.json({ message: 'Transporte ativada' });
});
export default router;