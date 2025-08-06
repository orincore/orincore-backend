import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient';
import axios from 'axios';

const FORM2CHAT_API_URL = 'https://form2chat.onrender.com/api/contact-form';
const FORM2CHAT_API_KEY = process.env.FORM2CHAT_API_KEY;

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function validateContactData(data: Partial<ContactFormData>): { isValid: boolean; error?: string } {
  const { name, email, phone, message } = data;
  
  if (!name?.trim()) return { isValid: false, error: 'Name is required' };
  if (!email?.trim()) return { isValid: false, error: 'Email is required' };
  if (!phone?.trim()) return { isValid: false, error: 'Phone number is required' };
  if (!message?.trim()) return { isValid: false, error: 'Message is required' };
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email || '')) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
}

export async function sendContactMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, message } = req.body as ContactFormData;
    
    // Validate all fields
    const validation = validateContactData({ name, email, phone, message });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Prepare payload for external API
    const payload: ContactFormData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim()
    };

    try {
      // Send to external API
      await axios.post(FORM2CHAT_API_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': FORM2CHAT_API_KEY || ''
        }
      });
    } catch (apiError) {
      console.error('Error sending to external API:', apiError);
      // Continue with local storage even if external API fails
    }

    // Store in Supabase as backup
    const { error } = await supabase
      .from('contact_messages')
      .insert([payload]);
      
    if (error) {
      console.error('Error saving to Supabase:', error);
      return res.status(500).json({ error: 'Failed to save message. Please try again.' });
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