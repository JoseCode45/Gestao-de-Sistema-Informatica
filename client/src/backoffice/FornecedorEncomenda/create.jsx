import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import FornecedorEncomendaProdutos from '../../components/fornecedorEncomendaProdutos';
import { BASE_URL } from '../../components/url';

const FornecedorEncomendaCreate = () => {
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
    const criadorID = decodedToken.id;

    // Carrega dados iniciais (estados + fornecedores)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [estadosRes, fornecedoresRes] = await Promise.all([
                    axios.get(`${BASE_URL}/estado-encomenda`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${BASE_URL}/fornecedor`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                setEstados(estadosRes.data);
                setFornecedores(fornecedoresRes.data);

                setForm(prev => ({
                    ...prev,
                    dataPedido: new Date().toISOString().slice(0, 16)
                }));

                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
                alert('Erro ao carregar dados.');
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [token]);

    // Carrega produtos com base no fornecedor selecionado
    useEffect(() => {
        const fetchProdutosPorFornecedor = async () => {
            if (!form.fornecedorID) {
                setProdutosDisponiveis([]);
                setProdutosAssociados([]);
                return;
            }

            try {
                const res = await axios.get(`${BASE_URL}/produto/fornecedor/${form.fornecedorID}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setProdutosDisponiveis(res.data);
                setProdutosAssociados([]); // Limpa seleção ao trocar fornecedor
            } catch (error) {
                console.error('Erro ao buscar produtos do fornecedor:', error);
                alert('Erro ao buscar produtos deste fornecedor.');
                setProdutosDisponiveis([]);
            }
        };

        fetchProdutosPorFornecedor();
    }, [form.fornecedorID, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Criar nova encomenda
            const response = await axios.post(`${BASE_URL}/fornecedor-encomenda`, {
                ...form,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newEncomendaID = response.data.id;

            // Adicionar produtos à nova encomenda
            await axios.put(`${BASE_URL}/fornecedor-encomenda/${newEncomendaID}/produtos`, produtosAssociados, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Criar transporte e fatura
            await axios.post(`${BASE_URL}/fornecedor-fatura/`, {
                encomendaID: newEncomendaID
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate('/admin/fornecedorencomenda');
        } catch (error) {
            console.error('Erro ao criar encomenda:', error);
            alert('Erro ao criar a encomenda.');
            setSaving(false);
        }
    };

    if (loading) return <p>A carregar dados...</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Nova Encomenda do Fornecedor</h1>
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


                <FornecedorEncomendaProdutos
                    associados={produtosAssociados}
                    setAssociados={setProdutosAssociados}
                    produtosDisponiveis={produtosDisponiveis}
                />

                <hr />

                <button type="submit" className="btn btn-success" disabled={saving}>
                    {saving ? 'A criar...' : 'Criar Encomenda'}
                </button>
            </form>
        </div>
    );
};

export default FornecedorEncomendaCreate;
