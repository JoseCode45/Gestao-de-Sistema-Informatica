import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ClienteEncomendaProdutos from '../../components/ClienteEncomendaProdutos';
import { BASE_URL } from '../../components/url';

const ClienteEncomendaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        clienteID: '',
        dataEnvio: '',
    });

    const [estados, setEstados] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
    const [produtosAssociados, setProdutosAssociados] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const alteradorID = decodedToken.id;

    const toDateTimeLocal = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const pad = n => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [encomendaRes, estadosRes, clientesRes, produtosRes, produtosAssocRes] = await Promise.all([
                    axios.get(`${BASE_URL}/cliente-encomenda/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/estado-encomenda`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/cliente/lista`, { headers: { Authorization: `Bearer ${token}` } }), // <-- corrigido
                    axios.get(`${BASE_URL}/produto/lista`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/cliente-encomenda/${id}/produtos`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setForm({
                    clienteID: encomendaRes.data.ClienteID || '',
                    dataEnvio: toDateTimeLocal(encomendaRes.data.DataEnvio),
                    estadoID: encomendaRes.data.EstadoID || '',
                });

                setEstados(estadosRes.data);
                setClientes(clientesRes.data);
                setProdutosDisponiveis(produtosRes.data);
                setProdutosAssociados(produtosAssocRes.data);

                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados da encomenda:', error);
                alert('Erro ao carregar dados.');
                setLoading(false);
            }
        };

        fetchData();
    }, [id, token]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {

            // Atualizar dados principais da encomenda
            await axios.put(`${BASE_URL}/cliente-encomenda/${id}`, {
                clienteID: form.clienteID,
                dataEnvio: form.dataEnvio,
                estadoID: form.estadoID,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            //Atualizar produtos associados
            await axios.put(`${BASE_URL}/cliente-encomenda/${id}/produtos`, produtosAssociados, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/admin/clienteencomenda');
        } catch (error) {
            console.error('Erro ao atualizar encomenda:', error);
            alert('Erro ao salvar alterações.');
            setSaving(false);
        }
    };

    if (loading) return <p>A carregar encomenda...</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Editar Encomenda do Cliente</h1>
                <Link to="/admin/clienteencomenda" className="btn btn-outline-secondary">Voltar</Link>
            </div>

            <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Cliente</label>
                    <select className="form-select" name="clienteID" value={form.clienteID} onChange={handleChange} required>
                        <option value="">Selecione o cliente</option>
                        {clientes.map(c => (
                            <option key={c.ID} value={c.ID}>{c.Nome}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Data da Encomenda</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="dataEnvio"  // nome compatível com backend
                        value={form.dataEnvio}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div className="mb-3">
                    <label>Estado</label>
                    <select className="form-select" name="estadoID" value={form.estadoID} onChange={handleChange} required>
                        <option value="">Selecione o estado</option>
                        {estados.map(e => (
                            <option key={e.ID} value={e.ID}>{e.Nome}</option>
                        ))}
                    </select>
                </div>

                <ClienteEncomendaProdutos
                    associados={produtosAssociados}
                    setAssociados={setProdutosAssociados}
                    produtosDisponiveis={produtosDisponiveis}
                />

                <hr />

                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'A salvar...' : 'Salvar Alterações'}
                </button>
            </form>
        </div>
    );
};

export default ClienteEncomendaEdit;
