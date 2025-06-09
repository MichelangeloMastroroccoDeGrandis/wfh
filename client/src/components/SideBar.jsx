import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import useFetchUserData from '../hooks/useFetchUserData';

const SideBar = () => {
    const { user } = useSelector((state) => state.auth);
    const { loading, error } = useFetchUserData();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="sidebar">

            <h2>WFH DIGITHAI</h2>
            {user.role === 'admin' && 
                <div>
                    <ul>
                        <li><Link to ="/">Dashboard</Link></li>
                        <li><Link to ="/approvals">Approvals</Link></li>
                        <li><Link to ="/holidays">Holiday</Link></li>
                        <li><Link to ="/team">Team</Link></li>
                        <li><Link to ="/company">Company</Link></li>
                    </ul>
                </div>
            }

            {user.role === 'approver' && 
                <div>
                    <ul>
                        <li><Link to ="/">Dashboard</Link></li>
                        <li><Link to ="/approvals">Approvals</Link></li>
                        <li><Link to ="/holidays">Holidays</Link></li>
                    </ul>
                </div>
            }

            {user.role === 'user' && 
                <div>
                    <ul>
                        <li><Link to ="/">Dashboard</Link></li>
                        <li><Link to ="/myaccount">My Account</Link></li>

                    </ul>
                </div>
            }
        
        </div>
    );
}

export default SideBar;