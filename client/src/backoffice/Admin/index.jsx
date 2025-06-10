import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Main from '../Main';
import Cliente from '../Cliente';
import ClienteEncomenda from '../ClienteEncomenda';
import ClienteFatura from '../ClienteFatura';
import Ocorrencia from '../Ocorrencia';
import NotFound from '../../components/NotFound';
import Empregado from '../Empregado';

import Produtos from '../Produtos';
import ProdutoEdit from '../Produtos/edit';
import ProdutoCreate from '../Produtos/create';

import Promocoes from '../Promocoes';
import PromocoesEdit from '../Promocoes/edit';
import PromocoesCreate from '../Promocoes/create';

import AdminSidebar from '../../components/SideBar';

import Fornecedor from '../Fornecedor'
import FornecedorEdit from '../Fornecedor/edit';
import FornecedorCreate from '../Fornecedor/create';
;
import FornecedorEncomenda from '../FornecedorEncomenda';
import FornecedorFatura from '../FornecedorFatura';

import Armazem from '../Armazem';
import ArmazemCreate from '../Armazem/create';
import ArmazemEdit from '../Armazem/edit';

import Utilizador from '../Utilizador';
import Transporte from '../Transporte';
import Transportadora from '../Transportadora';


import RoleRoute from '../../components/roleRoute';
import { CargoAdmin, CargoGestaoStock, CargoProcessamentoPedidos, CargoEntregaPedidos, CargoOcorrencias, CargoPromocoes } from '../../services/roleList';
import './style.css';

const Admin = () => {

  return (    
    
      <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
      <Routes>
        <Route path="" element={<Main />} />
        <Route path="cliente" element={<Cliente />} />
        <Route path="clienteencomenda" element={<RoleRoute allowedRoles={CargoEntregaPedidos}> <ClienteEncomenda /></RoleRoute>} />
        <Route path="clientefatura" element={<ClienteFatura />} />
        <Route path="ocorrencia" element={<Ocorrencia />} />
        <Route path="empregado" element={<Empregado />} />

        <Route path="produto" element={<Produtos />} />
        <Route path="produto/criar" element={<ProdutoCreate />} />  
        <Route path="produto/edit/:id" element={<ProdutoEdit />} />  

        <Route path="promocoes" element={<Promocoes />} />   
        <Route path="promocoes/criar" element={<PromocoesCreate/>} />   
        <Route path="promocoes/edit/:id" element={<PromocoesEdit/>} />   

        <Route path="*" element={<NotFound />} />

        <Route path="fornecedor" element={<Fornecedor/>}/>
        <Route path="fornecedor/criar" element={<FornecedorCreate />} />  
        <Route path="fornecedor/edit/:id" element={<FornecedorEdit />} />  

        <Route path="fornecedorencomenda" element={<FornecedorEncomenda/>}/>
        <Route path="fornecedorfatura" element={<FornecedorFatura/>}/>
        <Route path="armazem" element={<Armazem/>}/>
        <Route path="armazem/criar" element={<ArmazemCreate />} />
        <Route path="armazem/edit/:id" element={<ArmazemEdit />} />
        <Route path="utilizador" element={<RoleRoute allowedRoles={CargoPromocoes}> <Utilizador /></RoleRoute>} />
        <Route path="transporte" element={<Transporte/>}/>
        <Route path="transportadora" element={<Transportadora/>}/>
        
      </Routes>
      </div>
      </div>
  );
};

export default Admin;
