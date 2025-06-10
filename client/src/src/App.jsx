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



const AppIn = () => {
  const location = useLocation();
const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className="flex-shrink-0">
        <div className="container">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /> </ProtectedRoute>}/>
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/admin/*" element={<ProtectedRoute><RoleRoute> <Admin /> </RoleRoute></ProtectedRoute>}/> 
            <Route path="/login" element= {<Login/>} />
            <Route path="/register" element= {<Register/>} />
          </Routes>
        </div>
      </main>

      {!isAdminRoute && <Footer />}
  </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppIn/>
    </BrowserRouter>
  );
};

export default App;
