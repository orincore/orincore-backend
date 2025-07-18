"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactMessage = sendContactMessage;
exports.getAllContacts = getAllContacts;
exports.deleteContact = deleteContact;
const supabaseClient_1 = require("../utils/supabaseClient");
async function sendContactMessage(req, res, next) {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        // Store in Supabase (assume table 'contact_messages')
        const { data, error } = await supabaseClient_1.supabase
            .from('contact_messages')
            .insert([{ name, email, subject, message }]);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: 'Message sent successfully.' });
    }
    catch (err) {
        next(err);
    }
}
async function getAllContacts(req, res, next) {
    try {
        const { data, error } = await supabaseClient_1.supabase
            .from('contact_messages')
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
async function deleteContact(req, res, next) {
    try {
        const { id } = req.params;
        const { error } = await supabaseClient_1.supabase
            .from('contact_messages')
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
