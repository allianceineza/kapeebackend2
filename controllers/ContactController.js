import Contact from "../models/contactModel.js";

export const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
       
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        console.log(newContact);

        res.status(201).json({ 
            success: true, 
            message: "Contact created successfully", 
            contact: newContact 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

export const getAllContact = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

export const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        
        if (!contact) {
            return res.status(404).json({ 
                success: false, 
                message: "Contact not found" 
            });
        }
        
        res.status(200).json({ success: true, contact });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

export const deleteContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        
        if (!contact) {
            return res.status(404).json({ 
                success: false, 
                message: "Contact not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Contact deleted successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};

export const updateContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedContact = await Contact.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true } // Returns the updated document
        );
        
        if (!updatedContact) {
            return res.status(404).json({ 
                success: false, 
                message: "Contact not found" 
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Contact updated successfully",
            contact: updatedContact 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Server Error", 
            error: error.message 
        });
    }
};