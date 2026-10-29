import { Navigate } from "react-router-dom";

// ! 

const ProtectedRoute = ({ isloggin, children }) => {
  if (!isloggin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
