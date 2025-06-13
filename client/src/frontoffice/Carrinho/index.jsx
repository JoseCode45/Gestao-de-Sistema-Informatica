import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../components/url';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../components/carrinho';

import 'bootstrap/dist/css/bootstrap.min.css';  // importe o CSS do Bootstrap

const Carrinho = () => {
    const { cart, updateQuantity, clearCart, removeFromCart } = useContext(CartContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

        // Função para calcular preço com desconto
    const desconto = (descontoTipo, DescontoValor, Preco) => {
        if (descontoTipo === 'percentual') {
            return Preco - (Preco * DescontoValor / 100);
        } else {
            return Preco - DescontoValor;
        }
    };

const IVA = 0.13;
    // Estado para guardar os produtos completos com detalhes atualizados
    const [produtosCarrinho, setProdutosCarrinho] = useState([]);

    // Recalcula totais com base nos produtos atualizados (com desconto e quantidade)
    const totalProdutos = produtosCarrinho.reduce(
        (sum, p) => sum + (p.Descontotipo ? desconto(p.Descontotipo, p.DescontoValor, p.Preco) : p.Preco) * p.quantity, 0);
    const totalImpostos = totalProdutos * IVA; // IVA 13%
    const totalTransporte = produtosCarrinho.length > 0 ? 5.00 : 0;
    const totalEncomenda = totalProdutos + totalImpostos + totalTransporte;


    // Buscar produtos disponíveis e combinar com o carrinho
useEffect(() => {
  const fetchProdutos = async () => {

    if (cart.length === 0) {
      setProdutosCarrinho([]);
      return;
    }

    try {
        //Obter lista de produtos existentes
      const resp = await axios.get(`${BASE_URL}/produto/disponivel`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const produtosDisponiveis = resp.data;

      //Obter produtos da lista de produtos existentes
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


    // Função para concluir a compra
const handleCheckout = async () => {
    console.log(BASE_URL)
  try {
    const resp = await axios.post(`${BASE_URL}/cliente-encomenda/encomendas/confirmar`, {
      carrinho: produtosCarrinho.map(p => ({
        ProdutoID: p.ID,
        quantity: p.quantity,
      })),
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    clearCart();
    navigate(`/encomenda/${resp.data.encomendaID}`);
  } catch (err) {
    console.error(err);
    alert('Erro ao concluir a compra.');
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
                                const precoComDesconto = desconto(p.Descontotipo, p.DescontoValor, p.Preco);
                                const precoIVA = precoComDesconto * p.quantity * IVA;
                                const precoTotal = precoComDesconto * p.quantity + precoIVA;

                                return (
                                    <tr key={p.ID}>
                                        <td>{p.Nome}</td>
                                        <td>{precoComDesconto} €</td>
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
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => removeFromCart(p.ID)}
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <hr />

                    <p><strong>Total Produtos:</strong> {totalProdutos.toFixed(2)} €</p>
                    <p><strong>Total Impostos:</strong> {totalImpostos.toFixed(2)} €</p>
                    <p><strong>Transporte:</strong> {totalTransporte} €</p>
                    <h3><strong>Total Encomenda:</strong> {totalEncomenda.toFixed(2)} €</h3>

                    <button className="btn btn-primary me-2" onClick={handleCheckout}>Concluir Compra</button>
                    <button className="btn btn-outline-danger" onClick={clearCart}>Apagar Carrinho</button>
                </>
            )}
        </div>
    );
};

export default Carrinho;
