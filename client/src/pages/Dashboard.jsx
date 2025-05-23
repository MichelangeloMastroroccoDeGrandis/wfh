import { useSelector } from 'react-redux';
import AdminPage from './AdminPage';
import ApproverPage from './ApproverPage';
import UserPage from './UserPage';
import useFetchUserData from '../hooks/useFetchUserData';
import Wrapper from '../components/Wrapper';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);  
    const { loading, error } = useFetchUserData(); 

  if (loading) return <p >Loading...</p>;
  if (error) return <p >{error}</p>;

  return (
    <Wrapper>

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

    </Wrapper>
  );
};

export default Dashboard;
