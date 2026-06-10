import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const urlApi = import.meta.env.VITE_APP_API_URL;

const AuthContext = createContext(null);
let logoutTimer;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUsert] = useState(null);

  const login = (jwt) => {
    const decoded = jwtDecode(jwt);

    localStorage.setItem("token", jwt);
    setToken(jwt);
    axios.get(`{urlApi}auth/me`, {
      headers: {
        Accept : 'application/json',
        Authorization: `Bearer ${jwt}`
      }
    }).then (response => {
      localStorage.setItem("user", JSON.stringify(response.data.data));
      setClient(response.data.data);
    });


    startLogoutTimer(decoded.exp);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    clearTimeout(logoutTimer);
  };

  const startLogoutTimer = (exp) => {
    const expiresInMs = exp * 1000 - Date.now();
    if (expiresInMs <= 0) return logout();
    logoutTimer = setTimeout(logout, expiresInMs);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    try {
      const decoded = jwtDecode(storedToken);

      if (decoded.exp * 1000 < Date.now()) return logout();

      setToken(storedToken);
      setUser(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
      startLogoutTimer(decoded.exp);
    } catch {
      logout();
    }
   

  }, []);
  

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
