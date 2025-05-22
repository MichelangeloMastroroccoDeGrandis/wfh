import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

console.log(user);
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className={styles.navbar}>
        <h2>Welcome, {user.name}</h2>
        <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
