import { createToken } from "../libs/jwt.js";
import Usuario from "../model/usuario.model.js";


export const login = async (req, res) => {
    const {user_email, user_password} = req.body;
    try {
        const userFound = await Usuario.findOne({
            where: {
                user_email: user_email,
            }
        });

        if (!userFound) return res.status(404).json({ message: "User not found" });

        if (userFound.user_password !== user_password) return res.status(401).json({ message: "Invalid password" });

        const token = await createToken({id: userFound.user_id});
        res.cookie("token", token);
        res.redirect('/');
    } catch (error) {
        res.status(500).json({
            message: error.message || "Some error occurred while retrieving users."
        });
    }
    
}

export const logout = (req, res) => {
    res.cookie('token',"", {expires: new Date(0)});
    return res.redirect('/inicio/login');
}