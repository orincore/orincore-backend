import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewsController';

const router = Router();

// Public: Get all reviews
router.get('/', getAllReviews);

// Public: Create review
router.post('/', createReview);

// Admin: Update review
router.put('/:id', requireAdminAuth, updateReview);

// Admin: Delete review
router.delete('/:id', requireAdminAuth, deleteReview);

export default router; 