import React, { useState, useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // إعادة تعيين الخطأ عند محاولة تسجيل الدخول

    const result = await login(email, password);
    
    if (result.success) {
      // بعد النجاح، التوجيه إلى الصفحة الرئيسية
      navigate("/");
    } else {
      // في حالة الخطأ
      setLoading(false);
      setError(result.message);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">تسجيل الدخول</h2>
          <p className="login-subtitle">مرحباً بك مرة أخرى!</p>
        </div>

        {/* عرض رسالة الخطأ إذا كانت موجودة */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              className="form-input"
              placeholder="أدخل بريدك الإلكتروني"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">كلمة المرور</label>
            <input
              type="password"
              className="form-input"
              placeholder="أدخل كلمة المرور"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn-login" 
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span> // إضافة مؤثر التحميل
            ) : (
              "دخول"
            )}
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">أو</span>
        </div>

        <button 
          onClick={goToRegister} 
          className="btn-register"
        >
          إنشاء حساب جديد
        </button>
      </div>
    </div>
  );
}
