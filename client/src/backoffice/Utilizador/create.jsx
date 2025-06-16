import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';

const UtilizadorCreate = () => {
  const token = localStorage.getItem('token');

  const [tipo, setTipo] = useState('cliente'); // 'cliente' ou 'empregado'

  // Dados para selects
  const [generos, setGeneros] = useState([]);
  const [nacionalidades, setNacionalidades] = useState([]);
  const [categoriasFunc, setCategoriasFunc] = useState([]);
  const navigate = useNavigate();

  const [formCliente, setFormCliente] = useState({
    nome: '',
    email: '',
    password: '',
    morada: '',
    genero: '',
    NIF: ''
  });

  const [formEmpregado, setFormEmpregado] = useState({
    nome: '',
    email: '',
    password: '',
    morada: '',
    genero: '',
    dataNascimento: '',
    nacionalidade: '',
    categoriaFunc: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Buscar dados para selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resGenero, resNacionalidade, resCategoriaFunc] = await Promise.all([
          axios.get(`${BASE_URL}/genero`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/nacionalidade`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/categoria-func`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setGeneros(resGenero.data);
        setNacionalidades(resNacionalidade.data);
        setCategoriasFunc(resCategoriaFunc.data);
      } catch (err) {
        console.error('Erro ao carregar dados para os selects:', err);
      }
    };
    fetchData();
  }, [token]);

  const handleChangeCliente = e => {
    const { name, value } = e.target;
    setFormCliente(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeEmpregado = e => {
    const { name, value } = e.target;
    setFormEmpregado(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tipo === 'cliente') {
        if (!formCliente.nome || !formCliente.email || !formCliente.password || !formCliente.NIF) {
          setError('Por favor preencha todos os campos obrigatórios do cliente.');
          setLoading(false);
          return;
        }

        // Enviar nome do género, mas backend deve resolver para ID (ou enviar só o nome se for assim)
        await axios.post(`${BASE_URL}/utilizador/registerCliente`, {
          nome: formCliente.nome,
          email: formCliente.email,
          password: formCliente.password,
          morada: formCliente.morada,
          generoID: formCliente.genero, // envio o nome, backend precisa aceitar ou traduzir para ID
          NIF: formCliente.NIF
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

      } else {
        if (!formEmpregado.nome || !formEmpregado.email || !formEmpregado.password || !formEmpregado.dataNascimento || !formEmpregado.nacionalidade || !formEmpregado.categoriaFunc) {
          setError('Por favor preencha todos os campos obrigatórios do empregado.');
          setLoading(false);
          return;
        }

        await axios.post(`${BASE_URL}/utilizador/registerEmpregado`, {
          nome: formEmpregado.nome,
          email: formEmpregado.email,
          password: formEmpregado.password,
          morada: formEmpregado.morada,
          generoID: formEmpregado.genero,
          dataNascimento: formEmpregado.dataNascimento,
          nacionalidadeID: formEmpregado.nacionalidade,
          categoriaFuncID: formEmpregado.categoriaFunc
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert(`${tipo === 'cliente' ? 'Cliente' : 'Empregado'} criado com sucesso!`);
      

      // Resetar formulários
      setFormCliente({ nome: '', email: '', password: '', morada: '', genero: '', NIF: '' });
      setFormEmpregado({ nome: '', email: '', password: '', morada: '', genero: '', dataNascimento: '', nacionalidade: '', categoriaFunc: '' });
      navigate('/admin/utilizador');

    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError('Erro ao criar utilizador.');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h1>Criar Novo {tipo === 'cliente' ? 'Cliente' : 'Empregado'}</h1>

      <div className="mb-3">
        <button
          className={`btn me-2 ${tipo === 'cliente' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTipo('cliente')}
          type="button"
        >
          Cliente
        </button>
        <button
          className={`btn ${tipo === 'empregado' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTipo('empregado')}
          type="button"
        >
          Empregado
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Nome *</label>
          <input
            type="text"
            name="nome"
            className="form-control"
            value={tipo === 'cliente' ? formCliente.nome : formEmpregado.nome}
            onChange={tipo === 'cliente' ? handleChangeCliente : handleChangeEmpregado}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={tipo === 'cliente' ? formCliente.email : formEmpregado.email}
            onChange={tipo === 'cliente' ? handleChangeCliente : handleChangeEmpregado}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password *</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={tipo === 'cliente' ? formCliente.password : formEmpregado.password}
            onChange={tipo === 'cliente' ? handleChangeCliente : handleChangeEmpregado}
            required
          />
        </div>

        <div className="mb-3">
          <label>Morada</label>
          <input
            type="text"
            name="morada"
            className="form-control"
            value={tipo === 'cliente' ? formCliente.morada : formEmpregado.morada}
            onChange={tipo === 'cliente' ? handleChangeCliente : handleChangeEmpregado}
          />
        </div>

        <div className="mb-3">
          <label>Género</label>
          <select
            name="genero"
            className="form-select"
            value={tipo === 'cliente' ? formCliente.genero : formEmpregado.genero}
            onChange={tipo === 'cliente' ? handleChangeCliente : handleChangeEmpregado}
          >
            <option value="">-- Selecionar Género --</option>
            {generos.map(g => (
              <option key={g.ID} value={g.ID}>{g.Nome}</option>
            ))}
          </select>
        </div>

        {tipo === 'cliente' && (
          <div className="mb-3">
            <label>NIF *</label>
            <input
              type="text"
              name="NIF"
              maxLength={9}
              className="form-control"
              value={formCliente.NIF}
              onChange={handleChangeCliente}
              required
            />
          </div>
        )}

        {tipo === 'empregado' && (
          <>
            <div className="mb-3">
              <label>Data de Nascimento *</label>
              <input
                type="date"
                name="dataNascimento"
                className="form-control"
                value={formEmpregado.dataNascimento}
                onChange={handleChangeEmpregado}
                required
              />
            </div>

            <div className="mb-3">
              <label>Nacionalidade</label>
              <select
                name="nacionalidade"
                className="form-select"
                value={formEmpregado.nacionalidade}
                onChange={handleChangeEmpregado}
                required
              >
                <option value="">-- Selecionar Nacionalidade --</option>
                {nacionalidades.map(n => (
                  <option key={n.ID} value={n.ID}>{n.Nome}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label>Categoria Funcional</label>
              <select
                name="categoriaFunc"
                className="form-select"
                value={formEmpregado.categoriaFunc}
                onChange={handleChangeEmpregado}
                required
              >
                <option value="">-- Selecionar Categoria --</option>
                {categoriasFunc.map(c => (
                  <option key={c.ID} value={c.ID}>{c.Nome}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'A enviar...' : 'Criar'}
        </button>
      </form>
    </div>
  );
};

export default UtilizadorCreate;
