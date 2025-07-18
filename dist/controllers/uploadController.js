"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMedia = uploadMedia;
async function uploadMedia(req, res, next) {
    try {
        // TODO: Handle file upload to Cloudinary and store URL in Supabase
        res.status(201).json({});
    }
    catch (err) {
        next(err);
    }
}
