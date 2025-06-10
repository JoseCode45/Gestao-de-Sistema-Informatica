import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import FornecedorProduto from '../../components/fornecedorProduto';
import { BASE_URL } from '../../components/url';

const FornecedorEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    NIF: '',
    morada: '',
    responsavel: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [produtosAssociados, setProdutosAssociados] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const alteradorID = decodedToken.id;

  useEffect(() => {
    const fetchFornecedor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/fornecedor/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const produtosRes = await axios.get(`${BASE_URL}/produto/lista`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const produtosAssociadosRes = await axios.get(`${BASE_URL}/fornecedor/${id}/produtos`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProdutosDisponiveis(produtosRes.data.map(p => ({ ...p, ID: Number(p.ID) })));
setProdutosAssociados(produtosAssociadosRes.data.map(p => ({ ...p, ID: Number(p.ID) })));

        setForm({
          nome: res.data.Nome || '',
          NIF: res.data.NIF || '',
          morada: res.data.Morada || '',
          responsavel: res.data.Responsavel || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar fornecedor:', err);
        alert('Erro ao carregar fornecedor.');
        setLoading(false);
      }
    };

    fetchFornecedor();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${BASE_URL}/fornecedor/${id}`, { ...form, alteradorID }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await axios.put(`${BASE_URL}/fornecedor/${id}/produtos`, {
        produtos: produtosAssociados.map(p => p.ID)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin/fornecedor');
    } catch (err) {
      console.error('Erro ao atualizar fornecedor:', err);
      alert('Erro ao atualizar fornecedor.');
      setSaving(false);
    }
  };

  if (loading) return <p>A carregar fornecedor...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Editar Fornecedor</h1>
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
            maxLength={20}
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

        <FornecedorProduto
          associadas={produtosAssociados}
          setAssociadas={setProdutosAssociados}
          disponiveis={produtosDisponiveis}
        />

        <hr />

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'A salvar...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default FornecedorEdit;
