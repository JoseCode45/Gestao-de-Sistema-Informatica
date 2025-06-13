import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import { BASE_URL } from '../../components/url';

const Ocorrencia = () => {
  const [data, setData] = useState([]);
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
    axios.get(`${BASE_URL}/ocorrencia/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar ocorrências:", err);
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

  const filteredData = data.filter((oc) =>
    oc.Motivo?.toLowerCase().includes(search.toLowerCase()) ||
    oc.Descricao?.toLowerCase().includes(search.toLowerCase()) ||
    oc.RegistouNome?.toLowerCase().includes(search.toLowerCase()) ||
    oc.ResolveuNome?.toLowerCase().includes(search.toLowerCase()) ||
    oc.ID.toString().includes(search)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <p>A carregar dados...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <br></br>
      <div className="fixd d-flex justify-content-between align-items-center mb-3">
        <h1>Ocorrências</h1>
        <div className="form-outline flex-grow-1 mx-3">
          <input type="search" className="form-control" placeholder="Pesquisa" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Link to="/" className="btn btn-outline-secondary">Voltar</Link>
      </div>
      <hr />
      <div className="table-container">
        <table className="element table table-responsive table-hover table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data Registo</th>
              <th>Data Resolução</th>
              <th>Motivo</th>
              <th>Descrição</th>
              <th>Registou</th>
              <th>Resolveu</th>
              <th>Solucao</th>
              <th>Estado</th>
              <th><Link to={`/ocorrencia/criar`} className='btn btn-danger w-40 rounded-0'>NOVA OCORRENCIA</Link></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((oc) => (
              <tr key={oc.ID}>
                <td>{oc.ID}</td>
                <td>{new Date(oc.DataRegisto).toLocaleString()}</td>
                <td>{oc.DataResolucao ? new Date(oc.DataResolucao).toLocaleString() : '---'}</td>
                <td>{oc.Motivo}</td>
                <td>{oc.Descricao}</td>
                <td>{oc.RegistouID} {oc.NomeRegistou || "N/A"}</td>
                <td>{oc.ResolveuID ? `${oc.ResolveuID} ${oc.NomeResolveu || "N/A"}` : '---'}</td>
                <td>{oc.Solucao}</td>
                <td className="text-center align-middle">
                  <button
                    className={`btn btn-sm ${getEstadoColorClass(oc.EstadoID)}`}
                    style={{ width: '90px' }}
                  >
                    {oc.EstadoOcorrencia}
                  </button>
                </td>
                <td className="text-center align-middle">
                  <button
                    className='btn btn-outline-dark rounded-0'
                    onClick={async () => {
                      navigate(`/ocorrencia/view/${oc.ID}`);
                    }}
                  >
                    Visualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr />
      <div className="d-flex justify-content-end align-items-center mt-3">
        <button
          className="btn btn-outline-primary mx-1"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn mx-1 ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-primary mx-1"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Ocorrencia;
