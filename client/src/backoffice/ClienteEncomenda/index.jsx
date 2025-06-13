import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { BASE_URL } from '../../components/url';

const ClienteEncomenda = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get(`${BASE_URL}/cliente-encomenda`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados.");
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter((item) =>
    item.ID.toString().includes(search) ||
    item.ClienteNome?.toLowerCase().includes(search.toLowerCase()) ||
    item.EstadoNome?.toLowerCase().includes(search.toLowerCase()) ||
    item.CriadorNome?.toLowerCase().includes(search.toLowerCase()) ||
    item.AlteradorNome?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <p>A carregar dados...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="fixd d-flex justify-content-between align-items-center mb-3">
        <h1>Encomendas de Clientes</h1>
        <div className="form-outline flex-grow-1 mx-3">
          <input
            type="search"
            className="form-control"
            placeholder="Pesquisa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link to="/admin" className="btn btn-outline-secondary">Voltar</Link>
      </div>
      <hr />
      <div className="cliente-encomenda-table table-container">
        <table className="element table table-responsive table-hover table-striped">
          <thead>
            <tr>
              <th><strong>ID</strong></th>
              <th>Cliente</th>
              <th>Data Envio</th>
              <th>Data Entrega</th>
              <th>Total Encomenda</th>
              <th>Total Produto</th>
              <th>Total Transporte</th>
              <th>Total Impostos</th>
              <th>Estado</th>
              <th>Criado por</th>
              <th>Alterado por</th>
              <th>Data Criação</th>
              <th>Última Alteração</th>
              <th><Link to={`/admin/clienteencomenda/criar`} className='btn btn-outline-dark w-40 rounded-0'>NOVO</Link></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.ID}>
                <td><strong>{item.ID}</strong></td>
                <td>{item.ClienteNome || 'N/A'}</td>
                <td>{new Date(item.DataEnvio).toLocaleString()}</td>
                <td>{item.DataEntrega ? new Date(item.DataEntrega).toLocaleString() : '—'}</td>
                <td>{item.TotalEncomenda} €</td>
                <td>{item.TotalProduto} €</td>
                <td>{item.TotalTransporte} €</td>
                <td>{item.TotalImpostos} €</td>
                <td>{item.EstadoNome || 'N/A'}</td>
                <td>{item.CriadorNome || 'N/A'}</td>
                <td>{item.AlteradorNome || 'N/A'}</td>
                <td>{new Date(item.DataCriacao).toLocaleString()}</td>
                <td>{new Date(item.DataAlteracao).toLocaleString()}</td>
                <td className="text-center align-middle">
                  <Link to={`/admin/clienteencomenda/edit/${item.ID}`} className='btn btn-outline-dark w-40 rounded-0'>EDIT</Link>
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

export default ClienteEncomenda;
