"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReviews = getAllReviews;
exports.createReview = createReview;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
const supabaseClient_1 = require("../utils/supabaseClient");
async function getAllReviews(req, res, next) {
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(data);
    }
    catch (err) {
        next(err);
    }
}
async function createReview(req, res, next) {
    try {
        const { name, email, rating, feedback } = req.body;
        if (!name || !email || !rating || !feedback) {
            return res.status(400).json({ error: 'All fields (name, email, rating, feedback) are required.' });
        }
        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
        }
        const { data, error } = await supabaseClient_1.supabase
            .from('reviews')
            .insert([{ name, email, rating: ratingNum, feedback }])
            .select();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json(data[0]);
    }
    catch (err) {
        next(err);
    }
}
async function updateReview(req, res, next) {
    try {
        const { id } = req.params;
        const { email, feedback, rating } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required to update your review.' });
        }
        // Check if review exists and email matches
        const { data: review, error: fetchError } = await supabaseClient_1.supabase
            .from('reviews')
            .select('*')
            .eq('id', id)
            .single();
        if (fetchError || !review) {
            return res.status(404).json({ error: 'Review not found.' });
        }
        if (review.email !== email) {
            return res.status(403).json({ error: 'You can only update your own review.' });
        }
        // Update review
        const updateFields = {};
        if (feedback)
            updateFields.feedback = feedback;
        if (rating) {
            const ratingNum = Number(rating);
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
            }
            updateFields.rating = ratingNum;
        }
        const { data, error } = await supabaseClient_1.supabase
            .from('reviews')
            .update(updateFields)
            .eq('id', id)
            .select();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json(data[0]);
    }
    catch (err) {
        next(err);
    }
}
async function deleteReview(req, res, next) {
    try {
        const { id } = req.params;
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required to delete your review.' });
        }
        // Check if review exists and email matches
        const { data: review, error: fetchError } = await supabaseClient_1.supabase
            .from('reviews')
            .select('*')
            .eq('id', id)
            .single();
        if (fetchError || !review) {
            return res.status(404).json({ error: 'Review not found.' });
        }
        if (review.email !== email) {
            return res.status(403).json({ error: 'You can only delete your own review.' });
        }
        // Delete review
        const { error } = await supabaseClient_1.supabase
            .from('reviews')
            .delete()
            .eq('id', id);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
