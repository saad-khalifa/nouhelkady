import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // طباعة للتشخيص - احذفها لاحقاً
  console.log("=== Debug ProtectedAdminRoute ===");
  console.log("Loading:", loading);
  console.log("User:", user);
  console.log("is_admin:", user?.is_admin);
  console.log("typeof is_admin:", typeof user?.is_admin);
  console.log("================================");

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("❌ No user - redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // تحقق من is_admin بطرق مختلفة (قد يكون string أو number)
  const isAdmin = user.is_admin === 1 || 
                  user.is_admin === "1" || 
                  user.is_admin === true;

  if (!isAdmin) {
    console.log("❌ Not admin - redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("✅ Admin access granted");
  return children;
};

export default ProtectedAdminRoute;