import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { BASE_URL } from '../../components/url';

const Fornecedor = () => {
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
    axios.get(`${BASE_URL}/fornecedor`, {
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

  const toggleEstado = async (id, currentEstado) => {
    const novoEstado = currentEstado === 'ativo' ? 'inativo' : 'ativo';

    try {
      if (novoEstado === 'inativo') {
        await axios.delete(`${BASE_URL}/fornecedor/${id}`, {
          data: { alteradorID },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.patch(`${BASE_URL}/fornecedor/${id}`, { alteradorID }, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const filteredData = data.filter((fornecedor) =>
    fornecedor.Nome?.toLowerCase().includes(search.toLowerCase()) ||
    fornecedor.Morada?.toLowerCase().includes(search.toLowerCase()) ||
    fornecedor.NIF?.includes(search) ||
    fornecedor.Responsavel?.toLowerCase().includes(search.toLowerCase()) ||
    fornecedor.CriadorNome?.toLowerCase().includes(search.toLowerCase()) ||
    fornecedor.AlteradorNome?.toLowerCase().includes(search.toLowerCase()) ||
    fornecedor.ID.toString().includes(search)
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
        <h1>Fornecedor</h1>
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
              <th>ID</th>
              <th>Nome</th>
              <th>Morada</th>
              <th>NIF</th>
              <th>Responsável</th>
              <th style={{width: '100px' }}>Produtos</th>
              <th>Criado por</th>
              <th>Alterado por</th>
              <th>Data Criação</th>
              <th>Última Alteração</th>
              <th>Estado</th>
              <th><Link to={`/admin/fornecedor/criar`} className='btn btn-outline-dark w-40 rounded-0'>NOVO</Link></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((fornecedor) => (
              <tr key={fornecedor.ID}>
                <td>{fornecedor.ID}</td>
                <td>{fornecedor.Nome}</td>
                <td>{fornecedor.Morada}</td>
                <td>{fornecedor.NIF}</td>
                <td>{fornecedor.Responsavel}</td>
                <td style={{ fontSize: '0.75rem' }}>{fornecedor.Produtos ? fornecedor.Produtos : 'N/A'}</td>
                <td>{fornecedor.CriadorNome || "N/A"}</td>
                <td>{fornecedor.AlteradorNome || "N/A"}</td>
                <td>{new Date(fornecedor.DataCriacao).toLocaleString()}</td>
                <td>{new Date(fornecedor.DataAlteracao).toLocaleString()}</td>
                <td className="text-center align-middle">
                  <button
                    className={`btn btn-sm ${fornecedor.Estado === 'ativo' ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => toggleEstado(fornecedor.ID, fornecedor.Estado)}
                    style={{ width: '90px' }}
                  >
                    {fornecedor.Estado}
                  </button>
                </td>
                <td className="text-center align-middle">
                  <Link to={`/admin/fornecedor/edit/${fornecedor.ID}`} className='btn btn-outline-dark w-40 rounded-0'>EDIT</Link>
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

export default Fornecedor;
