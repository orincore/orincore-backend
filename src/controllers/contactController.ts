import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient';

export async function sendContactMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    // Store in Supabase (assume table 'contact_messages')
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, message }]);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function getAllContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
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

export async function deleteContact(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('contact_messages')
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