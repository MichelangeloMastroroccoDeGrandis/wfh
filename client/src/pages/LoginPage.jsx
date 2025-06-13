import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/LoginPage.module.css";
import logo from '../assets/logo_no_text.png';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ✅ Pull all auth values from Redux
  const { token, user, loading, error } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  // ✅ Redirect after successful login
  useEffect(() => {
    if (token && user) { 
        navigate('/');
    }
  }, [token, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      dispatch(loginSuccess(res.data));
    } catch (err) {
      dispatch(loginFailure('Invalid credentials'));
    }
  };

 

  return (
    <div className={styles.container}>
      <img className={styles.logo} src={logo} alt="Logo" width={100} />
      <h2>WFH</h2>
      <form className={styles.form} onSubmit={handleLogin}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

      </form>
    </div>
  );
};

export default LoginPage;
