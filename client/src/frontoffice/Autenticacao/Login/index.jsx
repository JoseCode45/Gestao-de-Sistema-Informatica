import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../../../components/url';

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("");  // Error handling state

    const navigate = useNavigate()

    const handleSubmit = (event) =>{
        event.preventDefault();

        axios.post(`${BASE_URL}/utilizador/login`, values)
        .then(res => {
            if(res.status === 200) {
                localStorage.setItem('token', res.data.token);
                navigate('/')
                window.location.reload();
                
            } else{
                setError("Credenciais Invalidas");
            }
        })
        .catch(err =>{
            console.error(err);
                if (err.response.status === 400) {
                    setError("Parâmetros inválidos ou faltando. Verifique os dados.");
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
            style={{backgroundColor: "#eeeeee"}}
        >
            <div className='bg-white p-3 rounded w-25'>
                <h2>Entre</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="Insira Nome de Utilizador" name="email"
                            onChange={e => setValues({... values, email: e.target.value})} className='form-control rounded-0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder="Insira Password" name="password"
                            onChange={e => setValues({... values, password: e.target.value})} className='form-control rounded-0'/>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className='btn btn-primary w-100 rounded-0'>Login</button>
                    <p> Não tem uma conta? Crie uma.</p>
                    <Link to= "/register" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Criar Conta</Link>
                </form>
                    
            </div>
        </div>
    )
}

export default Login