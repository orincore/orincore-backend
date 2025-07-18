import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient';
import cloudinary from '../utils/cloudinary';

export async function getAllProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, live_url, repo_url, tech_stack } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }
    let image_urls: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Upload each image to Cloudinary
      for (const file of req.files) {
        const url = await new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || '');
          });
          // @ts-ignore
          stream.end(file.buffer);
        });
        image_urls.push(url);
      }
    }
    // Insert project into Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title,
        description,
        image_urls, // store as array
        live_url,
        repo_url,
        tech_stack: tech_stack ? Array.isArray(tech_stack) ? tech_stack : tech_stack.split(',') : [],
      }])
      .select();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json(data[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title, description, live_url, repo_url, tech_stack, keep_existing_images } = req.body;
    // Fetch existing project
    const { data: existing, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    let image_urls: string[] = Array.isArray(existing.image_urls) ? [...existing.image_urls] : [];
    // If not keeping existing images, reset
    if (keep_existing_images === 'false' || keep_existing_images === false) {
      image_urls = [];
    }
    // Handle new images
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files) {
        const url = await new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || '');
          });
          // @ts-ignore
          stream.end(file.buffer);
        });
        image_urls.push(url);
      }
    }
    // Prepare update fields
    const updateFields: any = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (live_url) updateFields.live_url = live_url;
    if (repo_url) updateFields.repo_url = repo_url;
    if (tech_stack) updateFields.tech_stack = Array.isArray(tech_stack) ? tech_stack : tech_stack.split(',');
    updateFields.image_urls = image_urls;
    // Update project in Supabase
    const { data, error } = await supabase
      .from('projects')
      .update(updateFields)
      .eq('id', id)
      .select();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    // Check if project exists
    const { data: existing, error: fetchError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single();
    if (fetchError || !existing) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    // Delete project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
} 