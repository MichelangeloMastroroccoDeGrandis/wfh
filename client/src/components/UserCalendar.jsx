import { useEffect, useState } from 'react';

const UserCalendar = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem('token');

  // Compute 14 dates: today to today+13
  const getDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const dates = getDates();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:5000/api/calendar', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users);
      setRequests(data.requests);
    };
    fetchData();
  }, []);

  const formatDate = (d) => d.toISOString().split('T')[0]; // yyyy-mm-dd

  const getCell = (userId, date) => {
    const dayStr = formatDate(date);
    const req = requests.find(
      (r) => r.user._id === userId && formatDate(new Date(r.date)) === dayStr
    );
    return req ? req.type.toUpperCase() : '';
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-lg font-semibold mb-4">Team WFH Calendar</h2>
      <table className="table-auto border w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1 text-left">Name</th>
            {dates.map((date) => (
              <th key={date} className="border px-2 py-1 text-sm">
                {date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="border px-2 py-1">{user.name}</td>
              {dates.map((date) => (
                <td key={date} className="border px-2 py-1 text-center">
                  {getCell(user._id, date)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserCalendar;
