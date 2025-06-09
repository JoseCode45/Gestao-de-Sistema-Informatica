import { Router } from 'express';
const router = Router();
import { Armazem } from '../models/ArmazemModels.js';
import authenticateToken from '../services/authenticateToken.js';
import authorizeRole from '../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as armazens
router.get('/', async (req, res) => {
  const armazens = await Armazem.getAll();
  res.json(armazens);
});

// Obter Armazem por ID
router.get('/:id', async (req, res) => {
  const result = await Armazem.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'Armazem não encontrada' });
  res.json(result);
});

// Adicionar Armazem
router.post('/', async (req, res) => {

  const criadorID = req.user.id;
  const {Morada, AreaM2} = req.body;
    if (AreaM2 < 0) {
  return res.status(400).json({ message: "Área deve ser zero ou maior." });
  }
  const id = await Armazem.create(Morada, AreaM2, criadorID);
  res.status(201).json({ id });
});

// Atualizar Armazem
router.put('/:id', async (req, res) => {

  const alteradorID = req.user.id; 
  const {Morada, AreaM2} = req.body;
    if (AreaM2 < 0) {
  return res.status(400).json({ message: "Área deve ser zero ou maior." });
}
  await Armazem.update(req.params.id, Morada, AreaM2, alteradorID);
  res.json({ message: 'Armazem atualizada' });
});

// Desativar Armazem
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Armazem.remove(req.params.id, alteradorID);
  res.json({ message: 'Armazem desativada' });
});

// Ativar Armazem
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Armazem.ativar(req.params.id, alteradorID);
  res.json({ message: 'Armazem ativada' });
});
export default router;