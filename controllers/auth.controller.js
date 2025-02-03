import { name } from "ejs";
import { createToken } from "../libs/jwt.js";
import Usuario from "../model/usuario.model.js";
import TipoUsuario from "../model/tipoUsuario.model.js";

export const renderLogin = (req, res) => {
    res.render('login', { error: null });
}

export const login = async (req, res) => {
   const {user_email, user_password} = req.body;
   try {
       const userFound = await Usuario.findOne({
           where: { user_email },
           include: [{
            model: TipoUsuario,
            attributes: ['tipus_detalles']
        }]
       });

       if (!userFound) return res.render('login', { error: "Usuario no encontrado" });
       if (userFound.user_password !== user_password) return res.render('login', { error: "Contraseña inválida" });

       const token = await createToken({id: userFound.user_id, 
        name: userFound.user_nombre,
        tipo: userFound.tipus_id,
        tipoDetalle: userFound.TipoUsuario.tipus_detalles,
        apellido: userFound.user_apellido,
        email: userFound.user_email,
        telefono: userFound.user_telefono,
        cedula: userFound.user_cedula,});
       console.log(token);
       res.cookie("token", token);
       res.redirect('/');

   } catch (error) {
       res.render('login', { error: "Error en el servidor" });
   }
}

export const logout = (req, res) => {
   res.cookie('token', "", {expires: new Date(0)});
   return res.redirect('/inicio/login');
}