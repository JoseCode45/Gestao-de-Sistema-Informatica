// ProdutoCastas.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'; 
import './style.css'; 

const ProdutoCastas = ({ associadas, disponiveis, setAssociadas }) => {
  const [selectedCasta, setSelectedCasta] = useState('');

  const handleAdicionar = () => {
    if (!selectedCasta) return alert('Selecione uma casta');
    const castaObj = disponiveis.find(c => c.ID === Number(selectedCasta));
    if (castaObj && !associadas.some(c => c.ID === castaObj.ID)) {
      setAssociadas([...associadas, castaObj]);
      setSelectedCasta('');
    }
  };

  const handleRemover = (id) => {
    setAssociadas(associadas.filter(c => c.ID !== id));
  };

  return (
    <div className="mt-4">
      <h4>Castas do Produto</h4>

      <div className="d-flex mb-3 align-items-center">
        <select
          className="form-select me-2"
          value={selectedCasta}
          onChange={e => setSelectedCasta(e.target.value)}
        >
          <option value="">Selecione uma casta</option>
          {disponiveis.filter(c => !associadas.some(a => a.ID === c.ID)).map(c => (
            <option key={c.ID} value={c.ID}>{c.Nome}</option>
          ))}
        </select>
        <button type="button" className="btn btn-sm btn-primary" onClick={handleAdicionar}>Adicionar</button>
      </div>

      <table className=" table-bordered selec"   style={{borderColor: '#dee2e6',  // mesma cor padrão do Bootstrap para bordas
  }}>
        <thead>
          <tr>
            <th>Nome da Casta</th>
            <th style={{ width: '100px' }} className="text-center">Ação</th>
          </tr>
        </thead>
        <tbody>
          {associadas.length > 0 ? (
            associadas.map(c => (
              <tr key={c.ID}>
                <td>{c.Nome}</td>
                <td className="text-center align-middle">
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemover(c.ID)}>X</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="2">Nenhuma casta associada</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProdutoCastas;
