import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

import { BASE_URL } from '../../components/url';

const EncomendaView = () => {
  const { id } = useParams();
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
    axios.get(`${BASE_URL}/cliente-encomenda-produtos/encomenda/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar encomendas de utilizador:", err);
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

  const filteredData = data.filter((encomenda) =>
    encomenda.Produto?.toLowerCase().includes(search.toLowerCase()) ||
    encomenda.EstadoEncomenda?.toLowerCase().includes(search.toLowerCase())
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
        <h1>Encomendas {id}</h1>

        <div className="form-outline flex-grow-1 mx-3">
          <input type="search" className="form-control" placeholder="Pesquisa" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Link to="/encomendas" className="btn btn-outline-secondary">Voltar</Link>
      </div>
      <h1>

        <div className="d-flex flex-wrap gap-2">
          <h3> Estado: </h3>
          <button className={`btn btn-sm ${getEstadoColorClass(data[0].EstadoID)}`}> <strong>{data[0].EstadoEncomenda} </strong></button>
        </div>

      </h1>
      <hr />
      <div className="table-container">
        <table className="element table table-responsive table-hover table-striped">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Valor Unitario</th>
              <th>Valor IVA</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((encomenda) => (
              <tr key={encomenda.ID}>
                <td>{encomenda.Produto}</td>
                <td>{encomenda.quantidade || "--"} </td>
                <td>{encomenda.ValorUnitario || "--"}</td>
                <td>{encomenda.valorIVA}</td>
                <td>{encomenda.Total}</td>
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
        <br></br>


      </div>
    </>
  );
};

export default EncomendaView;
