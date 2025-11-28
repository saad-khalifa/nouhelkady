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
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      const res = await axiosInstance.get("/check-auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("فشل التحقق من المصادقة:", err);
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      // محاولة الحصول على CSRF token
      try {
        await axiosInstance.get("/sanctum/csrf-cookie");
        console.log("✅ تم الحصول على CSRF token");
      } catch (csrfError) {
        console.warn("⚠️ تحذير CSRF:", csrfError);
        // نستمر حتى بدون CSRF
      }

      const res = await axiosInstance.post("/login", { 
        email, 
        password 
      });

      console.log("✅ استجابة تسجيل الدخول:", res.data);

      if (res.data.token) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        setToken(token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      } else {
        return { 
          success: false, 
          message: res.data.message || "بيانات الدخول غير صحيحة" 
        };
      }
    } catch (error) {
      console.error("❌ خطأ تسجيل الدخول:", error);
      
      let errorMessage = "خطأ في تسجيل الدخول";
      
      if (error.response?.status === 500) {
        errorMessage = "مشكلة في الخادم. يرجى المحاولة لاحقاً";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, password_confirmation) => {
    try {
      setLoading(true);

      // CSRF token
      try {
        await axiosInstance.get("/sanctum/csrf-cookie");
      } catch (csrfError) {
        console.warn("⚠️ تحذير CSRF:", csrfError);
      }

      const res = await axiosInstance.post("/register", {
        name, email, password, password_confirmation,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(res.data.user);

      return { success: true };
    } catch (error) {
      console.error("خطأ التسجيل:", error);
      return {
        success: false,
        message: error.response?.data?.message || "خطأ في التسجيل"
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("خطأ أثناء تسجيل الخروج:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

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
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};