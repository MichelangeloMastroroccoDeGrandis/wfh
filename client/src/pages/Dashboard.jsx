import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      }
    };

    fetchDashboard();
  }, [token]);


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!data) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Position:</strong> {user.position}</p>
      <p><strong>Team:</strong> {user.team}</p>

      {/* Role-Based Display */}
      {data.role === 'admin' && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold">Admin Tools</h2>
          <p>Access user management, settings, etc.</p>
        </div>
      )}

      {data.role === 'approver' && (
        <div className="mt-6 p-4 bg-blue-100 rounded">
          <h2 className="text-xl font-semibold">Approver Tools</h2>
          <p>Review and approve WFH requests.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
