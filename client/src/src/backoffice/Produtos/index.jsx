import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { BASE_URL } from '../../components/url';

const Produtos = () => {
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
    axios.get(`${BASE_URL}/produto`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar produtos:", err);
        setError("Erro ao carregar produtos.");
        setLoading(false);
      });
  }, []);

  const toggleEstado = async (id, currentEstado) => {
    const novoEstado = currentEstado === 'ativo' ? 'inativo' : 'ativo';

    try {
      if (novoEstado === 'inativo') {
        await axios.delete(`${BASE_URL}/produto/${id}`, {
          data: { alteradorID },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.patch(`${BASE_URL}/produto/${id}`, { alteradorID }, {
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

  const filteredData = data.filter((produto) =>
    produto.Nome?.toLowerCase().includes(search.toLowerCase()) ||
    produto.RegiaoNome?.toLowerCase().includes(search.toLowerCase()) ||
    produto.Preco?.toString().includes(search) ||
    produto.CriadorNome?.toLowerCase().includes(search.toLowerCase()) ||
    produto.AlteradorNome?.toLowerCase().includes(search.toLowerCase()) ||
    produto.ID.toString().includes(search)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <p>A carregar produtos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="fixd d-flex justify-content-between align-items-center mb-3">
        <h1>Produtos</h1>
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
        <table className="element table table-responsive table-hover table-striped" style={{ tableLayout: 'auto'}}>
          <thead>
            <tr>
              <th><strong>ID</strong></th>
              <th>Nome</th>
              <th>Preco</th>
              <th>Região</th>
              <th style={{width: '100px' }}>Castas</th>
              <th>Quantidade</th>
              <th>Últ. Entrada</th>
              <th>Últ. Saída</th>
              <th>Local Armazém</th>
              <th>Criado por</th>
              <th>Alterado por</th>
              <th>Data Criação</th>
              <th>Última Alteração</th>
              <th style={{width: '100px' }}>Estado</th>
              <th> <Link to="/admin/produto/criar" className='btn btn-outline-primary button-sucess w-40 rounded-0'>NOVO</Link></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((produto) => (
              <tr key={produto.ID}>
                <td><strong>{produto.ID}</strong></td>
                <td>{produto.Nome}</td>
                <td>{produto.Preco} €</td>
                <td>{produto.RegiaoNome || 'N/A'}</td>
                <td style={{ fontSize: '0.75rem' }}>{produto.Castas ? produto.Castas : 'N/A'}</td>
                <td>{produto.Quantidade ?? '0'}</td>
                <td>{produto.UltimaEntrada ? new Date(produto.UltimaEntrada).toLocaleString() : 'N/A'}</td>
                <td>{produto.UltimaSaida ? new Date(produto.UltimaSaida).toLocaleString() : 'N/A'}</td>
                <td>{produto.Armazem || 'N/A'}</td>
                <td>{produto.CriadorNome || "N/A"}</td>
                <td>{produto.AlteradorNome || "N/A"}</td>
                <td>{new Date(produto.DataCriacao).toLocaleString()}</td>
                <td>{new Date(produto.DataAlteracao).toLocaleString()}</td>
                <td className="text-center align-middle">
                  <button
                    className={`btn btn-sm ${produto.Estado === 'ativo' ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => toggleEstado(produto.ID, produto.Estado)}
                    style={{ width: '90px' }}
                  >
                    {produto.Estado}
                  </button>
                </td>
                <td className="text-center align-middle">
                  <Link to={`/admin/produto/edit/${produto.ID}`} className='btn btn-outline-dark w-40 rounded-0'>
                    EDIT
                  </Link>
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

export default Produtos;
