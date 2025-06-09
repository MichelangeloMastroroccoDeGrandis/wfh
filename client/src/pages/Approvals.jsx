import Wrapper from "../components/Wrapper";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingRequests, approveRequest, rejectRequest  } from '../app/approvalsSlice';

const Approvals = () => {   
    const dispatch = useDispatch();
    const { requests, loading, error } = useSelector((state) => state.approvals);
    useEffect(() => {
    dispatch(fetchPendingRequests());
    }, [dispatch]);

    const handleApprove = (id) => {
      if (window.confirm('Approve this request?')) {
        dispatch(approveRequest(id))
          .unwrap()
          .then(() => dispatch(fetchPendingRequests()))
          .catch(console.error);
      }
    };

    const handleReject = (id) => {
      const reason = window.prompt('Reason for rejection:');
      if (reason !== null) {
        dispatch(rejectRequest({ id, reason }))
          .unwrap()
          .then(() => dispatch(fetchPendingRequests()))
          .catch(console.error);
      }
    };

    return (
        <Wrapper>
            <div className="approvals">
                <h1>Pending WFH Requests</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {requests.length === 0 && <p>No pending requests.</p>}
      <ul>
        {requests.map((r) => (
          <li key={r._id}>
              <p><strong>User:</strong> {r.user.name} ({r.user.email})</p>
              <p><strong>Position:</strong> {r.user.position}</p>
              <p><strong>Type:</strong> {r.type.toUpperCase()}</p>
              <p><strong>Date:</strong> {new Date(r.date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {r.status}</p>
              <button onClick={() => handleApprove(r._id)}>✅ Approve</button>
              <button onClick={() => handleReject(r._id)}>❌ Reject</button>
          </li>
        ))}
      </ul>
            </div>
        </Wrapper>
    );
}
export default Approvals;