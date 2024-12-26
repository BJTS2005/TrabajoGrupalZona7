import express from "express";
import { shuttlesController } from "../controllers/shuttles.controller.js";

const router = express.Router();

router.get('/gestionar/:camp_id', shuttlesController.listarShuttles);

export default router;