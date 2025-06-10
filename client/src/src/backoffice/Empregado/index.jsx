import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { BASE_URL } from '../../components/url';

const Empregado = () => {
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
    axios.get(`${BASE_URL}/empregado`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
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

  if (loading) return <p>A carregar dados...</p>;
  if (error) return <p>{error}</p>;

  const toggleEstado = async (id, currentEstado) => {
    const novoEstado = currentEstado === 'ativo' ? 'inativo' : 'ativo';

    try {
      if (novoEstado === 'inativo') {
        await axios.delete(`${BASE_URL}/empregado/${id}`, {
          data: { alteradorID },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        await axios.patch(`${BASE_URL}/empregado/${id}`, { alteradorID }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      setData(prevData =>
        prevData.map(item =>
          item.EmpregadoID === id ? { ...item, Estado: novoEstado } : item
        )
      );
    } catch (err) {
      console.error("Erro ao alterar estado:", err);
      alert("Erro ao alterar estado.");
    }
  };

  const filteredData = data.filter((empregado) =>
    empregado.Nome?.toLowerCase().includes(search.toLowerCase()) ||
    empregado.Email?.toLowerCase().includes(search.toLowerCase()) ||
    empregado.Morada?.toLowerCase().includes(search.toLowerCase()) ||
    empregado.CriadorNome?.toLowerCase().includes(search.toLowerCase()) ||
    empregado.AlteradorNome?.toLowerCase().includes(search.toLowerCase()) ||
    empregado.EmpregadoID.toString().includes(search)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <div className="fixd d-flex justify-content-between align-items-center mb-3">
        <h1>Empregado</h1>
        <div className="form-outline flex-grow-1 mx-3">
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="Pesquisa"
            aria-label="Search"
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
              <th>Email</th>
              <th>Morada</th>
              <th>Género</th>
              <th>Nacionalidade</th>
              <th>Área Funcional</th>
              <th>Categoria Funcional</th>
              <th>Criado por</th>
              <th>Alterado por</th>
              <th>Data de Criação</th>
              <th>Última Alteração</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody className="element">
            {currentData.map((empregado) => (
              <tr key={empregado.EmpregadoID}>
                <td><strong>{empregado.EmpregadoID}</strong></td>
                <td>{empregado.Nome}</td>
                <td>{empregado.Email}</td>
                <td>{empregado.Morada}</td>
                <td>{empregado.Genero}</td>
                <td>{empregado.Nacionalidade}</td>
                <td>{empregado.AreaFuncional}</td>
                <td>{empregado.CategoriaFuncional}</td>
                <td>{empregado.CriadorNome || "N/A"}</td>
                <td>{empregado.AlteradorNome || "N/A"}</td>
                <td>{new Date(empregado.DataCriacao).toLocaleString()}</td>
                <td>{new Date(empregado.DataAlteracao).toLocaleString()}</td>
                <td className="text-center align-middle">
                  <button
                    className={`btn btn-sm ${empregado.Estado === 'ativo' ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => toggleEstado(empregado.EmpregadoID, empregado.Estado)}
                    style={{ width: '90px' }}
                  >
                    {empregado.Estado}
                  </button>
                </td>
                <td className="text-center align-middle">
                  <Link to={`/admin/empregado/edit/${empregado.EmpregadoID}`} className='btn btn-outline-dark button-sucess w-40 rounded-0'>
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

export default Empregado;
