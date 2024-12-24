import Campus from "../model/campus.model.js";

export const campusController = {

    listar: async (req, res) => {
        try {
            const campus = await Campus.findAll({
                raw: true,
                nest: true,
            });
            res.render("campus/listarCampus", { title: 'Campus Registrados', datos: campus });
        } catch (error) {
            console.error("Error al obtener los campus:", error);
            res.status(500).send("Error al cargar la pagina")
        }

    },
    registrar: (req, res) => {
        res.render("campus/registrar");
    },
    guardar: async (req, res) => {
        try {
            const { camp_id, camp_nom, camp_area, camp_perimetro, camp_capacidad, camp_cant_pobla, camp_calle_principal, camp_calle_secundaria } = req.body;

            // Calcular densidad de población si el área es mayor a 0
            const camp_dens_pobla = camp_area > 0 ? camp_cant_pobla / camp_area : 0;

            // Crear el campus en la base de datos
            const nuevoCampus = await Campus.create({
                camp_id,
                camp_nom,
                camp_area,
                camp_perimetro,
                camp_capacidad,
                camp_cant_pobla,
                camp_dens_pobla, // Guardar la densidad calculada
                camp_calle_principal,
                camp_calle_secundaria
            });

            res.redirect('/campus');
        } catch (error) {
            console.error("Error al registrar el campus:", error);
            res.status(500).send("Error al registrar el campus");
        }
    },
    eliminar: async (req, res) => {
        try {
            const campus = await Campus.findByPk(req.params.id);
            if (!campus) return res.status(404).send("Campus no encontrado");
            await campus.destroy();
            res.redirect('/campus');
        } catch (error) {
            console.error("Error al eliminar campus:", error);
            res.status(500).send("Error al eliminar campus");
        }
    },
    editar: async (req, res) => {
        try {
            const campus = await Campus.findByPk(req.params.id, {
                raw: true,
            });
            res.render('campus/editar', { campus });
        } catch (error) {
            console.error("Error al obtener campus", error);
            res.status(500).send("Error al obtener campus");
        }
    },
    actualizar: async (req, res) => {
        try {
            const { camp_id, camp_nom, camp_area, camp_perimetro, camp_capacidad, camp_cant_pobla, camp_calle_principal, camp_calle_secundaria } = req.body;
    
            // Buscar el campus por su clave primaria
            const campus = await Campus.findByPk(camp_id);
            if (!campus) return res.status(404).send("Campus no encontrado");
    
            // Calcular densidad de población si el área es mayor a 0
            const camp_dens_pobla = camp_area > 0 ? camp_cant_pobla / camp_area : 0;
    
            // Actualizar los campos, incluyendo la densidad calculada
            await campus.update({
                camp_nom,
                camp_area,
                camp_perimetro,
                camp_capacidad,
                camp_cant_pobla,
                camp_dens_pobla, // Guardar la densidad calculada
                camp_calle_principal,
                camp_calle_secundaria
            });
    
            res.redirect('/campus');
        } catch (error) {
            console.error("Error al actualizar campus:", error);
            res.status(500).send("Error al actualizar campus");
        }
    },
    detalles: async (req, res) => {
        try {
            const campus = await Campus.findByPk(req.params.camp_id);
            if (!campus) return res.status(404).send("Campus no encontrado");

            // Renderiza la vista de detalles con los datos del campus
            res.render("campus/detalles", { title: "Detalles del Campus", campus });
        } catch (error) {
            console.error("Error al obtener los detalles del campus:", error);
            res.status(500).send("Error al cargar los detalles del campus");
        }
    },
};