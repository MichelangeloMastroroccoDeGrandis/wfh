import { useSelector } from "react-redux";

const SideBar = () => {
  const { user } = useSelector((state) => state.auth);

    console.log(user.role)

    return (
        <div className="sidebar">

            <h2>WFH DIGITHAI</h2>
            {user.role === 'admin' && 
                <div>
                    <ul>
                        <li>Dashboard</li>
                        <li>Approvals</li>
                        <li>Holiday</li>
                        <li>Team</li>
                        <li>Company</li>
                    </ul>
                </div>
            }

            {user.role === 'approver' && 
                <div>
                    <ul>
                        <li>Dashboard</li>
                        <li>Approvals</li>
                        <li>Holiday</li>
                    </ul>
                </div>
            }

            {user.role === 'user' && 
                <div>
                    <ul>
                        <li>Dashboard</li>
                        <li>My Account</li>

                    </ul>
                </div>
            }
        
        </div>
    );
}

export default SideBar;