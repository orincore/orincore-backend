"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const uploadController_1 = require("../controllers/uploadController");
const router = (0, express_1.Router)();
// Admin: Upload media to Cloudinary
router.post('/', auth_1.requireAdminAuth, uploadController_1.uploadMedia);
exports.default = router;
