import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { BASE_URL } from '../../components/url';

const Transportadora = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const alteradorID = decodedToken.id;
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get(`${BASE_URL}/transportadora`, {
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

  const toggleEstado = async (id, currentEstado) => {
    const novoEstado = currentEstado === 'ativo' ? 'inativo' : 'ativo';

    try {
      if (novoEstado === 'inativo') {
        await axios.delete(`${BASE_URL}/transportadora/${id}`, {
          data: { alteradorID },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        await axios.patch(`${BASE_URL}/transportadora/${id}`, { alteradorID }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      setData(prevData =>
        prevData.map(item =>
          item.ID === id ? { ...item, Estado: novoEstado } : item
        )
      );
    } catch (err) {
      console.error("Erro ao alterar estado:", err);
      alert("Erro ao alterar estado.");
    }
  };

  const filteredData = data.filter((transportadora) =>
    transportadora.Motivo?.toLowerCase().includes(search.toLowerCase()) ||
    transportadora.DescontoTipo?.toLowerCase().includes(search.toLowerCase()) ||
    transportadora.descontoValor?.toString().includes(search) ||
    transportadora.CriadorNome?.toLowerCase().includes(search.toLowerCase()) ||
    transportadora.AlteradorNome?.toLowerCase().includes(search.toLowerCase()) ||
    transportadora.ID.toString().includes(search)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <p>A carregar distritos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="fixd d-flex justify-content-between align-items-center mb-3">
        <h1>Transportadoras</h1>
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
              <th>Nome</th>
              <th>NIF</th>
              <th>Morada</th>
              <th>Responsavel</th>
              <th style={{width: '100px' }}>Distritos</th>
              <th>Criador</th>
              <th>Alterador</th>
              <th>Data Criação</th>
              <th>Última Alteração</th>
              <th>Estado</th>
              <th><Link to={`/admin/transportadora/criar`} className='btn btn-outline-dark w-40 rounded-0'>NOVO</Link></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((transportadora) => (
              <tr key={transportadora.ID}>
                <td><strong>{transportadora.ID}</strong></td>
                <td>{transportadora.Nome}</td>
                <td>{transportadora.NIF}</td>
                <td>{transportadora.Morada}</td>
                <td>{transportadora.Responsavel}</td>
                <td style={{ fontSize: '0.75rem' }}>{transportadora.Distritos ? transportadora.Distritos : 'N/A'}</td>
                <td>{transportadora.CriadorID} {transportadora.CriadorNome || "N/A"}</td>
                <td>{transportadora.AlteradorID} {transportadora.AlteradorNome || "N/A"}</td>
                <td>{new Date(transportadora.DataCriacao).toLocaleString()}</td>
                <td>{new Date(transportadora.DataAlteracao).toLocaleString()}</td>
                <td className="text-center align-middle">
                  <button
                    className={`btn btn-sm ${transportadora.Estado === 'ativo' ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => toggleEstado(transportadora.ID, transportadora.Estado)}
                    style={{ width: '90px' }}
                  >
                    {transportadora.Estado}
                  </button>
                </td>
                <td className="text-center align-middle">
                  <Link to={`/admin/transportadora/edit/${transportadora.ID}`} className='btn btn-outline-dark w-40 rounded-0'>EDIT</Link>
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

export default Transportadora;
