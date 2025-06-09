// components/AdminSidebar.jsx
import React, { useEffect, useState } from 'react';
import './style.css';

import { Link } from 'react-router-dom';
import { getUserFromToken} from '../../services/auth';

import { CargoAdmin, CargoGestaoStock, CargoProcessamentoPedidos, CargoEntregaPedidos, CargoOcorrencias, CargoPromocoes } from '../../services/roleList';

const AdminSidebar = () => {
  const [users, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const user = getUserFromToken();
    setUser(user);
    setLoading(false);
  }, []);

  return (
    <aside className="admin-sidebar">
      <h2>Dashboard</h2>
      {CargoPromocoes.includes(users?.cargo) &&
      <div className="sidebar-section">
        <h3>Utilizadores</h3>
        <Link to="/admin/utilizador">👤 Gestão Utilizadores</Link>
      </div>
    }

      <div className="sidebar-section">
        <h3>Clientes</h3>
        <Link to="/admin/cliente">👤 Gestão Clientes</Link>
        <Link to="/admin/clienteencomenda">📦 Encomendas Clientes</Link>
        <Link to="/admin/clientefatura">📦 Faturas Clientes</Link>
        <Link to="/admin/ocorrencia">🔧 Gestão Ocorrências</Link>
      </div>

      <div className="sidebar-section">
        <h3>Produtos</h3>
        <Link to="/admin/produto">📦 Gestão Produtos</Link>
        <Link to="/admin/promocoes">👥 Gestão Promoções</Link>
        <Link to="/admin/armazem">📦 Armazéns</Link>
      </div>

      <div className="sidebar-section">
        <h3>Parceiros</h3>
        <Link to="/admin/fornecedor">👤 Fornecedores</Link>
        <Link to="/admin/fornecedorencomenda">📦 Encomendas Fornecedor</Link>
        <Link to="/admin/fornecedorfatura">📦 Faturas Fornecedor</Link>
        <Link to="/admin/empregado">📋 Funcionários</Link>
      </div>

      <div className="sidebar-section">
        <h3>Transporte</h3>
        <Link to="/admin/transporte">👤 Gestão Transportes</Link>
        <Link to="/admin/transportadora">👤 Gestão Transportadoras</Link>
      </div>

      <div className="sidebar-footer">
        <Link to="/">🏠 Página Inicial</Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
