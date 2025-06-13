// FornecedorDistrito.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'; 
import './style.css'; // mesmo se não existir, para manter padrão

const TransportadoraDistrito = ({ associadas, disponiveis, setAssociadas }) => {
  const [selectedDistrito, setSelectedDistrito] = useState('');

  const handleAdicionar = () => {
    if (!selectedDistrito) return alert('Selecione um distrito');
    const distritoObj = disponiveis.find(p => p.ID === Number(selectedDistrito));
    if (distritoObj && !associadas.some(p => p.ID === distritoObj.ID)) {
      setAssociadas([...associadas, distritoObj]);
      setSelectedDistrito('');
      console.log('Distritos associados:', associadas);

    }
  };

  const handleRemover = (id) => {
    setAssociadas(associadas.filter(p => p.ID !== id));
  };

  return (
    <div className="mt-4">
      <h4>Distritos fornecidos</h4>

      <div className="d-flex mb-3 align-items-center">
        <select
          className="form-select me-2"
          value={selectedDistrito}
          onChange={e => setSelectedDistrito(e.target.value)}
        >
          <option value="">Selecione um distrito</option>
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
            <th>Nome do distrito</th>
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
              <td colSpan="2">Nenhum distrito associado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransportadoraDistrito;
