import SideBar from "./SideBar";
import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";
import styles from '../styles/Dashboard.module.css'; 

const Wrapper = ({ children }) => {

const isInLoginPage = useLocation().pathname === '/login';

  return (
    <main className={styles.dashboard}>
    <SideBar className={styles.sideBar} />
    <div className={styles.mainContent}>
    {!isInLoginPage && <Navbar />}
        {children}
    </div>
    </main>
  );
}

export default Wrapper;