import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import AdminPage from './AdminPage';
import ApproverPage from './ApproverPage';
import UserPage from './UserPage';
import styles from '../styles/Dashboard.module.css'; 
import useFetchUserData from '../hooks/useFetchUserData';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const isInLoginPage = useLocation().pathname === '/login';  
    const { loading, error } = useFetchUserData(); 

  if (loading) return <p >Loading...</p>;
  if (error) return <p >{error}</p>;

  return (
    <main className={styles.dashboard}>
    <SideBar className={styles.sideBar} />
        <div className={styles.mainContent}>
            {!isInLoginPage && <Navbar />}

        {/* Role-Based Display */}
        {user.role === 'admin' && (
            <AdminPage />
        )}

        {user.role === 'approver' && (
            <ApproverPage />
        )}

        {user.role === 'user' && (
            <UserPage />
        )}
        </div>
    </main>
  );
};

export default Dashboard;
