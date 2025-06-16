import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Main from '../Main';
import Cliente from '../Cliente';

import ClienteEncomenda from '../ClienteEncomenda';
import ClienteEncomendaEdit from '../ClienteEncomenda/edit';

import ClienteFatura from '../ClienteFatura';

import Ocorrencia from '../Ocorrencia';
import OcorrenciaView from '../Ocorrencia/view';

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
import FornecedorEncomendaEdit from '../FornecedorEncomenda/edit';
import FornecedorEncomendaCreate from '../FornecedorEncomenda/create';

import FornecedorFatura from '../FornecedorFatura';

import Armazem from '../Armazem';
import ArmazemCreate from '../Armazem/create';
import ArmazemEdit from '../Armazem/edit';

import Utilizador from '../Utilizador';
import UtilizadorCreate from '../Utilizador/create';

import Transporte from '../Transporte';
import TransporteCreate from '../Transporte/create';
import TransporteEdit from '../Transporte/edit';

import Transportadora from '../Transportadora';
import TransportadoraCreate from '../Transportadora/create';
import TransportadoraEdit from '../Transportadora/edit';

import RoleRoute from '../../components/roleRoute';
import { CargoAdmin, CargoGestaoStock, CargoProcessamentoPedidos, CargoEntregaPedidos, CargoOcorrencias, CargoPromocoes, CargoComercial } from '../../services/roleList';
import './style.css';

const Admin = () => {

  return (    
    
      <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
      <Routes>
        <Route path="" element={<Main />} />
        <Route path="cliente" element={<RoleRoute allowedRoles={CargoOcorrencias}> <Cliente /> </RoleRoute>} />

        <Route path="clienteencomenda" element={<RoleRoute allowedRoles={CargoPromocoes.concat(CargoEntregaPedidos,CargoOcorrencias)}> <ClienteEncomenda /></RoleRoute>} />
        <Route path="clienteencomenda/edit/:id" element={<RoleRoute allowedRoles={[CargoEntregaPedidos,CargoProcessamentoPedidos, CargoOcorrencias]}> <ClienteEncomendaEdit/></RoleRoute>} />
        <Route path="clientefatura" element={<RoleRoute allowedRoles={CargoProcessamentoPedidos.concat(CargoEntregaPedidos)}> <ClienteFatura /> </RoleRoute>} />


        <Route path="fornecedorencomenda" element={<RoleRoute allowedRoles={CargoProcessamentoPedidos.concat(CargoGestaoStock)}> <FornecedorEncomenda /> </RoleRoute>} />
        <Route path="fornecedorencomenda/criar" element={<RoleRoute allowedRoles={CargoProcessamentoPedidos.concat(CargoGestaoStock)}> <FornecedorEncomendaCreate /> </RoleRoute>} />
        <Route path="fornecedorencomenda/edit/:id" element={<RoleRoute allowedRoles={CargoProcessamentoPedidos.concat(CargoGestaoStock)}> <FornecedorEncomendaEdit /> </RoleRoute>} />

        <Route path="fornecedor" element={<RoleRoute allowedRoles={CargoProcessamentoPedidos.concat(CargoGestaoStock)}> <Fornecedor /> </RoleRoute>} />
        <Route path="fornecedor/criar" element={<RoleRoute allowedRoles={CargoAdmin}> <FornecedorCreate /> </RoleRoute>} />
        <Route path="fornecedor/edit/:id" element={<RoleRoute allowedRoles={CargoAdmin}> <FornecedorEdit /> </RoleRoute>} />
        <Route path="fornecedorfatura" element={<RoleRoute allowedRoles={CargoProcessamentoPedidos.concat(CargoGestaoStock)}> <FornecedorFatura /> </RoleRoute>} />


        <Route path="ocorrencia" element={<RoleRoute allowedRoles={CargoOcorrencias} ><Ocorrencia /> </RoleRoute>}/>
        <Route path="ocorrencia/view/:id" element={<RoleRoute allowedRoles={CargoOcorrencias}> <OcorrenciaView /> </RoleRoute>} />

        <Route path="empregado" element={<RoleRoute allowedRoles={CargoAdmin}> <Empregado /> </RoleRoute>} />

        <Route path="produto" element={<RoleRoute allowedRoles={CargoGestaoStock}> <Produtos /> </RoleRoute>} />
        <Route path="produto/criar" element={<RoleRoute allowedRoles={CargoAdmin}> <ProdutoCreate /> </RoleRoute>} />
        <Route path="produto/edit/:id" element={<RoleRoute allowedRoles={CargoAdmin}> <ProdutoEdit /> </RoleRoute>} />

        <Route path="promocoes" element={<RoleRoute allowedRoles={CargoPromocoes}> <Promocoes /> </RoleRoute>} />
        <Route path="promocoes/criar" element={<RoleRoute allowedRoles={CargoPromocoes}> <PromocoesCreate /> </RoleRoute>} />
        <Route path="promocoes/edit/:id" element={<RoleRoute allowedRoles={CargoPromocoes}> <PromocoesEdit /> </RoleRoute>} /> 

        <Route path="*" element={<NotFound />} />


        <Route path="armazem" element={<RoleRoute allowedRoles={CargoAdmin}> <Armazem /> </RoleRoute>} />
        <Route path="armazem/criar" element={<RoleRoute allowedRoles={CargoAdmin}> <ArmazemCreate /> </RoleRoute>} />
        <Route path="armazem/edit/:id" element={<RoleRoute allowedRoles={CargoAdmin}> <ArmazemEdit /> </RoleRoute>} />

        <Route path="utilizador" element={<RoleRoute allowedRoles={CargoAdmin}> <Utilizador /></RoleRoute>} />
        <Route path="utilizador/criar" element={<RoleRoute allowedRoles={CargoAdmin}> <UtilizadorCreate/></RoleRoute>} />

        <Route path="transporte" element={<RoleRoute allowedRoles={CargoProcessamentoPedidos.concat(CargoGestaoStock,CargoEntregaPedidos)}> <Transporte /> </RoleRoute>} />
        <Route path="transporte/criar" element={<RoleRoute allowedRoles={CargoProcessamentoPedidos.concat(CargoGestaoStock,CargoEntregaPedidos)}> <TransporteCreate /> </RoleRoute>} />
        <Route path="transporte/edit/:id" element={<RoleRoute allowedRoles={CargoProcessamentoPedidos.concat(CargoGestaoStock,CargoEntregaPedidos)}> <TransporteEdit /> </RoleRoute>} />

        <Route path="transportadora" element={<RoleRoute allowedRoles={CargoAdmin}> <Transportadora /> </RoleRoute>} />
        <Route path="transportadora/criar" element={<RoleRoute allowedRoles={CargoAdmin}> <TransportadoraCreate /> </RoleRoute>} />
        <Route path="transportadora/edit/:id" element={<RoleRoute allowedRoles={CargoAdmin}> <TransportadoraEdit /> </RoleRoute>} />
        
      </Routes>
      </div>
      </div>
  );
};

export default Admin;
