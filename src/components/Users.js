import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../Axios/axiosInstance';
import '../styles/Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editUser, setEditUser] = useState({});

  // جلب المستخدمين
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users', error);
        alert('❌ حدث خطأ أثناء جلب المستخدمين');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // البحث
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حذف المستخدم
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      await axiosInstance.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
      alert('✅ تم حذف المستخدم بنجاح');
    } catch (error) {
      console.error(error);
      alert('❌ حدث خطأ أثناء حذف المستخدم');
    }
  };

  // عند الضغط على تعديل
  const handleEditClick = (user) => {
    if (editUserId === user.id) {
      setEditUserId(null);
    } else {
      setEditUserId(user.id);
      // ✅ التأكد من أن numberCourse دائماً مصفوفة
      const numberCourse = Array.isArray(user.numberCourse) ? user.numberCourse : [];
      setEditUser({ 
        ...user, 
        password: '', 
        numberCourse: numberCourse
      });
    }
  };

  // حفظ التعديلات
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // إعداد البيانات
    const dataToSubmit = {
      name: editUser.name,
      email: editUser.email,
      numberCourse: editUser.numberCourse, // إرسال المصفوفة
    };

    // إرسال كلمة المرور فقط إذا تم تعديلها
    if (editUser.password) {
      dataToSubmit.password = editUser.password;
    }

    // إرسال الكود الخاص إذا تم تعديله
    if (editUser.user_code) {
      dataToSubmit.user_code = editUser.user_code;
    }

    try {
      const response = await axiosInstance.put(
        `/admin/users/${editUser.id}`,
        dataToSubmit,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ تحديث قائمة المستخدمين بالبيانات الجديدة
      setUsers(users.map((u) => (u.id === editUser.id ? response.data.user : u)));
      
      setEditUserId(null);
      alert('✅ تم تحديث بيانات المستخدم بنجاح');
    } catch (error) {
      console.error(error);
      alert('❌ حدث خطأ أثناء التحديث: ' + (error.response?.data?.message || error.message));
    }
  };

  // ✅ دالة لعرض numberCourse بشكل صحيح
  const displayNumberCourse = (numberCourse) => {
    if (!numberCourse || !Array.isArray(numberCourse) || numberCourse.length === 0) {
      return 'لا يوجد';
    }
    return numberCourse.join(', ');
  };

  return (
    <div className="users-page">
      <h3>📋 إدارة المستخدمين</h3>

      {/* البحث */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="ابحث عن مستخدم بالاسم..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <FaSearch />
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>البريد الإلكتروني</th>
                <th>الكود</th>
                <th>رقم الكورس</th>
                <th>تاريخ التسجيل</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.user_code}</td>
                      <td>{displayNumberCourse(user.numberCourse)}</td>
                      <td>{new Date(user.created_at).toLocaleDateString('ar-EG')}</td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(user)}
                        >
                          <FaEdit /> تعديل
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(user.id)}
                        >
                          <FaTrash /> حذف
                        </button>
                      </td>
                    </tr>

                    {/* النموذج المنسدل للتعديل */}
                    {editUserId === user.id && (
                      <tr className="edit-row">
                        <td colSpan="6">
                          <form onSubmit={handleSaveEdit} className="edit-dropdown">
                            <div className="form-group">
                              <label>الاسم:</label>
                              <input
                                type="text"
                                value={editUser.name}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, name: e.target.value })
                                }
                              />
                            </div>

                            <div className="form-group">
                              <label>البريد الإلكتروني:</label>
                              <input
                                type="email"
                                value={editUser.email}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, email: e.target.value })
                                }
                              />
                            </div>

                            <div className="form-group">
                              <label>كلمة المرور:</label>
                              <input
                                type="password"
                                value={editUser.password}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, password: e.target.value })
                                }
                                placeholder="اتركها فارغة إن لم تُرِد التعديل"
                              />
                            </div>

                            <div className="form-group">
                              <label>الكود الخاص:</label>
                              <input
                                type="text"
                                value={editUser.user_code || ''}
                                onChange={(e) =>
                                  setEditUser({ ...editUser, user_code: e.target.value })
                                }
                                placeholder="اتركه فارغاً إذا لم ترغب في تعديله"
                              />
                            </div>

                            {/* ✅ حقل numberCourse المُحسّن - واجهة تفاعلية */}
                            <div className="form-group">
                              <label>أرقام الكورسات:</label>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                                {editUser.numberCourse && editUser.numberCourse.length > 0 ? (
                                  editUser.numberCourse.map((num, index) => (
                                    <div 
                                      key={index}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: '#e3f2fd',
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        fontSize: '14px'
                                      }}
                                    >
                                      <span style={{ marginRight: '8px' }}>{num}</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newNumbers = editUser.numberCourse.filter((_, i) => i !== index);
                                          setEditUser({ ...editUser, numberCourse: newNumbers });
                                        }}
                                        style={{
                                          background: 'transparent',
                                          border: 'none',
                                          color: '#d32f2f',
                                          cursor: 'pointer',
                                          fontSize: '16px',
                                          padding: '0',
                                          lineHeight: '1'
                                        }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <small style={{ color: '#999' }}>لا توجد أرقام كورسات حالياً</small>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                  type="number"
                                  id={`course-input-${editUser.id}`}
                                  placeholder="أدخل رقم الكورس"
                                  style={{ flex: 1 }}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const input = document.getElementById(`course-input-${editUser.id}`);
                                      const value = parseInt(input.value);
                                      if (!isNaN(value) && value > 0) {
                                        const currentNumbers = editUser.numberCourse || [];
                                        if (!currentNumbers.includes(value)) {
                                          setEditUser({ 
                                            ...editUser, 
                                            numberCourse: [...currentNumbers, value] 
                                          });
                                        }
                                        input.value = '';
                                      }
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const input = document.getElementById(`course-input-${editUser.id}`);
                                    const value = parseInt(input.value);
                                    if (!isNaN(value) && value > 0) {
                                      const currentNumbers = editUser.numberCourse || [];
                                      if (!currentNumbers.includes(value)) {
                                        setEditUser({ 
                                          ...editUser, 
                                          numberCourse: [...currentNumbers, value] 
                                        });
                                      }
                                      input.value = '';
                                    }
                                  }}
                                  style={{
                                    padding: '8px 15px',
                                    background: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  ➕ إضافة
                                </button>
                              </div>
                              <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                                أدخل رقم الكورس ثم اضغط "إضافة" أو Enter
                              </small>
                            </div>

                            <div className="edit-actions">
                              <button type="submit" className="btn-save">💾 حفظ</button>
                              <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => setEditUserId(null)}
                              >
                                ❌ إلغاء
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    لا يوجد مستخدمين للعرض
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;