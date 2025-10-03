import { submitContact, getAllContacts } from "../controllers/ContactController";
import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const contactRouter = express.Router();

contactRouter.post("/submit", submitContact);
contactRouter.get("/getAll", authMiddleware, adminMiddleware, getAllContacts);

export default contactRouter;
