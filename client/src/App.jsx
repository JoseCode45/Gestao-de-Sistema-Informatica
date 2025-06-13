import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminSidebar from './components/SideBar';
import About from './components/About';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Admin from './backoffice/Admin'
import Login from './frontoffice/Autenticacao/Login'
import Register from './frontoffice/Autenticacao/Register'

import './App.css';
import ProtectedRoute from './components/protectedRoute';
import RoleRoute from './components/roleRoute';

import Ocorrencia from './frontoffice/Ocorrencia';
import OcorrenciaCreate from './frontoffice/Ocorrencia/create';

import Carrinho from './frontoffice/Carrinho';

import Encomendas from './frontoffice/Encomendas';
import EncomendaView from './frontoffice/Encomendas/view';

import { CartProvider } from './components/carrinho';

const AppIn = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className="flex-shrink-0">
        <div className="container">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /> </ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/admin/*" element={<ProtectedRoute><RoleRoute> <Admin /> </RoleRoute></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ocorrencia" element={<Ocorrencia />} />
            <Route path="/ocorrencia/criar" element={<OcorrenciaCreate />} />

            <Route path="/encomendas" element={<Encomendas />} />
            <Route path="/encomendas/view/:id" element={<EncomendaView />} />

            <Route path="/carrinho" element={<Carrinho />} />
          </Routes>
        </div>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppIn />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
