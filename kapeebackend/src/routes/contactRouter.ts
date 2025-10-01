import { submitContact, getAllContacts } from "../controllers/ContactController.js";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const contactRouter = express.Router();

contactRouter.post("/submit", submitContact);
contactRouter.get("/getAll", authMiddleware, adminMiddleware, getAllContacts);

export default contactRouter;
