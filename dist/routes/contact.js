"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Admin: Get all contact messages
router.get('/', auth_1.requireAdminAuth, contactController_1.getAllContacts);
// Public: Send contact message
router.post('/', contactController_1.sendContactMessage);
// Admin: Delete contact message by ID
router.delete('/:id', auth_1.requireAdminAuth, contactController_1.deleteContact);
exports.default = router;
