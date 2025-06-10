// FornecedorProduto.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'; 
import './style.css'; // mesmo se não existir, para manter padrão

const FornecedorProduto = ({ associadas, disponiveis, setAssociadas }) => {
  const [selectedProduto, setSelectedProduto] = useState('');

  const handleAdicionar = () => {
    if (!selectedProduto) return alert('Selecione um produto');
    const produtoObj = disponiveis.find(p => p.ID === Number(selectedProduto));
    if (produtoObj && !associadas.some(p => p.ID === produtoObj.ID)) {
      setAssociadas([...associadas, produtoObj]);
      setSelectedProduto('');
      console.log('Produtos associados:', associadas);

    }
  };

  const handleRemover = (id) => {
    setAssociadas(associadas.filter(p => p.ID !== id));
  };

  return (
    <div className="mt-4">
      <h4>Produtos fornecidos</h4>

      <div className="d-flex mb-3 align-items-center">
        <select
          className="form-select me-2"
          value={selectedProduto}
          onChange={e => setSelectedProduto(e.target.value)}
        >
          <option value="">Selecione um produto</option>
          {disponiveis
            .filter(p => !associadas.some(a => a.ID === p.ID))
            .map(p => (
              <option key={p.ID} value={p.ID}>{p.Nome}</option>
            ))
          }
        </select>
        <button 
          type="button" 
          className="btn btn-sm btn-primary" 
          onClick={handleAdicionar}
        >
          Adicionar
        </button>
      </div>

      <table className="table table-bordered selec" style={{ borderColor: '#dee2e6' }}>
        <thead>
          <tr>
            <th>Nome do Produto</th>
            <th style={{ width: '100px' }} className="text-center">Ação</th>
          </tr>
        </thead>
        <tbody>
          {associadas.length > 0 ? (
            associadas.map(p => (
              <tr key={p.ID}>
                <td>{p.Nome}</td>
                <td className="text-center align-middle">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleRemover(p.ID)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">Nenhum produto associado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FornecedorProduto;
