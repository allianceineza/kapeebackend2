import { 
    createContact, 
    getAllContact, 
    getContactById, 
    deleteContactById, 
    updateContactById 
} from "../controllers/ContactController.js";
import express from "express";

const contactRouter = express.Router();

// Contact routes - these will be prefixed with /contact from indexRouting.js
contactRouter.post("/", createContact);           // POST /contact
contactRouter.get("/", getAllContact);            // GET /contact
contactRouter.get("/:id", getContactById);        // GET /contact/:id
contactRouter.put("/:id", updateContactById);     // PUT /contact/:id
contactRouter.delete("/:id", deleteContactById);  // DELETE /contact/:id

export default contactRouter;