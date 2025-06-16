import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import FornecedorEncomendaProdutos from '../../components/fornecedorEncomendaProdutos';
import { BASE_URL } from '../../components/url';

const FornecedorEncomendaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fornecedorID: '',
        dataPedido: '',
        dataEntrega: '',
        estadoID: ''
    });

    const [estados, setEstados] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
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
                const [encomendaRes, estadosRes, fornecedoresRes, produtosRes, produtosAssocRes] = await Promise.all([
                    axios.get(`${BASE_URL}/fornecedor-encomenda/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/estado-encomenda`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/fornecedor`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/produto/fornecedor/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/fornecedor-encomenda/${id}/produtos`, { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setForm({
                    fornecedorID: encomendaRes.data.FornecedorID || '',
                    dataPedido: toDateTimeLocal(encomendaRes.data.DataPedido),
                    dataEntrega: toDateTimeLocal(encomendaRes.data.DataEntrega),
                    estadoID: encomendaRes.data.EstadoID || '',
                });

                setEstados(estadosRes.data);
                setFornecedores(fornecedoresRes.data);
                setProdutosDisponiveis(produtosRes.data);
                setProdutosAssociados(produtosAssocRes.data);
                console.log(encomendaRes.data);
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
            await axios.put(`${BASE_URL}/transporte/fornecedor/${id}`, {
                fornecedorID: form.fornecedorID,
                dataPedido: form.dataPedido,
                dataEntrega: form.dataEntrega,
                estadoID: form.estadoID,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            //Atualizar produtos associados
            await axios.put(`${BASE_URL}/fornecedor-encomenda/${id}/produtos`, produtosAssociados, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/admin/fornecedorencomenda');
        } catch (error) {
            console.error('Erro ao atualizar encomenda:', error);
            alert('Erro ao salvar alterações.');
            setSaving(false);
        }
    };

    const confirmarEncomenda = async () => {
        try {
            await axios.patch(`${BASE_URL}/transporte/fornecedor/${id}`,
                { alteradorID },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert('Encomenda confirmada com sucesso!');
            navigate('/admin/fornecedorencomenda');
        } catch (error) {
            console.error('Erro ao confirmar encomenda:', error);
            alert('Erro ao confirmar encomenda.');
        }
    };

    // Função para cancelar encomenda fornecedor
    const cancelarEncomenda = async () => {
        try {
            await axios.patch(`${BASE_URL}/transporte/fornecedor/cancelar/${id}`,
                { alteradorID },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            alert('Encomenda cancelada com sucesso!');
            navigate('/admin/fornecedorencomenda');
        } catch (error) {
            console.error('Erro ao cancelar encomenda:', error);
            alert('Erro ao cancelar encomenda.');
        }
    };


    if (loading) return <p>A carregar encomenda...</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Editar Encomenda do Fornecedor</h1>
                <Link to="/admin/fornecedorencomenda" className="btn btn-outline-secondary">Voltar</Link>
            </div>

            <hr />

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Fornecedor</label>
                    <select className="form-select" name="fornecedorID" value={form.fornecedorID} onChange={handleChange} required>
                        <option value="">Selecione o Fornecedor</option>
                        {fornecedores.map(c => (
                            <option key={c.ID} value={c.ID}>{c.Nome}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Data do Pedido</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="dataPedido"
                        value={form.dataPedido}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Data da Entrega</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        name="dataEntrega"
                        value={form.dataEntrega}
                        onChange={handleChange}

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

                <FornecedorEncomendaProdutos
                    associados={produtosAssociados}
                    setAssociados={setProdutosAssociados}
                    produtosDisponiveis={produtosDisponiveis}
                />

                <hr />

                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'A salvar...' : 'Salvar Alterações'}
                </button>
            </form>
            <br></br>
            <div className="d-flex gap-2">
                <button type="button" className="btn btn-success" onClick={confirmarEncomenda} disabled={form.estadoID!=1 && form.estadoID!=2 }>
                    Confirmar Encomenda
                </button>
                <button type="button" className="btn btn-danger" onClick={cancelarEncomenda} disabled={form.estadoID==3 || form.estadoID==5 }>
                    Cancelar Encomenda
                </button>
            </div>
        </div>
    );
};

export default FornecedorEncomendaEdit;
