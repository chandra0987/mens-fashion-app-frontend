import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();

  // ✅ Fix localStorage JSON error
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // REGISTER
  const register = async (formData) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:3020/api/auth/register",
        formData
      );

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);
      

      return { success: true };

    } catch (error) {
      setLoading(false);

      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // LOGIN
  const login = async (formData) => {
    
    try {
      setLoading(true);

      const  response = await axios.post(
        "http://localhost:3020/api/auth/login",
        formData
      );
console.log('Login response:', response.data);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));

      setLoading(false);

    

      return { success: true, user: response.data };

    } catch (error) {
      setLoading(false);

      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        register,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};




