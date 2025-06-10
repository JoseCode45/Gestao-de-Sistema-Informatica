import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';

const FornecedorCreate = () => {
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
      await axios.post(`${BASE_URL}/fornecedor`, { ...form, criadorID }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin/fornecedor');
    } catch (err) {
      console.error('Erro ao criar fornecedor:', err);
      alert('Erro ao criar fornecedor.');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Novo Fornecedor</h1>
        <Link to="/admin/fornecedor" className="btn btn-outline-secondary">Voltar</Link>
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
            maxLength={100}
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
            value={form.morada}
            onChange={handleChange}
            maxLength={150}
            required
          />
        </div>
        <div className="mb-3">
          <label>Responsável</label>
          <input
            type="text"
            name="responsavel"
            className="form-control"
            value={form.responsavel}
            onChange={handleChange}
            maxLength={100}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'A criar...' : 'Criar Fornecedor'}
        </button>
      </form>
    </div>
  );
};

export default FornecedorCreate;
