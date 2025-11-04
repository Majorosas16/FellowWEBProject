import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //Traemos el usuario y el isLoading del store
  const user = useSelector((state: RootState) => state.auth.userID);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  //Si está cargando, muestra un mensaje de carga
  if (isLoading) {
    return <div>Cargando....</div>;
  }

  //Si no hay usuario, redirige al registro
  if (!user) {
    return <Navigate to="/" replace />;
  }

   //Si hay usuario, muestra los hijos (rutas protegidas)
  return children;
};
