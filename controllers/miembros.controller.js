import { MiembroUnidad, TipoMiembro } from "../model/miembros.model.js";

export const miembrosController = {
    // Listar todos los miembros y tipos de miembro
    listar: async (req, res) => {
        try {
            // Obtener todos los miembros con sus tipos asociados
            const miembros = await MiembroUnidad.findAll({
                include: [
                    {
                        model: TipoMiembro,
                        attributes: ['tipmi_id', 'tipmi_detalle'], // Incluir solo los campos necesarios
                    },
                ],
                raw: true,
                nest: true,
            });

            // Obtener los tipos de miembro para el formulario de registro y edición
            const tiposMiembro = await TipoMiembro.findAll({
                attributes: ['tipmi_id', 'tipmi_detalle'],
                raw: true,
            });

            // Renderizar la vista con los datos
            res.render("miembros/gestionMiembros.ejs", { miembros, tiposMiembro });
        } catch (error) {
            console.error("Error al listar los miembros:", error);
            res.status(500).send("Error al cargar la lista de miembros.");
        }
    },

    // Registrar un nuevo miembro
    registrarMiembro: async (req, res) => {
        try {
            const { mie_ci, tipmi_id, mie_nombres, mie_apellidos, mie_telefono, mie_mail } = req.body;

            // Crear el nuevo miembro
            await MiembroUnidad.create({
                mie_ci,
                tipmi_id,
                mie_nombres,
                mie_apellidos,
                mie_telefono,
                mie_mail,
            });

            res.redirect("/miembros");
        } catch (error) {
            console.error("Error al registrar el miembro:", error);
            res.status(500).send("Error al registrar el miembro.");
        }
    },

    // Actualizar un miembro existente
    actualizarMiembro: async (req, res) => {
        try {
            const { mie_ci, tipmi_id, mie_nombres, mie_apellidos, mie_telefono, mie_mail } = req.body;

            // Buscar el miembro por su CI
            const miembro = await MiembroUnidad.findByPk(mie_ci);
            if (!miembro) {
                return res.status(404).send("Miembro no encontrado.");
            }

            // Actualizar los datos del miembro
            await miembro.update({
                tipmi_id,
                mie_nombres,
                mie_apellidos,
                mie_telefono,
                mie_mail,
            });

            res.redirect("/miembros");
        } catch (error) {
            console.error("Error al actualizar el miembro:", error);
            res.status(500).send("Error al actualizar el miembro.");
        }
    },

    // Eliminar un miembro
    eliminarMiembro: async (req, res) => {
        try {
            const { mie_ci } = req.params;

            // Buscar el miembro por su CI
            const miembro = await MiembroUnidad.findByPk(mie_ci);
            if (!miembro) {
                return res.status(404).send("Miembro no encontrado.");
            }

            // Eliminar el miembro
            await miembro.destroy();

            res.redirect("/miembros");
        } catch (error) {
            console.error("Error al eliminar el miembro:", error);
            res.status(500).send("Error al eliminar el miembro.");
        }
    },

    // Listar todos los tipos de miembro
    listarTipos: async (req, res) => {
        try {
            const tiposMiembro = await TipoMiembro.findAll({
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
            const { tipmi_id, tipmi_detalle } = req.body;

            // Crear el nuevo tipo de miembro
            await TipoMiembro.create({
                tipmi_id,
                tipmi_detalle,
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
            const { tipmi_id, tipmi_detalle } = req.body;

            // Buscar el tipo de miembro por su ID
            const tipoMiembro = await TipoMiembro.findByPk(tipmi_id);
            if (!tipoMiembro) {
                return res.status(404).send("Tipo de miembro no encontrado.");
            }

            // Actualizar los datos del tipo de miembro
            await tipoMiembro.update({
                tipmi_detalle,
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
            const tipoMiembro = await TipoMiembro.findByPk(tipmi_id);
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
