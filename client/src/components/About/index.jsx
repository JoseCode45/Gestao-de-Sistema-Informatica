import React, { Component } from 'react';
import './style.css';
import { NavLink } from 'react-router-dom';

class About extends Component {
  render() {
    return (
      <>
        <h1 className='pag'>Sobre nós</h1>
        <hr></hr>
        <div className='contactos'>
          <div className='lista'>
            <br></br>
            <ul>
            <p>A ViniSI é uma empresa distribuidora de vinhos sediada na região de Lisboa, 
              destacando-se no mercado nacional pela sua colaboração com produtores de excelência 
              e pela vasta gama de vinhos que disponibiliza, incluindo vinhos tintos, brancos, 
              rosés e espumantes. A empresa atua num modelo de negócio direcionado exclusivamente
               para o consumidor final, através de uma plataforma de e-commerce que permite a
                encomenda e entrega de produtos ao domicílio em todo o território nacional.</p>
            <br></br>
            </ul>
          </div>
        </div>
        <NavLink className="nav-link-contactos" to="/"> Página Inicial </NavLink>
        <hr></hr>
      </>
    )
  }
}

export default About;