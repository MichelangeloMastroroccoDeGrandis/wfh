// client/components/AdminUserTable.jsx
import { useEffect, useState } from 'react';

const AdminUserTable = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState(['admin', 'approver', 'user']);
  const [passwords, setPasswords] = useState({});


  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();

      // Debugging log
      console.log("Fetched users:", data);

      // Ensure data is array
      if (!Array.isArray(data)) {
        throw new Error("Expected array but got: " + JSON.stringify(data));
      }

      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err.message);
      setUsers([]); // fallback to empty array
    }
  };

  fetchUsers();
}, []);


  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter(u => u._id !== id));
  };

  const handlePasswordChange = (id, value) => {
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };

  const updatePassword = async (id) => {
    const password = passwords[id];
    if (!password || password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const res = await fetch(`http://localhost:5000/api/admin/users/${id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Password updated');
      setPasswords((prev) => ({ ...prev, [id]: '' }));
    } else {
      alert(data.message || 'Error updating password');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t">
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
              <td>
                <input type="text" value={passwords[user._id] || ''}
                  onChange={(e) => handlePasswordChange(user._id, e.target.value)}
                  placeholder="Change Password"
                  
                />
                <button onClick={() => updatePassword(user._id)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserTable;
