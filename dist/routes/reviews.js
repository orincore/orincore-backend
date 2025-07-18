"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const reviewsController_1 = require("../controllers/reviewsController");
const router = (0, express_1.Router)();
// Public: Get all reviews
router.get('/', reviewsController_1.getAllReviews);
// Public: Create review
router.post('/', reviewsController_1.createReview);
// Admin: Update review
router.put('/:id', auth_1.requireAdminAuth, reviewsController_1.updateReview);
// Admin: Delete review
router.delete('/:id', auth_1.requireAdminAuth, reviewsController_1.deleteReview);
exports.default = router;
