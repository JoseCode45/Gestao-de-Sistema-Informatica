// src/pages/ArmazemEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../components/url';

const ArmazemEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ Morada: '', AreaM2: '' });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const alteradorID = decodedToken.id;

    useEffect(() => {
        axios.get(`${BASE_URL}/armazem/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setForm({
                    Morada: response.data.Morada,
                    AreaM2: response.data.AreaM2
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao carregar armazém:", error);
                alert("Erro ao carregar armazém.");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/armazem/${id}`, { ...form, alteradorID }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/admin/armazem');
        } catch (err) {
            console.error("Erro ao atualizar armazém:", err);
            alert("Erro ao atualizar armazém.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Editar Armazém</h1>
                <Link to="/admin/armazem" className="btn btn-outline-secondary">Voltar</Link>
            </div>
            <hr></hr>
            {loading ? (
                <p>A carregar...</p>
            ) : (
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
                            min="0"
                            step="any"
                            name="AreaM2"
                            value={form.AreaM2}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <hr></hr>
                    <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                </form>
            )}
        </div>
    );
};

export default ArmazemEdit;
