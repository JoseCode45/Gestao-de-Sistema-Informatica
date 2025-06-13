import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';

const OcorrenciaView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ocorrencia, setOcorrencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solucao, setSolucao] = useState('');

  const token = localStorage.getItem('token');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/ocorrencia/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOcorrencia(res.data);
        setSolucao(res.data.Solucao || '');
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar a ocorrência:", error);
        alert("Erro ao carregar a ocorrência.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleResolver = async () => {
    if (!solucao.trim()) {
      alert("A solução não pode estar vazia.");
      return;
    }
    try {
      await axios.patch(`${BASE_URL}/ocorrencia/${id}/resolver`, {
        solucao: solucao,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/admin/ocorrencia');
    } catch (error) {
      console.error("Erro ao resolver ocorrência:", error);
      alert("Erro ao resolver ocorrência.");
    }
  };

  const handleCancelar = async () => {
    if (!solucao.trim()) {
      alert("A solução não pode estar vazia.");
      return;
    }
    try {
      await axios.patch(`${BASE_URL}/ocorrencia/${id}/cancelar`, {
        solucao: solucao,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/admin/ocorrencia');
    } catch (error) {
      console.error("Erro ao cancelar ocorrência:", error);
      alert("Erro ao cancelar ocorrência.");
    }
  };

  const handleReposicao = async () => {
    if (!solucao.trim()) {
      alert("A solução não pode estar vazia.");
      return;
    }
    try {
      await axios.patch(`${BASE_URL}/ocorrencia/${id}/reposicao`, {
        solucao: solucao,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/admin/ocorrencia');
    } catch (error) {
      console.error("Erro ao processar reposição:", error);
      alert("Erro ao processar reposição.");
    }
  };

  const handleCredito = async () => {
    if (!solucao.trim()) {
      alert("A solução não pode estar vazia.");
      return;
    }
    try {
      await axios.patch(`${BASE_URL}/ocorrencia/${id}/credito`, {
        solucao: solucao,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/admin/ocorrencia');
    } catch (error) {
      console.error("Erro ao processar crédito:", error);
      alert("Erro ao processar crédito.");
    }
  };



  if (loading) return <p>A carregar ocorrência...</p>;
  if (!ocorrencia) return <p>Ocorrência não encontrada.</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Visualizar Ocorrência</h1>
        <Link to="/admin/ocorrencia" className="btn btn-outline-secondary">Voltar</Link>
      </div>
      <hr />
      <div className="mb-3">
        <strong>ID:</strong> {ocorrencia.ID}
      </div>
      <div className="mb-3">
        <strong>Data de Registo:</strong> {new Date(ocorrencia.DataRegisto).toLocaleString()}
      </div>
      <div className="mb-3">
        <strong>Data de Resolução:</strong> {ocorrencia.DataResolucao ? new Date(ocorrencia.DataResolucao).toLocaleString() : 'Pendente'}
      </div>
      <div className="mb-3">
        <strong>Motivo:</strong> {ocorrencia.Motivo || "N/A"}
      </div>
      <div className="mb-3">
        <strong>Descrição:</strong> {ocorrencia.Descricao || "N/A"}
      </div>
      <div className="mb-3">
        <strong>Registado por:</strong> {ocorrencia.NomeRegistou || "N/A"}
      </div>
      <div className="mb-3">
        <strong>Resolvido por:</strong> {ocorrencia.NomeResolveu || 'Pendente'}
      </div>
      <div className="mb-3">
        <strong>Estado:</strong> {ocorrencia.EstadoOcorrencia}
      </div>
      <div className="mb-3">
        <label><strong>Solução:</strong></label>
        <textarea
          className="form-control"
          rows="4"
          value={solucao}
          onChange={(e) => setSolucao(e.target.value)}
          disabled={ocorrencia.EstadoID > 4}
        ></textarea>
      </div>
      <hr />
      <button
        className="btn btn-success"
        onClick={handleResolver}
        disabled={ocorrencia.EstadoID === 5 || ocorrencia.EstadoID === 6}
      >
        Resolver
      </button>
      <button
        className="btn btn-danger"
        onClick={handleCancelar}
        disabled={ocorrencia.EstadoID === 5 || ocorrencia.EstadoID === 6}
      >
        Cancelar
      </button>
      <button
        className="btn btn-primary"
        onClick={handleReposicao}
        disabled={ocorrencia.EstadoID === 5 || ocorrencia.EstadoID === 6}
      >
        Reposição
      </button>
      <button
        className="btn btn-warning"
        onClick={handleCredito}
        disabled={ocorrencia.EstadoID === 5 || ocorrencia.EstadoID === 6}
      >
        Crédito
      </button>
    </div>
  );
};

export default OcorrenciaView;
