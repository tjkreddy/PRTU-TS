import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// @route   GET /api/news
// @desc    Get all news
// @access  Public
router.get('/', async (req, res) => {
  res.json({
    status: 'success',
    message: 'News endpoint - Coming soon',
    data: []
  });
});

// @route   POST /api/news
// @desc    Create news (admin only)
// @access  Private/Admin
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Create news endpoint - Coming soon'
  });
});

// @route   GET /api/news/:id
// @desc    Get news details
// @access  Public
router.get('/:id', async (req, res) => {
  res.json({
    status: 'success',
    message: 'News details endpoint - Coming soon',
    data: null
  });
});

// @route   PUT /api/news/:id
// @desc    Update news (admin only)
// @access  Private/Admin
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Update news endpoint - Coming soon'
  });
});

// @route   DELETE /api/news/:id
// @desc    Delete news (admin only)
// @access  Private/Admin
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  res.json({
    status: 'success',
    message: 'Delete news endpoint - Coming soon'
  });
});

export default router;
