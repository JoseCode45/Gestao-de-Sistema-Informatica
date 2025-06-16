import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { BASE_URL } from '../../components/url';

const Transporte = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const alteradorID = decodedToken.id;
  const itemsPerPage = 20;

  useEffect(() => {
    axios.get(`${BASE_URL}/transporte`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar distritos:", err);
        setError("Erro ao carregar distritos.");
        setLoading(false);
      });
  }, []);


  const filteredData = data.filter((transporte) =>
    transporte.CustoTotal?.toLowerCase().includes(search.toLowerCase()) ||
    transporte.CriadorNome?.toLowerCase().includes(search.toLowerCase()) ||
    transporte.AlteradorNome?.toLowerCase().includes(search.toLowerCase()) ||
    transporte.ID.toString().includes(search)
  );

    const getEstadoColorClass = (estadoId) => {
    switch (estadoId) {
      case 1:
        return 'btn-warning';      // Iniciando
      case 2:
        return 'btn-primary';      // Em Trânsito
      case 3:
        return 'btn-success';         // Concluido
      case 4:
        return 'btn-dark';    // Cancelado
      default:
        return 'btn-dark';         
    }
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <p>A carregar distritos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="fixd d-flex justify-content-between align-items-center mb-3">
        <h1>Transportes</h1>
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
      <div className="table-container">
        <table className="element table table-responsive table-hover table-striped">
          <thead>
            <tr>
              <th><strong>ID</strong></th>
              <th>Data de Saída</th>
              <th>Data de Entrega</th>
              <th>Custo Total</th>
              <th>Encomenda</th>
              <th>Transportadora</th>
              <th>Criador</th>
              <th>Alterador</th>
              <th>Data Criação</th>
              <th>Última Alteração</th>
              <th>Estado</th>
              <th><Link to={`/admin/transporte/criar`} className='btn btn-outline-dark w-40 rounded-0'>NOVO</Link></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((transporte) => (
              <tr key={transporte.ID}>
                <td><strong>{transporte.ID}</strong></td>
                <td>{new Date(transporte.DataSaida).toLocaleString()}</td>
                <td>{transporte.DataEntrega ? new Date(transporte.DataEntrega).toLocaleString() : "--"}</td>
                <td>{transporte.CustoTotal}</td>
                <td>{transporte.ClienteEncomendaID} {transporte.FornecedorEncomendaID} <strong>{transporte.FornecedorEncomendaID? 'Fornecedor' : 'Cliente'}</strong></td>
                <td>{transporte.Transportadora}</td>
                <td>{transporte.CriadorID} {transporte.CriadorNome || "N/A"}</td>
                <td>{transporte.AlteradorID} {transporte.AlteradorNome || "N/A"}</td>
                <td>{new Date(transporte.DataCriacao).toLocaleString()}</td>
                <td>{new Date(transporte.DataAlteracao).toLocaleString()}</td>
                <td className="text-center align-middle">
                  <button
                    className={`btn btn-sm ${getEstadoColorClass(transporte.EstadoID)}`}
                    style={{ width: '90px' }}
                  >
                    {transporte.EstadoTransporte}
                  </button>
                </td>
                <td className="text-center align-middle">
                  <Link to={`/admin/transporte/edit/${transporte.ID}`} className='btn btn-outline-dark w-40 rounded-0'>EDIT</Link>
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

export default Transporte;
