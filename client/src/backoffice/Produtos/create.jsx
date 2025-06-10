// src/pages/ProdutoCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';
import { Link } from 'react-router-dom';

const ProdutoCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    preco: '',
    regiaoID: ''
  });
  const [regioes, setRegioes] = useState([]);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const criadorID = decodedToken.id;

  useEffect(() => {
    axios.get(`${BASE_URL}/regiao`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setRegioes(response.data))
    .catch(err => console.error("Erro ao carregar regiões", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/produto`, { ...form, criadorID }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin/produto');
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      alert("Erro ao criar produto.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Novo Produto</h1>
        <Link to="/admin/produto" className="btn btn-outline-secondary">Voltar</Link>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nome</label>
          <input
            type="text"
            className="form-control"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            maxLength={16}
          />
        </div>
        <div className="mb-3">
          <label>Preço</label>
          <input
            type="number"
            className="form-control"
            name="preco"
            min="0"
            step="any"
            value={form.preco}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Região</label>
          <select
            className="form-select"
            name="regiaoID"
            value={form.regiaoID}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma região</option>
            {regioes.map(regiao => (
              <option key={regiao.ID} value={regiao.ID}>{regiao.Nome}</option>
            ))}
          </select>
        </div>
        <hr />
        <button type="submit" className="btn btn-primary">Criar Produto</button>
      </form>
    </div>
  );
};

export default ProdutoCreate;
