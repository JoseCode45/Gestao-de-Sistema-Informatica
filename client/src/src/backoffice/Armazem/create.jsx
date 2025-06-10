// src/pages/ArmazemCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';
import { Link } from 'react-router-dom';

const ProdutoCreate = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ Morada: '', AreaM2: '' });

    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const criadorID = decodedToken.id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/armazem`, { ...form, criadorID }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin/armazem');
        } catch (err) {
            console.error("Erro ao criar armazém:", err);
            alert("Erro ao criar armazém.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Novo Armazém</h1>
                <Link to="/admin/armazem" className="btn btn-outline-secondary">Voltar</Link>
            </div>
            <hr></hr>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Morada</label>
                    <input
                        type="text"
                        className="form-control"
                        name="Morada"
                        value={form.Morada}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Área (m²)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="AreaM2"
                        min="0"
                        step="any"
                        value={form.AreaM2}
                        onChange={handleChange}
                        required
                    />
                </div>
                <hr></hr>
                <button type="submit" className="btn btn-primary">Criar</button>
            </form>
        </div>
    );
};

export default ProdutoCreate;