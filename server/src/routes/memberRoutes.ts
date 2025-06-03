import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// @route   GET /api/members
// @desc    Get all members (admin only)
// @access  Private/Admin
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Members endpoint - Coming soon',
    data: []
  });
});

// @route   GET /api/members/:id
// @desc    Get member details
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Member details endpoint - Coming soon',
    data: null
  });
});

// @route   PUT /api/members/:id
// @desc    Update member profile (admin)
// @access  Private/Admin
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Update member endpoint - Coming soon'
  });
});

export default router;
