import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import NotAuthorized from './pages/NotAuthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ApproverPage from './pages/ApproverPage';
import UserPage from './pages/UserPage';

function App() {


  return (

    <>
       <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['approver']} />}>
          <Route path="/approver" element={<ApproverPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user" element={<UserPage />} />
        </Route>

        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </>

  );
}

export default App;
