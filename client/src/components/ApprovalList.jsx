const ApprovalList = ({ approvals, onApprove, onReject }) => {  
  return (
    <div className="approval-list">
      {approvals.map((approval) => (
        <div key={approval.id} className="approval-item">
          <p>{approval.description}</p>
          <button onClick={() => onApprove(approval.id)}>Approve</button>
          <button onClick={() => onReject(approval.id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

