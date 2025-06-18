import { useState } from "react";
import axios from "axios";

const CreateUserModal = ({ isOpen, onClose, onUserCreated, token }) => {

    const roles = ['user', 'approver', 'admin'];
    const positions = ['Dev', 'CTO', 'CEO', 'COO', 'HR'];

    const [formData, setFormData] = useState({
        name: '',
    email: '',
    password: '',
    role: '',
    position: '',
    team: '',
    office: '',
    country: ''
  });

  const [error, setError] = useState('');

  const validateForm = () => {
    const { name, email, password, role } = formData;
    if (!name || !email || !password || !role) {
      return 'All required fields must be filled.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Invalid email format.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return null;
  };

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

        try {
            await axios.post('http://localhost:5000/api/auth/register', formData, { 
                headers: {Authorization: `Bearer ${token}` }
            });
            onUserCreated(); // Notify parent component
            onClose(); // Close modal
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user. Please try again.');
        }
    };

    if(!isOpen) {
        return null; // Don't render anything if modal is closed
    }

    return (
        <div >
      <div className="modal">
        <h3>Create New User</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} required />

          {/* Role Dropdown */}
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Position Dropdown */}
          <select name="position" value={formData.position} onChange={handleChange}>
            <option value="">Select Position</option>
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>

          {/* Optional Inputs */}
          <input name="team" placeholder="Team" value={formData.team} onChange={handleChange} />
          <input name="office" placeholder="Office" value={formData.office} onChange={handleChange} />
          <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} />

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
    )
}

export default CreateUserModal;