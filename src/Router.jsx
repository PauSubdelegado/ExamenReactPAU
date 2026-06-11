
import { createBrowserRouter } from "react-router-dom";
// layouts
import Layout from "./Layout";
// Guards
import ProtectedRoute from "./guards/ProtectedRoute";
// Pages    
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AreaPersonal from "./pages/AreaPersonal";
import Login from "./pages/Login";
import Registro from "./pages/Registro";    

export const Router = createBrowserRouter([
   {
    path: "/",
    element: <Layout />, // Todas las rutas usan este Layout
    children: [
      // --- RUTAS PÚBLICAS ---
      { index: true, element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "registro", element: <Registro /> },

      // --- RUTAS PROTEGIDAS ---
      // Creamos un nodo que no tiene path propio, solo aplica el filtro de protección
      {
        element: <ProtectedRoute />, 
        children: [
          { path: "home", element: <Home /> },
          { path: "area-personal", element: <AreaPersonal /> }
        ]
      },

      // --- 404 (Al final para que no pise el resto) ---
      { path: "*", element: <NotFound /> }
    ]
  }
]);