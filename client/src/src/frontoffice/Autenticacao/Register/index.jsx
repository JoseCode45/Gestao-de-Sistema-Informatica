import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../../../components/url';

function Register() {
    const [values, setValues] = useState({
        nome: "",
        email: "",
        password: "",
        morada: "",
        generoID: "",
        NIF: "",
    })
    const [error, setError] = useState("");  // Error handling state
    const [generos, setGeneros] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${BASE_URL}/genero`)
            .then(res => {
                if (res.status === 200) {
                    setGeneros(res.data);
                }
            })
            .catch(err => {
                console.error("Erro ao carregar géneros:", err);
            });
    }, []);

    const handleSubmit = (event) => {
        console.log(values);
        event.preventDefault();

            if (!/^\d{9}$/.test(values.NIF)) {
        setError("NIF inválido. Deve conter exatamente 9 dígitos.");
        return;
    }
    
        axios.post(`${BASE_URL}/utilizador/registerCliente`, values)
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    navigate('/login')
                    window.location.reload();
                } else {
                    setError("Credenciais Invalidas");
                }
            })
            .catch(err => {
                console.error(err);
                if (err.response.status === 400) {
                    setError("Parâmetros inválidos. Verifique os dados.");
                } else if (err.response.status === 401) {
                    setError("Nome de utilizador, email ou senha incorretos.");
                } else if (err.response.status === 404) {
                    setError("Utilizador não encontrado.");
                } else if (err.response.status === 500) {
                    setError("Erro no servidor. Tente novamente mais tarde.");
                } else {
                    setError("Erro inesperado. Tente novamente.");
                }
            });
    }

    return (
        <
            div className='d-flex justify-content-center align-items-center vh-100'
            style={{ backgroundColor: "#eeeeee" }}
        >
            <div className='bg-white p-3 rounded w-25'>
                <h2>Registe-se</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="nome"><strong>Nome</strong></label>
                        <input type="text" placeholder="Insira Nome de Utilizador" name="name"
                            onChange={e => setValues({ ...values, nome: e.target.value })} className='form-control rounded-0' minLength={4} maxLength={32} required/>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="Insira E-mail" name="email"
                            onChange={e => setValues({ ...values, email: e.target.value })} className='form-control rounded-0' required/>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder="Insira Password" name="password"
                            onChange={e => setValues({ ...values, password: e.target.value })} className='form-control rounded-0' minLength={4} maxLength={32} required/>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="genero"><strong>Género</strong></label>
                        <select className='form-control rounded-0' name="generoID"
                            onChange={e => setValues({ ...values, generoID: e.target.value })}>
                            <option value="">Selecione o género</option>
                            {generos.map((genero) => (
                                <option key={genero.ID} value={genero.ID}>{genero.Nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="morada"><strong>Morada</strong></label>
                        <input type="text" placeholder="Insira a Morada" name="morada"
                            onChange={e => setValues({ ...values, morada: e.target.value })} className='form-control rounded-0' minLength={3} maxLength={100} />
                    </div>

                    <div className='mb-3'>
                        <label htmlFor="NIF"><strong>NIF</strong></label>
                        <input type="text" placeholder="Insira O NIF" name="NIF"
                            onChange={e => setValues({ ...values, NIF: e.target.value })} className='form-control rounded-0' minLength={9} maxLength={9}/>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className='btn btn-primary w-100 rounded-0'>Criar Conta</button>
                    <p> Já tem uma conta? Faça login.</p>
                    <Link to="/login" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Login</Link>
                </form>

            </div>
        </div>
    )
}

export default Register