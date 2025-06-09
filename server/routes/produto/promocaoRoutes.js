import { Router } from 'express';
const router = Router();
import { Promocao } from '../../models/produto/PromocaoModels.js';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';

router.use(authenticateToken);

// Obter todas as promocoes
router.get('/', async (req, res) => {
  const result = await Promocao.getAll();
  res.json(result);
});

//Criar promoção
router.post('/', authorizeRole('Técnico/a Marketing e Comunicação'), async (req, res) => {
  try{
    const {dataInicio, dataValidade, descontoTipo, valor, motivo, estadoID} = req.body;
    const criadorID = req.user.id;

    // Validação de datas
    if (new Date(dataInicio) >= new Date(dataValidade)) {
      return res.status(400).json({ erro: 'Data de início deve ser anterior à data de validade.' });
    }

    const promocaoID = await Promocao.create(
      dataInicio, dataValidade, descontoTipo, valor, motivo, estadoID, criadorID
    );

    //
    res.status(201).json({ mensagem: 'Promoção criada e aplicada com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar a promoção.' });
  }
});

//Associar produtos a promoção .

// Obter Promocao por ID
router.get('/:id', async (req, res) => {
  const result = await Promocao.getById(req.params.id);
  if (!result) return res.status(404).json({ error: 'Promocao não encontrada' });
  res.json(result);
});

// Adicionar Promocao
router.post('/', async (req, res) => {
  criadorID = req.user.id;
  const { dataInicio, dataValidade, descontoTipo, descontoValor, motivo } = req.body;

      if (new Date(dataInicio) >= new Date(dataValidade)) {
      return res.status(400).json({ erro: 'Data de início deve ser anterior à data de validade.' });
    }

  const result = await Promocao.create(dataInicio, dataValidade, descontoTipo, descontoValor, motivo, criadorID);
  res.status(201).json({ result });
});

// Atualizar Promocao
router.put('/:id', authorizeRole('Técnico/a Marketing e Comunicação'), async (req, res) => {
  alteradorID = req.user.id; 
  const {dataInicio, dataValidade, descontoTipo, descontoValor, motivo} = req.body;

      // Validação de datas
    if (new Date(dataInicio) >= new Date(dataValidade)) {
      return res.status(400).json({ erro: 'Data de início deve ser anterior à data de validade.' });
    }

  await Promocao.update(req.params.id, dataInicio, dataValidade, descontoTipo, descontoValor, motivo, alteradorID);
  res.json({ message: 'Promocao atualizada' });
});

// Desativar Promocao
router.delete('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Promocao.remove(req.params.id, alteradorID);
  res.json({ message: 'Promocao desativada' });
});

// Ativar Promocao
router.patch('/:id', async (req, res) => {
  const { alteradorID } = req.body;
  await Promocao.ativar(req.params.id, alteradorID);
  res.json({ message: 'Promocao ativada' });
});
export default router;