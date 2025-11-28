import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../Axios/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance
        .get("/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // تأكد أن البيانات تحتوي على is_admin
          setUser(res.data.user);
        })
        .catch((err) => {
          console.error("غير مسجل دخول:", err.response?.data);
          localStorage.removeItem("token");
          localStorage.removeItem("user_code");
          setUser(null);
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);

      const userRes = await axiosInstance.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // تأكد أن is_admin موجود في البيانات
      setUser(userRes.data);

      if (userRes.data.user_code) {
        localStorage.setItem("user_code", userRes.data.user_code);
      }

      return { success: true, user: userRes.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "خطأ في تسجيل الدخول",
      };
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      const res = await axiosInstance.post("/register", {
        name, email, password, password_confirmation,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);

      const userRes = await axiosInstance.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      if (userRes.data.user_code) {
        localStorage.setItem("user_code", userRes.data.user_code);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "خطأ في التسجيل",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_code");
    setToken(null);
    setUser(null);
  };

  // دالة للتحقق من صلاحية الأدمن
  const isAdmin = () => {
    return user?.is_admin === 1;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        setUser,
        setToken,
        isAdmin, // إضافة دالة التحقق
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};