// src/pages/OcorrenciaCreate.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../components/url';
import { Link } from 'react-router-dom';

const OcorrenciaCreate = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ motivo: '', descricao: '' });

    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const registouID = decodedToken.id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/ocorrencia`, { ...form, registouID }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/ocorrencia'); // redireciona após criação
        } catch (err) {
            console.error("Erro ao criar ocorrência:", err);
            alert("Erro ao criar ocorrência.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Nova Ocorrência</h1>
                <Link to="/ocorrencia" className="btn btn-outline-secondary">Voltar</Link>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Motivo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="motivo"
                        value={form.motivo}
                        onChange={handleChange}
                        placeholder="Escreva o motivo da ocorrência"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Descrição</label>
                    <textarea
                        className="form-control"
                        name="descricao"
                        value={form.descricao}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Descreva a sua ocorrência, coloque o ID do seu pedido."
                        required
                    />
                </div>
                <hr />
                <button type="submit" className="btn btn-primary">Criar</button>
            </form>
        </div>
    );
};

export default OcorrenciaCreate;
