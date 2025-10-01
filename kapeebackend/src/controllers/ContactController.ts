import { Request, Response } from "express";
import Contact from "../models/contactModel.js";
import { sendEmail } from "../utils/sendEmail.js";

const submitContact = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;
        const contact = new Contact({ name, email, message });
        await contact.save();
        await sendEmail(email, "Contact Form Submission", `Thank you for contacting us, ${name}. We will get back to you soon.`);
        res.status(201).json({ message: "Contact form submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getAllContacts = async (req: Request, res: Response) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export { submitContact, getAllContacts };
