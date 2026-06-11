import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";


const AreaPersonal = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="position-relative p-2" style={{ zIndex: 1 }}>
      <h1>Área Personal</h1>
      {user && (
        <div>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <button onClick={handleLogout} className="btn btn-danger mt-2">
        Cerrar sesión
      </button>
    </div>
  )
}

export default AreaPersonal