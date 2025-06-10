import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { BASE_URL } from '../../components/url';

const Promocao = () => {
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
    axios.get(`${BASE_URL}/promocao`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar promoções:", err);
        setError("Erro ao carregar promoções.");
        setLoading(false);
      });
  }, []);

  const toggleEstado = async (id, currentEstado) => {
    const novoEstado = currentEstado === 'ativo' ? 'inativo' : 'ativo';

    try {
      if (novoEstado === 'inativo') {
        await axios.delete(`${BASE_URL}/promocao/${id}`, {
          data: { alteradorID },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.patch(`${BASE_URL}/promocao/${id}`, { alteradorID }, {
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

  const filteredData = data.filter((promo) =>
    promo.Motivo?.toLowerCase().includes(search.toLowerCase()) ||
    promo.DescontoTipo?.toLowerCase().includes(search.toLowerCase()) ||
    promo.descontoValor?.toString().includes(search) ||
    promo.CriadorNome?.toLowerCase().includes(search.toLowerCase()) ||
    promo.AlteradorNome?.toLowerCase().includes(search.toLowerCase()) ||
    promo.ID.toString().includes(search)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) return <p>A carregar promoções...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="fixd d-flex justify-content-between align-items-center mb-3">
        <h1>Promoções</h1>
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
              <th>Data Início</th>
              <th>Data Validade</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Motivo</th>
              <th style={{width: '100px' }}>Produtos</th>
              <th>Criado por</th>
              <th>Alterado por</th>
              <th>Data Criação</th>
              <th>Última Alteração</th>
              <th>Estado</th>
              <th><Link to={`/admin/promocoes/criar`} className='btn btn-outline-dark w-40 rounded-0'>NOVO</Link></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((promo) => (
              <tr key={promo.ID}>
                <td><strong>{promo.ID}</strong></td>
                <td>{new Date(promo.DataInicio).toLocaleString()}</td>
                <td>{promo.DataValidade ? new Date(promo.DataValidade).toLocaleString() : '—'}</td>
                <td>{promo.DescontoTipo}</td>
                <td>{promo.DescontoTipo === 'percentual' ? `${promo.DescontoValor}%` : `-${Number(promo.DescontoValor).toFixed(2)}€`}</td>
                <td>{promo.Motivo}</td>
                <td style={{ fontSize: '0.75rem' }}>{promo.Produtos ? promo.Produtos : 'N/A'}</td>
                <td>{promo.CriadorNome || "N/A"}</td>
                <td>{promo.AlteradorNome || "N/A"}</td>
                <td>{new Date(promo.DataCriacao).toLocaleString()}</td>
                <td>{new Date(promo.DataAlteracao).toLocaleString()}</td>
                <td className="text-center align-middle">
                  <button
                    className={`btn btn-sm ${promo.Estado === 'Ativa' ? 'btn-success' : 'btn-danger'}`}
                    style={{ width: '90px' }}
                  >
                    {promo.Estado}
                  </button>
                </td>
                <td className="text-center align-middle">
                  <Link to={`/admin/promocoes/edit/${promo.ID}`} className='btn btn-outline-dark w-40 rounded-0'>EDIT</Link>
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

export default Promocao;
