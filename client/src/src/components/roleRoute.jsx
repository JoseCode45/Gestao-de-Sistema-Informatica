// components/RoleRoute.js
import { Navigate } from 'react-router-dom';

const RoleRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userRole = decodedToken.cargo;

    //Caso não tenha nenhum input, permitirá qualquer utilizador com cargo.
    if (!allowedRoles) {
    return children;
    }

    //Verifica se o utilizador possui o role.
    return allowedRoles.includes(userRole) ? children : <Navigate to="/" />;
  } catch {
    return <Navigate to="/login" />;
  }
};

export default RoleRoute;
