import WfhRequest from '../models/WfhRequest.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import { startOfWeek, endOfWeek, isWithinInterval, addWeeks, parseISO } from 'date-fns';

export const requestWfh = async (req, res) => {
  try {
    const { type, date } = req.body;
    const user = req.user;

    const selectedDate = parseISO(date);
    const today = new Date();
    const nextWeekStart = startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });
    const nextWeekEnd = endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 });

    // 1. Week Constraint
    if (!isWithinInterval(selectedDate, { start: nextWeekStart, end: nextWeekEnd })) {
      return res.status(400).json({ message: 'You can only request WFH for next week.' });
    }

    // 2. WFH Limit Per Week
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

    const userRequests = await WfhRequest.find({
      user: user._id,
      date: { $gte: weekStart, $lte: weekEnd },
      type: 'wfh',
    });

    const maxDays = ['CTO', 'CEO', 'COO'].includes(user.position) ? 2 : 1;
    if (userRequests.length >= maxDays) {
      return res.status(400).json({ message: `You can request up to ${maxDays} WFH day(s) per week.` });
    }

    // 3. Colleague Conflict
    const conflict = await WfhRequest.findOne({
      date,
      type: 'wfh',
      status: 'approved',
    }).populate('user');

    if (conflict && conflict.user.position === user.position) {
      return res.status(400).json({ message: `Colleague ${conflict.user.name} already has WFH on this date.` });
    }

    // 4. Save Request (pending by default)
    const newRequest = await WfhRequest.create({
      user: user._id,
      type,
      date,
      status: 'pending'
    });

    // 5. Send Email to Admin/Approver (next step)
    // Fetch all Admins and Approvers
const approvers = await User.find({ role: { $in: ['admin', 'approver'] } });

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

approvers.forEach((approver) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: approver.email,
    subject: `New WFH Request from ${user.name}`,
    text: `${user.name} has requested ${type.toUpperCase()} for ${date}. Please review it in the approval page.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Error sending email:', error);
    else console.log('Email sent:', info.response);
  });
});

    return res.status(201).json({ message: 'Request submitted successfully.', request: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error submitting WFH request' });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await WfhRequest.find({ status: 'pending' }).populate('user', 'name email position');
    res.status(200).json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Approving request ID:", id);

    const request = await WfhRequest.findById(id);
    console.log("📝 Fetched request:", request);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'approved';
    await request.save();

    res.json({ message: 'Request approved', request });
  } catch (error) {
    console.error("❌ Error approving request:", error);
    res.status(500).json({ message: 'Failed to approve request' });
  }
};

export const rejectRequest = async (req, res) => {
  const { reason } = req.body;

  try {
    const request = await WfhRequest.findById(req.params.id).populate('user');

    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    // Send rejection email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: request.user.email,
      subject: 'Your WFH request has been rejected',
      text: `Hi ${request.user.name}, your WFH request for ${request.date} has been rejected.\n\nReason: ${reason || 'No reason provided'}`,
    });

    res.status(200).json({ message: 'Request rejected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to reject request' });
  }
};
