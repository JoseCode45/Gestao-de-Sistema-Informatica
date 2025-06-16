import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { BASE_URL } from '../../components/url';

const FornecedorFatura = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get(`${BASE_URL}/fornecedor-fatura`, {
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
    item.DataEmissao?.toLowerCase().includes(search.toLowerCase()) ||
    item.DataValidade?.toLowerCase().includes(search.toLowerCase()) ||
    item.TotalFaturado?.toLowerCase().includes(search.toLowerCase()) ||
    item.CriadorNome?.toLowerCase().includes(search.toLowerCase()) ||
    item.AlteradorNome?.toLowerCase().includes(search.toLowerCase())
  );

    //Retornar cor dependendo do ID do estado.
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pagarFatura = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const alteradorID = decodedToken.id;

    await axios.patch(`${BASE_URL}/fornecedor-fatura/pagar/${id}`, 
      { alteradorID }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Fatura paga com sucesso!');
    navigate('/admin/fornecedorfatura');

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
      <div className="fixd d-flex justify-content-between align-items-center mb-3">
        <h1>Faturas de Fornecedor</h1>
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
      <div className="fornecedor-encomenda-table table-container">
        <table className="element table table-responsive table-hover table-striped">
          <thead>
            <tr>
              <th><strong>ID</strong></th>
              <th>Data Emissão</th>
              <th>Data Validade</th>
              <th>Data Pagamento</th>
              <th>Encomenda ID</th>
              <th>Total Faturado</th>
              <th>Total IVA</th>
              <th>Criado por</th>
              <th>Alterado por</th>
              <th>Data Criação</th>
              <th>Última Alteração</th>
              <th>Estado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.ID}>
                <td><strong>{item.ID}</strong></td>
                <td>{new Date(item.DataEmissao).toLocaleString()}</td>
                <td>{new Date(item.DataValidade).toLocaleString()}</td>
                <td>{item.DataPagamento ? new Date(item.DataPagamento).toLocaleString() : '—'}</td>
                <td>{item.EncomendaID}</td>
                <td>{item.TotalFaturado} €</td>
                <td>{item.TotalIVA} €</td>
                <td>{item.CriadorNome || 'N/A'}</td>
                <td>{item.AlteradorNome || 'N/A'}</td>
                <td>{new Date(item.DataCriacao).toLocaleString()}</td>
                <td>{new Date(item.DataAlteracao).toLocaleString()}</td>
                <td>                  <button
                  className={`btn btn-sm ${getEstadoColorClass(item.EstadoID)}`}
                  style={{ width: '90px' }}
                >
                  {item.EstadoFatura}
                </button></td>
                <td className="text-center align-middle">
                    <button onClick={() => pagarFatura(item.ID)} className='btn btn-primary w-40 rounded-0' disabled={item.EstadoID === 3 || item.EstadoID === 4}>PAGAR</button>
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

export default FornecedorFatura;
