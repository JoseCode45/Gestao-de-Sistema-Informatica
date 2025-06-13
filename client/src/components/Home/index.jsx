import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../carrinho';

import { BASE_URL } from '../url';

import './style.css';

const token = localStorage.getItem('token');


const Home = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const {cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get(`${BASE_URL}/produto/disponivel`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setProdutos(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar produtos:", err);
        setError("Erro ao carregar dados.");
        setLoading(false);
      });
  }, []);

  const emPromocao = produtos.filter(p => p.EstadoID === 3);
  const restantes = produtos.filter(p => p.EstadoID !== 3);

  // Obter primeira promoção para o banner
  const bannerPromo = emPromocao.length > 0 ? emPromocao[0] : null;

  const desconto = (descontoTipo, DescontoValor, Preco) => {
    if (descontoTipo === 'percentual') {
      return Preco - (Preco * DescontoValor / 100)
    } else {
      return Preco - DescontoValor
    }

  };

  const renderProduto = (produto, index) => (
    <div key={index} className="produto-card">
      <img src="vinho.png" alt={produto.Nome} className="produto-imagem" />
      <div className="produto-info">
        <h4>{produto.Nome}</h4>
        <span className="stock">{produto.Stock} Disponíveis</span>
        <p className="castas-titulo"><strong>Castas: </strong></p>
        <p className="castas-body">{produto.Castas}</p>
        {produto.EstadoID === 3 && (
          <div className="promocao-etiqueta">
            {produto.Descontotipo === 'percentual' ? (
              <span><strong>{produto.DescontoValor}%</strong></span>
            ) : (
              <span><strong>-{produto.DescontoValor}€</strong></span>
            )}
          </div>
        )}
        <div className="precos">
          {produto.EstadoID === 3 && (
            <span className="preco-original">{produto.Preco}€</span>
          )}
          <br></br>
          <span className="preco-promocional">{desconto(produto.Descontotipo, produto.DescontoValor, produto.Preco)}€</span>
        </div>
            <button className="btn-comprar" onClick={() => addToCart({
      ProdutoID: produto.ID,
      Nome: produto.Nome,
      Preco: produto.Preco
    })}>
      Adicionar ao Carrinho
    </button>
        
      </div>
    </div>
  );

  return (
    <>
      <div className="Pagetop">
        <img src="LogoAlt.png" alt={'Logo'} className="logo-imagem" />
        <h2 className="Resumo">Plataforma de fornecimentos de vinhos de todo o país.
          As melhores ofertas vindas dos melhores parceiros comerciais de Portugal.</h2>
      </div>
      <div className="container-vinhos">
        <h2>Oferta Especial: </h2>
        {bannerPromo && (
          <section className="evento-banner">
            <h2>🍷 {bannerPromo.Motivo}</h2>
            <p>
              Descontos de 
              {bannerPromo.Descontotipo === 'percentual' ? (
                <span><strong> {bannerPromo.DescontoValor}% </strong></span>
              ) : (
                <span> -{bannerPromo.DescontoValor}€ </span>
              )}
              De {new Date(bannerPromo.DataInicio).toLocaleDateString()} até{' '}
              {new Date(bannerPromo.DataValidade).toLocaleDateString()} 
              <strong> em vários produtos</strong>
            </p>
          </section>
        )}

        <hr></hr>
        
        {emPromocao.length > 0 && (
          <div className="produtos-promocao">
            <h3>Destaques</h3>
            <div className="produtos-grid">
              {emPromocao.map(renderProduto)}
            </div>
          </div>
        )}

        <div className="produtos-outros">
          <hr></hr>
          <h3><strong>Outros vinhos</strong></h3>
          <hr></hr>
          <div className="produtos-grid">
            {restantes.map(renderProduto)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
