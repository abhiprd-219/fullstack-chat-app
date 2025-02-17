import express from "express";
import { addContact } from "../controllers/contact.controller.js"; // Adjust the path if needed
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add-contact/:userId", protectRoute, (req, res, next) => {
  req.params.userId = req.params.userId.trim(); // Remove unwanted spaces or newlines
  console.log("in middleware");
  next();
}, addContact);

export default router;
