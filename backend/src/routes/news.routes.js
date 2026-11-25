import { Router } from "express";
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/news.controller.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.post("/", requireAdmin, createNews);
router.put("/:id", requireAdmin, updateNews);
router.delete("/:id", requireAdmin, deleteNews);

export default router;
