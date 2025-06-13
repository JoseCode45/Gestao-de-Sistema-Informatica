import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import TransportadoraDistrito from '../../components/transportadoraDistrito';
import { BASE_URL } from '../../components/url';

const TransportadoraEdit = () => {
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
  const [distritosAssociados, setDistritosAssociados] = useState([]);
  const [distritosDisponiveis, setDistritosDisponiveis] = useState([]);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const alteradorID = decodedToken.id;

  useEffect(() => {
    const fetchFornecedor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/transportadora/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const distritosRes = await axios.get(`${BASE_URL}/distritos`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const distritosAssociadosRes = await axios.get(`${BASE_URL}/transportadora/${id}/distritos`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDistritosDisponiveis(distritosRes.data.map(p => ({ ...p, ID: Number(p.ID) })));
        setDistritosAssociados(distritosAssociadosRes.data.map(p => ({ ...p, ID: Number(p.ID) })));

        setForm({
          nome: res.data.Nome || '',
          NIF: res.data.NIF || '',
          morada: res.data.Morada || '',
          responsavel: res.data.Responsavel || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar transportadora:', err);
        alert('Erro ao carregar transportadora.');
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
      await axios.put(`${BASE_URL}/transportadora/${id}`, { ...form, alteradorID }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await axios.put(`${BASE_URL}/transportadora/${id}/distritos`, {
        distritos: distritosAssociados.map(p => p.ID)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/admin/transportadora');
    } catch (err) {
      console.error('Erro ao atualizar transportadora:', err);
      alert('Erro ao atualizar transportadora.');
      setSaving(false);
    }
  };

  if (loading) return <p>A carregar transportadora...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Editar Transportadora</h1>
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
            minLength={3}
            maxLength={32}
            placeholder='Nome'
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
            minLength={9}
            placeholder='NIF'
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
            minLength={6}
            maxLength={100}
            placeholder='Morada'
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
            minLength={3}
            maxLength={32}
            placeholder='Responsável'
            required
          />
        </div>

        <TransportadoraDistrito
          associadas={distritosAssociados}
          setAssociadas={setDistritosAssociados}
          disponiveis={distritosDisponiveis}
        />

        <hr />

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'A salvar...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default TransportadoraEdit;
