import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  res.json({
    status: 'success',
    message: 'Events endpoint - Coming soon',
    data: []
  });
});

// @route   POST /api/events
// @desc    Create event (admin only)
// @access  Private/Admin
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Create event endpoint - Coming soon'
  });
});

// @route   GET /api/events/:id
// @desc    Get event details
// @access  Public
router.get('/:id', async (req, res) => {
  res.json({
    status: 'success',
    message: 'Event details endpoint - Coming soon',
    data: null
  });
});

// @route   POST /api/events/:id/register
// @desc    Register for event
// @access  Private
router.post('/:id/register', authMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Event registration endpoint - Coming soon'
  });
});

// @route   PUT /api/events/:id
// @desc    Update event (admin only)
// @access  Private/Admin
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Update event endpoint - Coming soon'
  });
});

// @route   DELETE /api/events/:id
// @desc    Delete event (admin only)
// @access  Private/Admin
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Delete event endpoint - Coming soon'
  });
});

export default router;
