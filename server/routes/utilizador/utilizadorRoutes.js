import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { Utilizador } from '../../models/utilizador/utilizadorModels.js';
import bcrypt from 'bcrypt';
import authenticateToken from '../../services/authenticateToken.js';
import authorizeRole from '../../services/authorizeRole.js';
import validarNIF from '../../services/validarNIF.js';
import { validarDadosCliente } from '../../services/validarDadosCliente.js';
import { validarAtualizacaoCliente } from '../../services/validarAtualizacaoCliente.js';

const router = Router();

// Obter todos os utilizadores
router.get('/', async (req, res) => {
  const utilizadores = await Utilizador.getAll();
  res.json(utilizadores);
});

router.get('/:id', async (req, res) => {
  const utilizadores = await Utilizador.findById(req.params.id);
  res.json(utilizadores);
});


// Obter utilizador por ID
router.get('/perfil', authenticateToken, async (req, res) => {
  const user = await Utilizador.findById(req.user.id);
  res.json({ user });
});

// Criar um novo utilizador (cliente)
router.post('/registerCliente', async (req, res) => {
  const { nome, email, password, morada, generoID, NIF } = req.body;

  const erros = await validarDadosCliente({ nome, email, password, NIF });
  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  const existing = await Utilizador.findByEmail(email);
  if (existing) return res.status(400).json({ error: 'Email já registado' });

  const passwordHash = await bcrypt.hash(password, 10);
  const id = await Utilizador.createCliente(nome, email, passwordHash, morada, generoID, NIF);

  res.status(201).json({ id });
});

// Criar um novo utilizador (empregado)
router.post('/registerEmpregado', async (req, res) => {
  const { nome, email, password, morada, generoID, dataNascimento, nacionalidadeID, categoriaFuncID } = req.body;

  const erros = await validarDadosCliente({ nome, email, password});
  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  if (!email.match(/[A-Za-z0-9\.]+@[\w.]+\.[A-Za-z0-9\.]?/)) {
    return res.status(400).json({ error: 'Email inválido' });
  }


  const existing = await Utilizador.findByEmail(email);
  if (existing) return res.status(400).json({ error: 'Email já registado' });

  const passwordHash = await bcrypt.hash(password, 10);
  const id = await Utilizador.createEmpregado(nome, email, passwordHash, morada, generoID, dataNascimento, nacionalidadeID, categoriaFuncID);

  res.status(201).json({ id });
});

// Atualizar utilizador (cliente)
router.put('/cliente', async (req, res) => {
  const { ID, nome, email, NIF, morada, generoID} = req.body;
 //const userID = req.user.id || req.body;
 
  const erros = await validarAtualizacaoCliente({ nome, email, NIF });
  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  const existing = await Utilizador.findByEmail(email);
  if (existing && existing.ID !== ID) return res.status(400).json({ error: 'Email já registado' });

  await Utilizador.updateCliente(ID, nome, email, morada, generoID, NIF);
  res.json({ message: 'Utilizador atualizado com sucesso' });
});

// Atualizar utilizador (empregado)
router.put('/empregado', async (req, res) => {
  const { ID, nome, email, morada, generoID, dataNascimento, NacionalidadeID, categoriaFuncID } = req.body;
  //const userID = req.user.id;

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  if (!email.match(/[A-Za-z0-9\.]+@[\w.]+\.[A-Za-z0-9\.]?/)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  await Utilizador.updateEmpregado(ID, nome, email, morada, generoID, dataNascimento, NacionalidadeID, categoriaFuncID);
  res.json({ message: 'Utilizador atualizado com sucesso' });
});

// Login de utilizador
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Utilizador.findByEmail(email);


  if (!user) return res.status(400).json({ error: 'Credenciais inválidas' });

  const match = await bcrypt.compare(password, user.Password);
  if (!match) return res.status(400).json({ error: 'Credenciais inválidas' });

  const cargo = await Utilizador.getCargo(user.ID);

  const token = jwt.sign(
    { id: user.ID, email: user.Email, cargo },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

// Obter
router.get('/clientes', async (req, res) => {
  const clients = await Utilizador.getAllCliente(); // adaptar filtro para clientes
  res.json(clients);
});

// GET /utilizador/employees - só empregados podem acessar
router.get('/employees', async (req, res) => {
  const employees = await Utilizador.getAllEmpregado(); // adaptar filtro para empregados
  res.json(employees);
});

// GET /utilizador/admin - só administradores podem acessar
router.get('/admin', authenticateToken, authorizeRole('Gestor de compras', 'admin'), (req, res) => {
  res.json({ message: 'Bem-vindo, administrador!' });
});

//Validar NIF
router.post('/validarNIF', async (req, res) => {
  const { NIF } = req.body;
  if (!NIF) {
    return res.status(400).json({ error: 'NIF é obrigatório' });
  }

  const isValid = validarNIF(NIF);
  if (isValid) {
    res.json({ message: 'NIF válido' });
  } else {
    res.status(400).json({ error: 'NIF inválido' });
  }
});

export default router;
