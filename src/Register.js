import React, { useState, useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import './styles/Register.css';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== password_confirmation) {
      setLoading(false);
      setError("كلمة المرور وتأكيدها غير متطابقين");
      return;
    }

    const result = await register(name, email, password, password_confirmation);

    if (result.success) {
      navigate("/");
    } else {
      setLoading(false);
      setError(result.message);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">إنشاء حساب جديد</h2>
          <p className="register-subtitle">انضم إلينا الآن!</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">الاسم الكامل</label>
            <input
              type="text"
              className="form-input"
              placeholder="أدخل اسمك الكامل"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              className="form-input"
              placeholder="example@mail.com"
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

          <div className="form-group">
            <label className="form-label">تأكيد كلمة المرور</label>
            <input
              type="password"
              className="form-input"
              placeholder="أعد كتابة كلمة المرور"
              required
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn-register"
            disabled={loading}
          >
            {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">لديك حساب بالفعل؟</span>
        </div>

        <button 
          onClick={goToLogin} 
          className="btn-login"
        >
          تسجيل دخول
        </button>
      </div>
    </div>
  );
}