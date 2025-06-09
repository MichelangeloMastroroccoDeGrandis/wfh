import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
    requestWfh,
    getPendingRequests,
    approveRequest,
    rejectRequest
} from '../controllers/wfhController.js';


const router = express.Router();

// POST /api/wfh/request
router.post('/request', protect, requestWfh);

router.get('/approvals', protect, adminOnly, getPendingRequests);
router.post('/approvals/:id/approve', protect, approveRequest);
router.post('/approvals/:id/reject', protect, rejectRequest);


export default router;
