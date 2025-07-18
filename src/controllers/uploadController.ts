import { Request, Response, NextFunction } from 'express';
import cloudinary from '../utils/cloudinary';
import { supabase } from '../utils/supabaseClient';

export async function uploadMedia(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: Handle file upload to Cloudinary and store URL in Supabase
    res.status(201).json({});
  } catch (err) {
    next(err);
  }
} 