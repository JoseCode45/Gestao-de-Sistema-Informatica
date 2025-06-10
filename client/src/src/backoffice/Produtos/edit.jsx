import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProdutoCastas from '../../components/produtosCastas';
import { BASE_URL } from '../../components/url';

const ProdutoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    preco: '',
    regiaoID: ''
  });
  const [regioes, setRegioes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [associadas, setAssociadas] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const alteradorID = decodedToken.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const produtoRes = await axios.get(`${BASE_URL}/produto/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const regioesRes = await axios.get(`${BASE_URL}/regiao`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const castasAssociadasRes = await axios.get(`${BASE_URL}/produto/${id}/castas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const todasCastasRes = await axios.get(`${BASE_URL}/casta`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setForm({
          nome: produtoRes.data.Nome || '',
          preco: produtoRes.data.Preco || '',
          regiaoID: produtoRes.data.RegiaoID || ''
        });
        setRegioes(regioesRes.data);
        setAssociadas(castasAssociadasRes.data);
        setDisponiveis(todasCastasRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar dados.");
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

    try {
      // Atualiza o produto
      await axios.put(`${BASE_URL}/produto/${id}`, { ...form, alteradorID }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Atualiza as castas associadas (enviar IDs em array)
      await axios.put(`${BASE_URL}/produto/${id}/castas`, {
        castas: associadas.map(c => c.ID)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/admin/produto');
    } catch (err) {
      console.error("Erro ao atualizar produto e castas:", err);
      alert("Erro ao atualizar produto e castas.");
    }
  };

  if (loading) return <p>A carregar...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Editar Produto</h1>
        <Link to="/admin/produto" className="btn btn-outline-secondary">Voltar</Link>
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>nome</label>
          <input
            type="text"
            className="form-control"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            maxLength={32}
          />
        </div>
        <div className="mb-3">
          <label>preco</label>
          <input
            type="number"
            className="form-control"
            name="preco"
            value={form.preco}
            onChange={handleChange}
            min="0"
            step="any"
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
            <option value="">Selecione a região</option>
            {regioes.map(r => (
              <option key={r.ID} value={r.ID}>{r.Nome}</option>
            ))}
          </select>
        </div>

        <ProdutoCastas
          associadas={associadas}
          setAssociadas={setAssociadas}
          disponiveis={disponiveis}
        />

        <hr />
        <button type="submit" className="btn btn-primary">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default ProdutoEdit;
