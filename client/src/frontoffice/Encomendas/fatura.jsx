import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import { BASE_URL } from '../../components/url';

const FaturaView = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const alteradorID = decodedToken.id;
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get(`${BASE_URL}/cliente-fatura/encomenda/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar faturas de utilizador:", err);
        setError("Erro ao carregar dados.");
        setLoading(false);
      });
  }, []);

  const getEstadoColorClass = (estadoId) => {
    switch (estadoId) {
      case 1:
        return 'btn-warning';      // Pendente
      case 2:
        return 'btn-primary';      // Em Análise
      case 3:
        return 'btn-info';         // Em reposição
      case 4:
        return 'btn-secondary';    // Crédito Emitido
      case 5:
        return 'btn-success';      // Resolvido
      default:
        return 'btn-dark';         // Cancelado
    }
  };


  const pagarFatura = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const alteradorID = decodedToken.id;

      await axios.patch(`${BASE_URL}/cliente-fatura/pagar/${id}`,
        { alteradorID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Fatura paga com sucesso!');
      navigate('/encomendas/');
      // Atualizar a lista, se necessário
    } catch (error) {
      console.error('Erro ao pagar fatura:', error);
      const errorMsg = error.response?.data?.message || 'Erro ao pagar fatura.';
      alert(errorMsg);
    }
  };

  if (loading) return <p>A carregar dados...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <br></br>
      <div className="fixd d-flex justify-content-between align-items-center mb-3">
        <h1>Fatura id {id}</h1>


        <Link to="/encomendas" className="btn btn-outline-secondary">Voltar</Link>
      </div>
      <h1>

        <div className="d-flex flex-wrap gap-2">
          <h3> Estado: </h3>
          <button className={`btn btn-sm ${getEstadoColorClass(data.EstadoID)}`}> <strong>{data.EstadoFatura} </strong></button>
        </div>

      </h1>
      <hr />
      <div className="table-container">
        <table className="element table table-responsive table-hover table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data Emissão</th>
              <th>Data Validade</th>
              <th>Data Pagamento</th>
              <th>ID Encomenda</th>
              <th>Total Faturado</th>
              <th>Total IVA</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><bold>{data.ID}</bold></td>
              <td>{data.DataEmissao ? new Date(data.DataEmissao).toLocaleString() : "--"}</td>
              <td>{data.DataValidade ? new Date(data.DataValidade).toLocaleString() : "--"}</td>
              <td>{data.DataPagamento ? new Date(data.DataPagamento).toLocaleString() : "--"}</td>
              <td>{data.EncomendaID}</td>
              <td>{data.TotalFaturado} €</td>
              <td>{data.TotalIVA} €</td>
              <td><button className={`btn btn-sm ${getEstadoColorClass(data.EstadoID)}`}> <strong>{data.EstadoFatura} </strong></button></td>
              <td className="text-center align-middle">
                    <button onClick={() => pagarFatura(data.ID)} className='btn btn-primary w-40 rounded-0' disabled={data.EstadoID === 3 || data.EstadoID === 4}>PAGAR</button>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />
      <div className="d-flex justify-content-end align-items-center mt-3">

        <br></br>


      </div>
    </>
  );
};

export default FaturaView;
