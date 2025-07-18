import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from '../controllers/portfolioController';
import multer from 'multer';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Public: Get all projects
router.get('/', getAllProjects);

// Get single project by ID
router.get('/:id', getProjectById);

// Admin: Create project
router.post('/', requireAdminAuth, upload.array('images', 10), createProject);

// Admin: Update project
router.put('/:id', requireAdminAuth, upload.array('images', 10), updateProject);

// Admin: Delete project
router.delete('/:id', requireAdminAuth, deleteProject);

export default router; 