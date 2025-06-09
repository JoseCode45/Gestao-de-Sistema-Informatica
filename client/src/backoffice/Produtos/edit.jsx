// src/pages/ProdutoEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../components/url';

const ProdutoEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nome: '',
        preco: '',
        regiaoID: ''
    });
    const [regioes, setRegioes] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const alteradorID = decodedToken.id;

    useEffect(() => {
        // Buscar produto para preencher form
        axios.get(`${BASE_URL}/produto/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const produto = response.data;
                setForm({
                    nome: produto.Nome || '',
                    preco: produto.Preco || '',
                    regiaoID: produto.RegiaoID || ''
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar produto:", error);
                alert("Erro ao carregar produto.");
                setLoading(false);
            });

        // Buscar regiões para dropdown
        axios.get(`${BASE_URL}/regiao`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setRegioes(response.data))
            .catch(err => console.error("Erro ao carregar regiões", err));

    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/produto/${id}`, { ...form, alteradorID }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin/produto');
        } catch (err) {
            console.error("Erro ao atualizar produto:", err);
            alert("Erro ao atualizar produto.");
        }
    };

    if (loading) return <p>A carregar...</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Editar Produto</h1>
                <Link to="/admin/produto" className="btn btn-outline-secondary">Voltar</Link>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>nome</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        required
                        maxLength={16}
                    />
                </div>
                <div className="mb-3">
                    <label>preco</label>
                    <input
                        type="number"
                        className="form-control"
                        name="preco"
                        value={form.preco}
                        onChange={handleChange}
                        min="0"
                        step="any"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Região</label>
                    <select
                        className="form-select"
                        name="regiaoID"
                        value={form.regiaoID}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione a região</option>
                        {regioes.map(r => (
                            <option key={r.ID} value={r.ID}>{r.Nome}</option>
                        ))}
                    </select>
                </div>
                <hr />
                <button type="submit" className="btn btn-primary">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default ProdutoEdit;
