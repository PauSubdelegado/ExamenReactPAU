import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const urlApi = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);
let logoutTimer;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (jwt) => {
    const decoded = jwtDecode(jwt);

    localStorage.setItem("token", jwt);
    setToken(jwt);
    axios
      .get(`${urlApi}/auth/me`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        const userData = response.data.data ?? response.data.user ?? response.data ?? null;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      });
    //setClient(decoded);

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
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(storedToken);

      if (decoded.exp * 1000 < Date.now()) {
        logout();
        setLoading(false);
        return;
      }

      setToken(storedToken);
      const rawUser = localStorage.getItem("user");
      setUser(
        rawUser && rawUser !== "undefined" && rawUser !== "null"
          ? JSON.parse(rawUser)
          : null,
      );
      startLogoutTimer(decoded.exp);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);