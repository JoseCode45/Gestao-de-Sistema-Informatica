const toggleEstado = async ({ id, estado, alteradorID, tipo, onSuccess }) => {
  const novoEstado = estado === 'Ativo' ? 'Inativo' : 'Ativo';
  const token = localStorage.getItem('token');

  try {
    if (novoEstado === 'Inativo') {
      await axios.delete(`${tipo}/${id}`, {
        data: { alteradorID },
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.patch(`${tipo}/${id}`, { alteradorID }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    if (onSuccess) {
      onSuccess(novoEstado);
    }
  } catch (err) {
    console.error('Erro ao alterar estado:', err);
    alert('Erro ao alterar estado.');
  }
};

export default toggleEstado;
