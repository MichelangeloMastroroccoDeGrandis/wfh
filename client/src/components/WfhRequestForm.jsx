import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SectionWrap from './SectionWrap';

const WfhRequestForm = () => {
  const [type, setType] = useState('wfh');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState(null);
  const { token } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/wfh/request', { type, date }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error submitting request.');
    }
  };

  return (
    <SectionWrap>
    <form onSubmit={handleSubmit} >
      <h3 className="text-xl font-semibold mb-2">Request Time Off</h3>

      <select value={type} onChange={(e) => setType(e.target.value)} >
        <option value="wfh">Work From Home</option>
        <option value="sick">Sick Leave</option>
        <option value="timeoff">Time Off</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        
        required
      />

      <button type="submit" >
        Submit Request
      </button>

      {message && <p >{message}</p>}
    </form>
    </SectionWrap>
  );
};

export default WfhRequestForm;
