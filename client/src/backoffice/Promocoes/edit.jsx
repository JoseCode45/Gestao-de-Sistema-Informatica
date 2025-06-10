import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import FornecedorProduto from '../../components/fornecedorProduto';
import { BASE_URL } from '../../components/url';

const PromocaoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dataInicio: '',
    dataValidade: '',
    descontoValor: '',
    descontoTipo: '',
    motivo: '',
    estadoID: ''
  });

  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [produtosAssociados, setProdutosAssociados] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const alteradorID = decodedToken.id;

  // Helper: format ISO string to "yyyy-MM-ddTHH:mm" local datetime string for input[type=datetime-local]
  const toDateTimeLocal = (isoString)=> {
    if (!isoString) return '';
    const date = new Date(isoString);

    const pad = (n) => n.toString().padStart(2, '0');

    // Use local time parts
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promocaoRes, estadosRes, produtosRes, produtosAssociadosRes] = await Promise.all([
          axios.get(`${BASE_URL}/promocao/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/estado-promocao`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/produto/lista`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/promocao/${id}/produtos`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setForm({
          dataInicio: toDateTimeLocal(promocaoRes.data.DataInicio),
          dataValidade: toDateTimeLocal(promocaoRes.data.DataValidade),
          descontoValor: promocaoRes.data.DescontoValor || '',
          descontoTipo: promocaoRes.data.DescontoTipo || '',
          motivo: promocaoRes.data.Motivo || '',
          estadoID: promocaoRes.data.EstadoID || ''
        });

        setEstados(estadosRes.data);
        setProdutosDisponiveis(produtosRes.data.map(p => ({ ...p, ID: Number(p.ID) })));
        setProdutosAssociados(produtosAssociadosRes.data.map(p => ({ ...p, ID: Number(p.ID) })));

        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados da promoção:', error);
        alert('Erro ao carregar dados da promoção.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Optionally: convert datetime-local string back to ISO string with timezone here if needed

      await axios.put(`${BASE_URL}/promocao/${id}`, { ...form, alteradorID }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await axios.put(`${BASE_URL}/promocao/${id}/produtos`, {
        produtos: produtosAssociados.map(p => p.ID)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/admin/promocoes');
    } catch (error) {
      console.error('Erro ao atualizar promoção:', error);
      alert('Erro ao atualizar promoção.');
      setSaving(false);
    }
  };

  if (loading) return <p>A carregar dados da promoção...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Editar Promoção</h1>
        <Link to="/admin/promocoes" className="btn btn-outline-secondary">Voltar</Link>
      </div>

      <hr />

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Data de Início</label>
          <input
            type="datetime-local"
            className="form-control"
            name="dataInicio"
            value={form.dataInicio}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Data de Validade</label>
          <input
            type="datetime-local"
            className="form-control"
            name="dataValidade"
            value={form.dataValidade}
            onChange={handleChange}
          />
          <small className="form-text text-muted">Pode ficar vazio para validade indefinida.</small>
        </div>

        <div className="mb-3">
          <label>Desconto (valor ou percentagem)</label>
          <input
            type="number"
            className="form-control"
            name="descontoValor"
            value={form.descontoValor}
            onChange={handleChange}
            step="any"
            required
          />
        </div>

        <div className="mb-3">
          <label>Tipo de Desconto</label>
          <select
            className="form-select"
            name="descontoTipo"
            value={form.descontoTipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o tipo</option>
            <option value="percentual">Percentual (%)</option>
            <option value="fixo">Fixo (valor absoluto)</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Motivo</label>
          <textarea
            className="form-control"
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            rows="2"
            maxLength={255}
            required
          />
        </div>

        <div className="mb-3">
          <label>Estado</label>
          <select
            className="form-select"
            name="estadoID"
            value={form.estadoID}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o estado</option>
            {estados.map(e => (
              <option key={e.ID} value={e.ID}>{e.Nome}</option>
            ))}
          </select>
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

export default PromocaoEdit;
