// src/pages/TransporteEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';

const TransporteEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        dataSaida: '',
        dataEntrega: '',
        custoTotal: '',
        clienteEncomendaID: '',
        fornecedorEncomendaID: '',
        transportadoraID: '',
        estadoID: ''
    });

    const [clientes, setClientes] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [transportadoras, setTransportadoras] = useState([]);
    const [estados, setEstados] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const alteradorID = decodedToken.id;

      // Helper: format ISO string to "yyyy-MM-ddTHH:mm" local datetime string for input[type=datetime-local]
  const toDateTimeLocal = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);

    const pad = (n) => n.toString().padStart(2, '0');

    // Use local time parts
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [transporteRes, clientesRes, fornecedoresRes, transportadorasRes, estadosRes] = await Promise.all([
                    axios.get(`${BASE_URL}/transporte/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/cliente-encomenda`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/fornecedor-encomenda`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/transportadora`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/estado-transporte`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const data = transporteRes.data;

                setForm({
                    dataSaida: toDateTimeLocal(data.DataSaida),
                    dataEntrega: toDateTimeLocal(data.DataEntrega),
                    custoTotal: data.CustoTotal,
                    clienteEncomendaID: data.ClienteEncomendaID || '',
                    fornecedorEncomendaID: data.FornecedorEncomendaID || '',
                    transportadoraID: data.TransportadoraID,
                    estadoID: data.EstadoID
                });

                setClientes(clientesRes.data);
                setFornecedores(fornecedoresRes.data);
                setTransportadoras(transportadorasRes.data);
                setEstados(estadosRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                alert("Erro ao carregar dados do transporte.");
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'clienteEncomendaID') {
            setForm(prev => ({ ...prev, clienteEncomendaID: value, fornecedorEncomendaID: '' }));
        } else if (name === 'fornecedorEncomendaID') {
            setForm(prev => ({ ...prev, fornecedorEncomendaID: value, clienteEncomendaID: '' }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/transporte/${id}`, { ...form}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin/transporte');
        } catch (err) {
            console.error("Erro ao atualizar transporte:", err);
            alert("Erro ao atualizar transporte.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Editar Transporte</h1>
                <Link to="/admin/transporte" className="btn btn-outline-secondary">Voltar</Link>
            </div>
            <hr />
            {loading ? (
                <p>A carregar...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Data de Saída</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            name="dataSaida"
                            value={form.dataSaida}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Data de Entrega</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            name="dataEntrega"
                            value={form.dataEntrega}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Custo Total (€)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="custoTotal"
                            min="0"
                            step="0.01"
                            value={form.custoTotal}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Cliente Encomenda</label>
                        <select
                            className="form-select"
                            name="clienteEncomendaID"
                            value={form.clienteEncomendaID}
                            onChange={handleChange}
                            disabled={!!form.fornecedorEncomendaID}
                        >
                            <option value="">Selecione uma Encomenda de Cliente</option>
                            {clientes.map(cliente => (
                                <option key={cliente.ID} value={cliente.ID}>
                                    {cliente.ID || `Cliente #${cliente.ID}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Fornecedor Encomenda</label>
                        <select
                            className="form-select"
                            name="fornecedorEncomendaID"
                            value={form.fornecedorEncomendaID}
                            onChange={handleChange}
                            disabled={!!form.clienteEncomendaID}
                        >
                            <option value="">Selecione uma Encomenda de Fornecedor</option>
                            {fornecedores.map(fornecedor => (
                                <option key={fornecedor.ID} value={fornecedor.ID}>
                                    {fornecedor.ID || `Fornecedor #${fornecedor.ID}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Transportadora</label>
                        <select
                            className="form-select"
                            name="transportadoraID"
                            value={form.transportadoraID}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione uma Transportadora</option>
                            {transportadoras.map(transp => (
                                <option key={transp.ID} value={transp.ID}>
                                    {transp.Nome || `Transportadora #${transp.ID}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label>Estado</label>
                        <select
                            className="form-select"
                            name="estadoID"
                            value={form.estadoID}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione um Estado</option>
                            {estados.map(estado => (
                                <option key={estado.ID} value={estado.ID}>
                                    {estado.Nome || `Estado #${estado.ID}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <hr />
                    <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                </form>
            )}
        </div>
    );
};

export default TransporteEdit;
