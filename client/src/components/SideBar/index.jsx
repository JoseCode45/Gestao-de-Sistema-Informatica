// components/AdminSidebar.jsx
import React, { useEffect, useState } from 'react';
import './style.css';

import { Link } from 'react-router-dom';
import { getUserFromToken } from '../../services/auth';

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
      {CargoAdmin.includes(users?.cargo) &&
        <div className="sidebar-section">
          <h3>Utilizadores</h3>
          <Link to="/admin/utilizador">👤 Gestão Utilizadores</Link>
        </div>
      }

      {(CargoOcorrencias.includes(users?.cargo) || CargoEntregaPedidos.includes(users?.cargo) || CargoProcessamentoPedidos.includes(users?.cargo)) &&
        <div className="sidebar-section">
          <h3>Clientes</h3>
          {CargoAdmin.includes(users?.cargo) && <Link to="/admin/cliente">👤 Gestão Clientes</Link>}
          {(CargoProcessamentoPedidos.includes(users?.cargo) || CargoEntregaPedidos.includes(users?.cargo) || CargoOcorrencias.includes(users?.cargo)) && <Link to="/admin/clienteencomenda">📦 Encomendas Clientes</Link>}
          {(CargoProcessamentoPedidos.includes(users?.cargo) || CargoEntregaPedidos.includes(users?.cargo)) && <Link to="/admin/clientefatura">📦 Faturas Clientes</Link>}
          {CargoOcorrencias.includes(users?.cargo) && <Link to="/admin/ocorrencia">🔧 Gestão Ocorrências</Link>}
        </div>
      }

      {(CargoPromocoes.includes(users?.cargo) || CargoGestaoStock.includes(users?.cargo)) &&
        <div className="sidebar-section">
          <h3>Produtos</h3>
          {CargoGestaoStock.includes(users?.cargo) && <Link to="/admin/produto">📦 Gestão Produtos</Link>}
          {CargoPromocoes.includes(users?.cargo) && <Link to="/admin/promocoes">👥 Gestão Promoções</Link>}
          {CargoAdmin.includes(users?.cargo) && <Link to="/admin/armazem">📦 Armazéns</Link>}
        </div>
      }

      {CargoGestaoStock.includes(users?.cargo) &&
        <div className="sidebar-section">
          <h3>Parceiros</h3>
          <Link to="/admin/fornecedor">👤 Fornecedores</Link>
          {CargoGestaoStock.includes(users?.cargo) && <Link to="/admin/fornecedorencomenda">📦 Encomendas Fornecedor</Link>}
          {CargoGestaoStock.includes(users?.cargo) && <Link to="/admin/fornecedorfatura">📦 Faturas Fornecedor</Link>}
          {CargoAdmin.includes(users?.cargo) && <Link to="/admin/empregado">📋 Funcionários</Link>}
        </div>
      }

      {(CargoPromocoes.includes(users?.cargo) || CargoGestaoStock.includes(users?.cargo) || CargoEntregaPedidos.includes(users?.cargo)) &&
        <div className="sidebar-section">
          <h3>Transporte</h3>
          <Link to="/admin/transporte">👤 Gestão Transportes</Link>
          {CargoAdmin.includes(users?.cargo) && <Link to="/admin/transportadora">👤 Gestão Transportadoras</Link>}
        </div>
      }

      <div className="sidebar-footer">
        <Link to="/">🏠 Página Inicial</Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
