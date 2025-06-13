import AdminUserTable from '../components/AdminUserTable';
import Wrapper from "../components/Wrapper";

const Team = () => {
    return (
        <Wrapper>
        <div className="team">
            <h1>Team</h1>
            <AdminUserTable />
        </div>
        </Wrapper>
    );
}
export default Team;