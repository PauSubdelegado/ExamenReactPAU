import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../auth/AuthContext.jsx';
import { useEffect,useState } from "react";
import "../index.css";



const Header = () => {

  const { logout,isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [userName,setUserName] = useState("");



useEffect(() =>{
  if (user){
 setUserName(user.name);
  }
},[user])

  const handleLogout = () => {
    logout();
    setUserName("");
    navigate('/login', { replace: true });
  }


  return (
    /* CAMBIO 1: Cambiado 'header' por 'nav' con las clases necesarias de Bootstrap Navbar */
    
     <header className="tablon-header d-flex align-items-center justify-content-between px-4 py-3">
          <div className="d-flex align-items-center gap-2">
        
    <nav className="navbar navbar-expand-lg navbar-dark bg-cork-dark border-cork px-4 py-3">
      <div className="container-fluid">
        
        {/* Marca / Título */}
        <span className="navbar-brand mb-0 h1 text-light">
          📌 Tablón de anuncios
        </span>

        {/* Botón Hamburguesa (Ahora sí funcionará y se alineará a la derecha en móviles) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenedor colapsable */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          {/* CAMBIO 2: Añadido text-light o nav-link correcto para asegurar visibilidad */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2 mt-3 mt-lg-0">

            <li className="nav-item">
              <Link className="nav-link text-light" to="/home">
                Tauler d'anuncis
              </Link>
            </li>

            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                <Link className="nav-link text-light" to="/registro">
                  Registro
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-light" to="/login">
                  Login
                </Link>
              </li>
                </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/area-personal">
                    Àrea Personal
                  </Link>
                </li>

                {/* Botón Logout */}
                <li className="nav-item my-2 my-lg-0">
                  <button
                    className="btn btn-outline-light btn-sm w-100 w-lg-auto"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

          </ul>

          <p className=" text-light m-2">usuario: {userName}</p>
        </div>

      </div>
    </nav>
 
 </div>
 </header>
  );
};

export default Header;