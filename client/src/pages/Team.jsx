import AdminUserTable from '../components/AdminUserTable';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Wrapper from "../components/Wrapper";
import CreateUserModal from '../components/CreateUserModal';

const Team = () => {
    const { user, token } = useSelector(state => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);


    return (
        <Wrapper>
        <div className="team">
            <h1>Team</h1>
            <button onClick={() => setIsModalOpen(true)}>+ Create User</button>
            <AdminUserTable />
            <CreateUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUserCreated={() => alert('User created!')}
                token={token}
            />
        </div>
        </Wrapper>
    );
}
export default Team;