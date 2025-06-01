import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import UserSidebar from '../../components/UserSidebar';

const GENDERS = [
  { value: '', label: 'Chọn giới tính' },
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
];

const ProfileEdit = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    city: '',
    email: '',
    phoneNumber: '',
    nationality: ''
  });

  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Lấy dữ liệu user từ localStorage hoặc API
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
        city: user.city || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        nationality: user.nationality || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật thông tin thất bại');
      }
      
      // Cập nhật lại localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data.user }));
      
      toast.success(data.message || 'Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Cập nhật thông tin thất bại');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/sign-in';
  };

  const ChangePasswordForm = () => {
    const [form, setForm] = useState({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (form.newPassword !== form.confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp');
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            oldPassword: form.oldPassword, 
            newPassword: form.newPassword 
          })
        });
        
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Đổi mật khẩu thất bại');
        }
        
        toast.success(data.message || 'Đổi mật khẩu thành công!');
        setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) {
        console.error('Error changing password:', err);
        toast.error(err.message || 'Đổi mật khẩu thất bại');
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Mật khẩu hiện tại</label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Cài đặt</h2>
          <div className="flex border-b mb-6">
            <button
              className={`px-4 py-2 font-semibold ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
              onClick={() => setActiveTab('profile')}
            >
              Thông tin tài khoản
            </button>
            <button
              className={`px-4 py-2 font-semibold ${activeTab === 'security' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
              onClick={() => setActiveTab('security')}
            >
              Mật khẩu & Bảo mật
            </button>
          </div>
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Họ</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Tên</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Giới tính</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    {GENDERS.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">Thành phố cư trú</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Quốc tịch</label>
                <input
                  type="text"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Số điện thoại</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-gray-300 bg-gray-100 hover:bg-gray-200"
                  onClick={() => window.history.back()}
                >
                  Có lẽ để sau
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
                >
                  Lưu
                </button>
              </div>
            </form>
          )}
          {activeTab === 'security' && <ChangePasswordForm />}
        </div>
      </main>
    </div>
  );
};

export default ProfileEdit; 