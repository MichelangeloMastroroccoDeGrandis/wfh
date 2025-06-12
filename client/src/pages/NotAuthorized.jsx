import { Link } from 'react-router-dom';

const NotAuthorized = () => (
  <div className="p-4 text-center">
    <h1 className="text-2xl font-bold text-red-600">🚫 Not Authorized</h1>
    <p>You do not have permission to view this page.</p>
    <Link to="/" className="text-blue-600 underline">Go back to dashboard</Link>
  </div>
);

export default NotAuthorized;
