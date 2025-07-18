"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const portfolioController_1 = require("../controllers/portfolioController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Public: Get all projects
router.get('/', portfolioController_1.getAllProjects);
// Get single project by ID
router.get('/:id', portfolioController_1.getProjectById);
// Admin: Create project
router.post('/', auth_1.requireAdminAuth, upload.array('images', 10), portfolioController_1.createProject);
// Admin: Update project
router.put('/:id', auth_1.requireAdminAuth, upload.array('images', 10), portfolioController_1.updateProject);
// Admin: Delete project
router.delete('/:id', auth_1.requireAdminAuth, portfolioController_1.deleteProject);
exports.default = router;
