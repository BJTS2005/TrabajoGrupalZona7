import { MiembroUnidad, TipoMiembro } from "../model/miembros.model.js";
import  Usuario  from "../model/usuario.model.js";
import  TipoUsuario  from "../model/tipoUsuario.model.js";
import PermisoUsuario from "../model/permisosUsuarios.model.js";

export const miembrosController = {
    // Listar todos los miembros y tipos de miembro
    listar: async (req, res) => {
        try {
            // Obtener todos los miembros con sus tipos asociados
            const miembros = await Usuario.findAll({
                include: [
                    {
                        model: TipoUsuario,
                        attributes: ['tipus_id','perus_id','tipus_detalles'],
                         include: [{
                            model: PermisoUsuario,
                            attributes: ['perus_id','perus_detalle'], 
                        }]
                    },
                ],
                raw: true,
                nest: true,
            });

            // Obtener los tipos de miembro para el formulario de registro y edición
            const tiposMiembro = await TipoUsuario.findAll({
                attributes: ['tipus_id','perus_id','tipus_detalles'],
                include: [{
                    model: PermisoUsuario,
                    attributes: ['perus_id', 'perus_detalle']
                }],
                raw: true,
                nest: true,
            });

            const permisosMiembro = await PermisoUsuario.findAll({
                attributes: ['perus_id', 'perus_detalle'],
                raw: true,
            });

            // Renderizar la vista con los datos
            res.render("miembros/gestionMiembros.ejs", { miembros, tiposMiembro, permisosMiembro });
        } catch (error) {
            console.error("Error al listar los miembros:", error);
            res.status(500).send("Error al cargar la lista de miembros.");
        }
    },

    // Registrar un nuevo miembro
    registrarMiembro: async (req, res) => {
        try {
            const { 
                user_cedula,
                tipus_id, 
                user_nombre, 
                user_apellido, 
                user_telefono, 
                user_email,
                user_password
            } = req.body;
    
            // Crear el nuevo usuario
            await Usuario.create({
                user_cedula,
                tipus_id,
                user_nombre,
                user_apellido,
                user_telefono,
                user_email,
                user_password,
                user_estado: true, // Asumiendo que un nuevo usuario se crea activo
                created_at: new Date(),
                updated_at: new Date()
            });
    
            res.redirect("/miembros");
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            
            // Mejorar el manejo de errores para dar feedback más específico
            if (error.name === 'SequelizeUniqueConstraintError') {
                // Si el error es por correo duplicado
                res.render("atraparErrores.ejs", { error: "Ya existe un usuario con esta cedula" });
            } else {
                res.status(500).send("Error al registrar el usuario.");
            }
        }
    },

    // Actualizar un miembro existente
    actualizarMiembro: async (req, res) => {
        try {
            const { 
                user_id,
                tipus_id, 
                user_nombre, 
                user_apellido, 
                user_telefono, 
                user_email 
            } = req.body;
    
            // Buscar el usuario
            const usuario = await Usuario.findOne({
                where: {
                    user_id,
                    user_estado: true
                }
            });
    
            if (!usuario) {
                return res.status(404).send("Usuario no encontrado o inactivo.");
            }
    
            // Verificar que el tipo de usuario existe
            const tipoUsuario = await TipoUsuario.findByPk(tipus_id);
            if (!tipoUsuario) {
                return res.status(400).send("El tipo de usuario especificado no existe.");
            }
    
            // Actualizar los datos del usuario
            await usuario.update({
                tipus_id,
                user_nombre,
                user_apellido,
                user_telefono,
                user_email,
                updated_at: new Date()
            });
    
            res.redirect("/miembros");
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).send("Por favor, verifica que todos los campos sean correctos.");
            }
    
            res.status(500).send("Error al actualizar el usuario.");
        }
    },

    // Eliminar un miembro
    eliminarMiembro: async (req, res) => {
        try {
            const { mie_ci } = req.params;
            console.log(mie_ci + "aqui tooooooooooooooooooooooooooooooooooooooy");
            const miembro = await Usuario.findByPk(mie_ci);
            if (!miembro) {
                return res.status(404).send("Miembro no encontrado.");
            }

            // Eliminar el miembro
            await miembro.destroy();

            res.redirect("/miembros");
        } catch (error) {
            console.error("Error al eliminar el miembro:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar este miembro, ya que tiene datos asociados." });
        }
    },

    // Listar todos los tipos de miembro
    listarTipos: async (req, res) => {
        try {
            const tiposMiembro = await TipoUsuario.findAll({
                raw: true,
            });

            res.render("miembros/tiposMiembros.ejs", { tiposMiembro });
        } catch (error) {
            console.error("Error al listar los tipos de miembro:", error);
            res.status(500).send("Error al cargar la lista de tipos de miembro.");
        }
    },

    // Registrar un nuevo tipo de miembro
    registrarTipo: async (req, res) => {
        try {
            const { tipus_id, tipus_detalles } = req.body;

            // Crear el nuevo tipo de miembro
            await TipoUsuario.create({
                tipus_id,
                tipus_detalles,
            });

            res.redirect("/miembros/tipos");
        } catch (error) {
            console.error("Error al registrar el tipo de miembro:", error);
            res.status(500).send("Error al registrar el tipo de miembro.");
        }
    },

    // Actualizar un tipo de miembro existente
    actualizarTipo: async (req, res) => {
        try {
            const { tipus_id, tipus_detalles } = req.body;

            // Buscar el tipo de miembro por su ID
            const tipoMiembro = await TipoUsuario.findByPk(tipus_id);
            if (!tipoMiembro) {
                return res.status(404).send("Tipo de miembro no encontrado.");
            }

            // Actualizar los datos del tipo de miembro
            await tipoMiembro.update({
                tipus_detalles,
            });

            res.redirect("/miembros/tipos");
        } catch (error) {
            console.error("Error al actualizar el tipo de miembro:", error);
            res.status(500).send("Error al actualizar el tipo de miembro.");
        }
    },

    // Eliminar un tipo de miembro
    eliminarTipo: async (req, res) => {
        try {
            const { tipmi_id } = req.params;

            // Buscar el tipo de miembro por su ID
            const tipoMiembro = await TipoUsuario.findByPk(tipmi_id);
            if (!tipoMiembro) {
                return res.status(404).send("Tipo de miembro no encontrado.");
            }

            // Eliminar el tipo de miembro
            await tipoMiembro.destroy();

            res.redirect("/miembros/tipos");
        } catch (error) {
            console.error("Error al eliminar el tipo de miembro:", error);
            res.status(500).send("Error al eliminar el tipo de miembro.");
        }
    },
};
