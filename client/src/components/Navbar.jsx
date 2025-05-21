import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
            <Link to="/dashboard">Dashboard</Link>
            {user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            {user?.role === 'approver' && <Link to="/approver">Approver</Link>}
            {user?.role === 'user' && <Link to="/user">User</Link>}
            <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
