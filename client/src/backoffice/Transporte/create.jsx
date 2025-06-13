// src/pages/TransporteCreate.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';

const TransporteCreate = () => {
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

    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesRes, fornecedoresRes, transportadorasRes, estadosRes] = await Promise.all([
                    axios.get(`${BASE_URL}/cliente-encomenda`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/fornecedor-encomenda`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/transportadora`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/estado-transporte`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setClientes(clientesRes.data);
                setFornecedores(fornecedoresRes.data);
                setTransportadoras(transportadorasRes.data);
                setEstados(estadosRes.data);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                alert("Erro ao carregar listas de IDs.");
            }
        };
        fetchData();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Impedir seleção simultânea de Cliente e Fornecedor
        if (name === 'ClienteEncomendaID') {
            setForm(prev => ({ ...prev, clienteEncomendaID: value, fornecedorEncomendaID: '' }));
        } else if (name === 'FornecedorEncomendaID') {
            setForm(prev => ({ ...prev, fornecedorEncomendaID: value, clienteEncomendaID: '' }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        console.log(form);
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/transporte`, { ...form}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin/transporte');
        } catch (err) {
            console.error("Erro ao criar transporte:", err);
            alert("Erro ao criar transporte.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Novo Transporte</h1>
                <Link to="/admin/transporte" className="btn btn-outline-secondary">Voltar</Link>
            </div>
            <hr />
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
                        placeholder='Custo'
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
                        disabled={form.fornecedorEncomendaID}
                    >
                        <option value="">Selecione um Cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.ID || `Cliente #${cliente.id}`}
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
                        disabled={form.clienteEncomendaID}
                    >
                        <option value="">Selecione um Fornecedor</option>
                        {fornecedores.map(fornecedor => (
                            <option key={fornecedor.id} value={fornecedor.id}>
                                {fornecedor.ID || `Fornecedor #${fornecedor.id}`}
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
                            <option key={transp.id} value={transp.ID}>
                                {transp.Nome || `Transportadora #${transp.id}`}
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
                            <option key={estado.id} value={estado.EstadoID}>
                                {estado.Nome || `Estado #${estado.id}`}
                            </option>
                        ))}
                    </select>
                </div>
                <hr />
                <button type="submit" className="btn btn-primary">Criar Transporte</button>
            </form>
        </div>
    );
};

export default TransporteCreate;
