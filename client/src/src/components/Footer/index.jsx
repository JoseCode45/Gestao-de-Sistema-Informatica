import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <footer
        className="bg-light position-relative py-4"
        style={{
          backgroundImage: "url('/footer.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Transparent overlay div if needed */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.5)', pointerEvents: 'none' }} />

        <div className="container position-relative">
          <div className="d-flex justify-content-between flex-wrap align-items-center">
            <div className="mb-3">
              <nav className="nav mb-2">
                <Link to="/termos" className="nav-link px-2 text-muted">Termos de Uso</Link>
                <Link to="/contactos" className="nav-link px-2 text-muted">Contactos</Link>
                <Link to="/sobre" className="nav-link px-2 text-muted">Sobre</Link>
                <Link to="/criar-ocorrencia" className="nav-link px-2 text-muted">Criar Ocorrência</Link>
              </nav>
              <small className="text-muted">
                &copy; ViniSI 2025 &nbsp;&bull;&nbsp; Conteúdo exclusivo do ViniSI • Todos os direitos reservados
              </small>
            </div>

            <div className="text-end text-muted">
              <div>Contactos</div>
              <div>+351 123456789</div>
              <div>ViniSI@vini.com</div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer;
