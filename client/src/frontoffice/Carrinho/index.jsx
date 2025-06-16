import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../components/url';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../components/carrinho';

import 'bootstrap/dist/css/bootstrap.min.css';

const Carrinho = () => {
  const { cart, updateQuantity, clearCart, removeFromCart } = useContext(CartContext);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [morada, setMorada] = useState('');
  const [horarioEntrega, setHorarioEntrega] = useState('12:00');
  const [transportadoraID, setTransportadoraID] = useState('');
  const [transportadoras, setTransportadoras] = useState([]);

  const desconto = (descontoTipo, DescontoValor, Preco) => {
    if (descontoTipo === 'percentual') {
      return Preco - (Preco * DescontoValor / 100);
    } else {
      return Preco - DescontoValor;
    }
  };

  const IVA = 0.13;
  const [produtosCarrinho, setProdutosCarrinho] = useState([]);

  const totalProdutos = produtosCarrinho.reduce(
    (sum, p) => sum + (p.Descontotipo ? desconto(p.Descontotipo, p.DescontoValor, p.Preco) : p.Preco) * p.quantity, 0);
  const totalImpostos = totalProdutos * IVA;
  const totalTransporte = produtosCarrinho.length > 0 ? 5.00 : 0;
  const totalEncomenda = totalProdutos + totalImpostos + totalTransporte;

  useEffect(() => {
    const fetchProdutos = async () => {
      if (cart.length === 0) {
        setProdutosCarrinho([]);
        return;
      }

      try {
        const resp = await axios.get(`${BASE_URL}/produto/disponivel`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const produtosDisponiveis = resp.data;

        const atualizados = cart.map(item => {
          const produtoDetalhado = produtosDisponiveis.find(p => p.ID === item.ProdutoID);
          if (!produtoDetalhado) return null;

          return {
            ...produtoDetalhado,
            quantity: item.quantity
          };
        }).filter(Boolean);

        setProdutosCarrinho(atualizados);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      }
    };

    fetchProdutos();
  }, [cart, token]);

  useEffect(() => {
    const fetchTransportadoras = async () => {
      try {
        const resp = await axios.get(`${BASE_URL}/transportadora`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransportadoras(resp.data);
      } catch (err) {
        console.error('Erro ao buscar transportadoras:', err);
      }
    };

    fetchTransportadoras();
  }, [token]);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!morada || !horarioEntrega || !transportadoraID) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const resp = await axios.post(`${BASE_URL}/cliente-encomenda/encomendas/confirmar`, {
        carrinho: produtosCarrinho.map(p => ({
          ProdutoID: p.ID,
          quantity: p.quantity,
        })),
        morada: morada,
        horarioEntrega: horarioEntrega,
        transportadoraID: Number(transportadoraID),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      clearCart();
      navigate(`/encomendas/view/${resp.data.encomendaID}`);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(`Erro: ${err.response.data.message}`);
      } else {
        alert('Erro ao concluir a compra.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Meu Carrinho</h1>

      {produtosCarrinho.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <>
          <table className="table table-hover table-striped">
            <thead>
              <tr>
                <th>Nome do Vinho</th>
                <th>Preço Unitário (€)</th>
                <th>Quantidade</th>
                <th>Preço IVA (€)</th>
                <th>Preço Total (€)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosCarrinho.map(p => {
                const precoComDesconto = p.EstadoID === 3? desconto(p.Descontotipo, p.DescontoValor, p.Preco) : p.Preco;
                const precoIVA = precoComDesconto * p.quantity * IVA;
                const precoTotal = precoComDesconto * p.quantity + precoIVA;

                return (
                  <tr key={p.ID}>
                    <td>{p.Nome}</td>
                    <td>{Number(precoComDesconto).toFixed(2)} €</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={p.quantity}
                        max={p.Stock}
                        onChange={e => updateQuantity(p.ID, +e.target.value)}
                        style={{ width: '70px' }}
                        className="form-control"
                      />
                    </td>
                    <td>{precoIVA.toFixed(2)} €</td>
                    <td>{precoTotal.toFixed(2)} €</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(p.ID)}>
                        Remover
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <hr />

          <div className="mb-3">
            <label>Morada de Entrega *</label>
            <input
              type="text"
              className="form-control"
              value={morada}
              onChange={e => setMorada(e.target.value)}
              required
              min={6}
            />
          </div>

          <div className="mb-3">
            <label>Transportadora *</label>
            <select
              className="form-select"
              value={transportadoraID}
              onChange={e => setTransportadoraID(e.target.value)}
              required
            >
              <option value="">Selecione uma transportadora</option>
              {transportadoras.map(t => (
                <option key={t.ID} value={t.ID}> {t.Nome} </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Horário Preferido de Entrega *</label>
            <input
              type="time"
              className="form-control"
              value={horarioEntrega}
              onChange={e => setHorarioEntrega(e.target.value)}
              required
            />
          </div>

          <hr />

          <p><strong>Total Produtos:</strong> {totalProdutos.toFixed(2)} €</p>
          <p><strong>Total Impostos:</strong> {totalImpostos.toFixed(2)} €</p>
          <p><strong>Transporte:</strong> {totalTransporte.toFixed(2)} €</p>
          <h3><strong>Total Encomenda:</strong> {totalEncomenda.toFixed(2)} €</h3>

          <button className="btn btn-primary me-2" onClick={handleCheckout}>Concluir Compra</button>
          <button className="btn btn-outline-danger" onClick={clearCart}>Apagar Carrinho</button>
        </>
      )}
    </div>
  );
};

export default Carrinho;
