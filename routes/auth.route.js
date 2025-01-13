import express from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { estaAutenticado } from "../middlewares/validarToken.middleware.js";
const router = express.Router();

router.get('/login', estaAutenticado, (req, res) => {
    res.render('login.ejs');
});
router.post('/login', login); 
router.post("/logout", logout);

export default router;