import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { uploadMedia } from '../controllers/uploadController';

const router = Router();

// Admin: Upload media to Cloudinary
router.post('/', requireAdminAuth, uploadMedia);

export default router; 