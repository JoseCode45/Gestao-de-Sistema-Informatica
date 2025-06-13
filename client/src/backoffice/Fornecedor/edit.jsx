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

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';

const PromocaoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dataInicio: '',
    dataValidade: '',
    descontoTipo: 'percentual',
    valor: '',
    motivo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const alteradorID = decodedToken.id;

  useEffect(() => {
    const fetchPromocao = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/promocao/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const formatDateTimeLocal = (dt) => {
          if (!dt) return '';
          const d = new Date(dt);
          const pad = (n) => n.toString().padStart(2, '0');
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        setForm({
          dataInicio: formatDateTimeLocal(res.data.DataInicio),
          dataValidade: formatDateTimeLocal(res.data.DataValidade),
          descontoTipo: res.data.DescontoTipo || 'percentual',
          valor: res.data.Valor?.toString() || '', // Corrigido para usar "Valor" com maiúscula
          motivo: res.data.Motivo || ''
        });

        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar promoção:', err);
        alert('Erro ao carregar promoção.');
        setLoading(false);
      }
    };

    fetchPromocao();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${BASE_URL}/promocao/${id}`, {
        dataInicio: form.dataInicio ? new Date(form.dataInicio).toISOString().slice(0, 19).replace('T', ' ') : null,
        dataValidade: form.dataValidade ? new Date(form.dataValidade).toISOString().slice(0, 19).replace('T', ' ') : null,
        descontoTipo: form.descontoTipo,
        descontoValor: Number(form.valor),
        motivo: form.motivo,
        alteradorID
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/admin/promocoes');
    } catch (err) {
      console.error('Erro ao atualizar promoção:', err);
      alert('Erro ao atualizar promoção.');
      setSaving(false);
    }
  };

  if (loading) return <p>A carregar promoção...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Editar Promoção</h1>
        <Link to="/admin/promocoes" className="btn btn-outline-secondary">Voltar</Link>
      </div>

      <hr />

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Data Início</label>
          <input
            type="datetime-local"
            name="dataInicio"
            className="form-control"
            value={form.dataInicio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Data Validade</label>
          <input
            type="datetime-local"
            name="dataValidade"
            className="form-control"
            value={form.dataValidade}
            onChange={handleChange}
          />
          <small className="form-text text-muted">Pode ficar vazio para validade indefinida.</small>
        </div>

        <div className="mb-3">
          <label>Tipo de Desconto</label>
          <select
            name="descontoTipo"
            className="form-select"
            value={form.descontoTipo}
            onChange={handleChange}
            required
          >
            <option value="percentual">Percentual (%)</option>
            <option value="fixo">Fixo (valor absoluto)</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Valor</label>
          <input
            type="number"
            name="valor"
            className="form-control"
            value={form.valor}
            onChange={handleChange}
            min={0}
            required
          />
        </div>

        <div className="mb-3">
          <label>Motivo</label>
          <input
            type="text"
            name="motivo"
            className="form-control"
            maxLength={64}
            value={form.motivo}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'A salvar...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default PromocaoEdit;
