
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';

const TransportadoraCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    NIF: '',
    morada: '',
    responsavel: ''
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const criadorID = decodedToken.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/transportadora`, { ...form, criadorID }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin/transportadora');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar transportadora.';
      alert(errorMessage)
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Nova Transportadora</h1>
        <Link to="/admin/transportadora" className="btn btn-outline-secondary">Voltar</Link>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            className="form-control"
            value={form.nome}
            onChange={handleChange}
            placeholder='Nome da transportadora'
            maxLength={32}
            minLength={3}
            required
          />
        </div>
        <div className="mb-3">
          <label>NIF</label>
          <input
            type="text"
            name="NIF"
            className="form-control"
            value={form.NIF}
            onChange={handleChange}
            placeholder='NIF da transportadora'
            minLength={9}
            maxLength={9}
            required
          />
        </div>
        <div className="mb-3">
          <label>Morada</label>
          <input
            type="text"
            name="morada"
            className="form-control"
            placeholder='Morada da transportadora'
            value={form.morada}
            onChange={handleChange}
            minLength={6}
            maxLength={100}
            required
          />
        </div>
        <div className="mb-3">
          <label>Responsável</label>
          <input
            type="text"
            name="responsavel"
            className="form-control"
            placeholder='Responsável da transportadora'
            value={form.responsavel}
            minLength={3}
            onChange={handleChange}
            maxLength={32}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'A criar...' : 'Criar Transportadora'}
        </button>
      </form>
    </div>
  );
};

export default TransportadoraCreate;
