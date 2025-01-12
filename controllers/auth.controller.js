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

        res.json({message: "User found"});
    } catch (error) {
        res.status(500).json({
            message: error.message || "Some error occurred while retrieving users."
        });
    }
    
}