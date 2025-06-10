import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';

const DescontoCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    dataInicio: '',
    dataValidade: '',
    descontoTipo: 'percentual', // padrão
    descontoValor: '',
    motivo: ''
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
    console.log(form);
    e.preventDefault();
    setLoading(true);

    // Validação simples local antes de enviar
    if (new Date(form.dataInicio) >= new Date(form.dataValidade)) {
      alert('Data de início deve ser anterior à data de validade.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/promocao`, {
        dataInicio: form.dataInicio ? new Date(form.dataInicio).toISOString().slice(0, 19).replace('T', ' ') : null,
        dataValidade: form.dataValidade ? new Date(form.dataValidade).toISOString().slice(0, 19).replace('T', ' ') : null,
        descontoTipo: form.descontoTipo,
        descontoValor: form.descontoValor,
        motivo: form.motivo,
        criadorID
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin/promocoes');
    } catch (err) {
      console.error('Erro ao criar desconto:', err);
      alert('Erro ao criar desconto.');
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Novo Desconto</h1>
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
          <label>Valor do Desconto</label>
          <input
            type="number"
            name="descontoValor"
            className="form-control"
            value={form.descontoValor}
            onChange={handleChange}
            min={0}
            step="0.01"
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

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'A criar...' : 'Criar Desconto'}
        </button>
      </form>
    </div>
  );
};

export default DescontoCreate;
