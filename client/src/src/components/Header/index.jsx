import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getUserFromToken} from '../../services/auth';
import './style.css';

const Header = () => {
  const navigate = useNavigate();
  const [users, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const user = getUserFromToken();
    setUser(user);
    setLoading(false);
    
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); //Remove o token quando o utilizador dá logout
    setUser(null); //Reseta o estado do utilizador.
    navigate('/login');
    window.location.reload();
  };

  
  return (
    <header>
      <nav className="navbar bg-vini navbar-expand-md navbar-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img src="/Logo.png" alt="ViniSI" height="40" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            {/* Navbar esquerda */}
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contact">
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Navbar direita */}
            <ul className="navbar-nav">
              <li className="nav-item">
                {!loading && users?.cargo &&
                <NavLink className="nav-link" to="/admin">
                  <img
                    src="/admin.svg"
                    height="20"
                    style={{ marginRight: '5px', verticalAlign: 'middle' }}
                  />
                  Admin
                </NavLink>
              }
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/carrinho">
                  <img
                    src="/carrinho.svg"
                    height="20"
                    style={{ marginRight: '5px', verticalAlign: 'middle' }}
                  />
                  Carrinho
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="/user.svg" height="20" style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                  Conta
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  {!users && (
                    <>
                      <li><NavLink className="dropdown-item" to="/login">Login</NavLink></li>
                      <li><NavLink className="dropdown-item" to="/register">Register</NavLink></li>
                    </>
                  )}
                  
                  {users && (
                    <>
                    <li><NavLink className="dropdown-item" to="/carrinho">Carrinho</NavLink></li>
                    <li>  <a href="#" className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header;