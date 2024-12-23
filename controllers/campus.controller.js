import Campus from "../model/campus.model.js";

export const campusController = {

    listar: async (req, res) => {
        try {
            const campus = await Campus.findAll({
                raw: true,
                nest: true,
            });
            res.render("campus/listarCampus", {title: 'Campus Registrados', datos: campus});
        } catch (error) {
            console.error("Error al obtener los campus:", error);
            res.status(500).send("Error al cargar la pagina")
        }

    },
    registrar: (req, res) => {
        res.render("campus/registrar");
    },
};