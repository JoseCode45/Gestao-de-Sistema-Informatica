// ClienteEncomendaProdutos.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

const ClienteEncomendaProdutos = ({ associados, produtosDisponiveis, setAssociados }) => {
  const [selectedProdutoID, setSelectedProdutoID] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const handleAdicionar = () => {
    if (!selectedProdutoID || !quantidade || isNaN(quantidade) || quantidade <= 0) {
      return alert('Selecione um produto e informe uma quantidade válida.');
    }

    const produtoObj = produtosDisponiveis.find(p => p.ID === Number(selectedProdutoID));
    if (!produtoObj) return;

    // Evitar duplicação
    if (associados.some(p => p.ProdutoID === produtoObj.ID)) {
      return alert('Este produto já foi adicionado.');
    }

    const valorUnitario = produtoObj.Preco || 0;
    const valorIVA = (valorUnitario*quantidade)*0.13|| 0;
    const total = (valorUnitario*quantidade) + valorIVA;
  
    

    const novoProduto = {
      ProdutoID: produtoObj.ID,
      Nome: produtoObj.Nome,
      Quantidade: Number(quantidade),
      ValorUnitario: valorUnitario,
      ValorIVA: valorIVA,
      Total: total
    };

    setAssociados([...associados, novoProduto]);
    setSelectedProdutoID('');
    setQuantidade('');
  };

  const handleRemover = (id) => {
    setAssociados(associados.filter(p => p.ProdutoID !== id));
  };

  return (
    <div className="mt-4">
      <h4>Produtos da Encomenda</h4>

      <div className="d-flex mb-3 align-items-center">
        <select
          className="form-select me-2"
          value={selectedProdutoID}
          onChange={e => setSelectedProdutoID(e.target.value)}
        >
          <option value="">Selecione um produto</option>
          {produtosDisponiveis.filter(p => !associados.some(a => a.ProdutoID === p.ID)).map(p => (
            <option key={p.ID} value={p.ID}>{p.Nome}</option>
          ))}
        </select>

        <input
          type="number"
          className="form-control me-2"
          placeholder="Quantidade"
          min="1"
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
        />

        <button type="button" className="btn btn-sm btn-primary" onClick={handleAdicionar}>Adicionar</button>
      </div>

      <table className="table-bordered selec cliente-encomenda-produtos-table" style={{ borderColor: '#dee2e6' }}>
        <thead>
          <tr>
            <th>Nome do Produto</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Valor IVA</th>
            <th>Total</th>
            <th className="text-center" style={{ width: '100px' }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {associados.length > 0 ? (
            associados.map(p => (
              <tr key={p.ProdutoID}>
                <td>{p.Nome}</td>
                <td>{p.Quantidade}</td>
                <td>{p.ValorUnitario} €</td>
                <td>{p.ValorIVA} €</td>
                <td>{p.Total} €</td>
                <td className="text-center align-middle">
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemover(p.ProdutoID)}>X</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">Nenhum produto adicionado</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteEncomendaProdutos;
