import Curso from "../model/cursos.model.js";
import Campus from "../model/campus.model.js";

export const cursosController = {
    // *** Listar Cursos por Campus ***
    listarCursosPorCampus: async (req, res) => {
        try {
            const { camp_id } = req.params;

            // Obtener cursos del campus
            const cursos = await Curso.findAll({
                where: { camp_id },
                include: [{ model: Campus, attributes: ["camp_id", "camp_nom"] }],
                raw: true,
                nest: true,
            });

            res.render("cursos/gestionCursos.ejs", { cursos, currentCampus: camp_id });
        } catch (error) {
            console.error("Error al listar los cursos:", error);
            res.status(500).send("Error al cargar los cursos.");
        }
    },

    // *** Registrar un Nuevo Curso ***
    registrarCurso: async (req, res) => {
        try {
            const { camp_id } = req.params;
            const { cur_id, cur_descripcion, cur_es_sostenible } = req.body;

            // Validar si ya existe un curso con el mismo ID en el campus
            const cursoExistente = await Curso.findOne({
                where: { cur_id },
            });

            if (cursoExistente) {
                return res.status(400).send("Ya existe un curso con este ID.");
            }

            await Curso.create({
                cur_id,
                camp_id,
                cur_descripcion,
                cur_es_sostenible: cur_es_sostenible === "true", // Convertir el booleano
            });

            res.redirect(`/cursos/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al registrar el curso:", error);
            res.status(500).send("Error al registrar el curso.");
        }
    },

    // *** Actualizar un Curso Existente ***
    actualizarCurso: async (req, res) => {
        try {
            const { cur_id, cur_descripcion, cur_es_sostenible } = req.body;
            const { camp_id } = req.params;

            const curso = await Curso.findByPk(cur_id);
            if (!curso) {
                return res.status(404).send("Curso no encontrado.");
            }

            await curso.update({
                cur_descripcion,
                cur_es_sostenible: cur_es_sostenible === "true", // Convertir el booleano
            });

            res.redirect(`/cursos/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al actualizar el curso:", error);
            res.status(500).send("Error al actualizar el curso.");
        }
    },

    // *** Eliminar un Curso ***
    eliminarCurso: async (req, res) => {
        try {
            const { cur_id } = req.params;
            const { camp_id } = req.params;

            const curso = await Curso.findByPk(cur_id);
            if (!curso) {
                return res.status(404).send("Curso no encontrado.");
            }

            await curso.destroy();
            res.redirect(`/cursos/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al eliminar el curso:", error);
            res.status(500).send("Error al eliminar el curso.");
        }
    },
};
