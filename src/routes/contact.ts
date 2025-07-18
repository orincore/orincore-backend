import { Router } from 'express';
import { sendContactMessage, getAllContacts, deleteContact } from '../controllers/contactController';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

// Admin: Get all contact messages
router.get('/', requireAdminAuth, getAllContacts);

// Public: Send contact message
router.post('/', sendContactMessage);

// Admin: Delete contact message by ID
router.delete('/:id', requireAdminAuth, deleteContact);

export default router; 