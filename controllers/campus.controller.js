import Campus from "../model/campus.model.js";
import FondoInvestigacion from "../model/fondosInvestigacion.model.js";


export const campusController = {

    listar: async (req, res) => {
        try {
            const campus = await Campus.findAll({
                raw: true,
                nest: true,
                order: [['camp_area', 'DESC']],
            });
            res.render("campus/listarCampus", { title: 'Campus Registrados', datos: campus });
        } catch (error) {
            console.error("Error al obtener los campus:", error);
            res.status(500).send("Error al cargar la pagina");
        }
    },

    registrar: (req, res) => {
        res.render("campus/registrar");
    },

    guardar: async (req, res) => {
        try {
            const {
                camp_id,
                camp_nom,
                camp_area,
                camp_perimetro,
                camp_capacidad,
                camp_cant_pobla,
                camp_calle_principal,
                camp_calle_secundaria,
                fondo_total,
                fondo_sostenibilidad,
            } = req.body;

            const campusExistente = await Campus.findByPk(camp_id);

            if (campusExistente) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a otro campus"});

            // Calcular densidad de población si el área es mayor a 0
            const camp_dens_pobla = camp_area > 0 ? camp_cant_pobla / camp_area : 0;

            // Crear el campus
            const nuevoCampus = await Campus.create({
                camp_id,
                camp_nom,
                camp_area,
                camp_perimetro,
                camp_capacidad,
                camp_cant_pobla,
                camp_dens_pobla,
                camp_calle_principal,
                camp_calle_secundaria,
            });

            // Crear el fondo asociado
            await FondoInvestigacion.create({
                fondo_id: `FON${camp_id}`, // Generar ID único basado en el campus
                camp_id,
                fondo_total: parseFloat(fondo_total),
                fondo_sostenibilidad: parseFloat(fondo_sostenibilidad),
            });


            res.redirect('/campus');
        } catch (error) {
            console.error("Error al registrar el campus y el fondo:", error);
            res.status(500).send("Error al registrar el campus.");
        }
    },

    eliminar: async (req, res) => {
        try {
            const { id } = req.params;

            // Eliminar el fondo asociado
            await FondoInvestigacion.destroy({ where: { camp_id: id } });

            // Eliminar el campus
            const campus = await Campus.findByPk(id);
            if (!campus) return res.status(404).send("Campus no encontrado");
            await campus.destroy();

            res.redirect('/campus');
        } catch (error) {
            console.error("Error al eliminar campus y fondo:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar el campus porque tiene metricas asociadas" });
        }
    },

    editar: async (req, res) => {
        try {
            const campus = await Campus.findByPk(req.params.id, { raw: true });
            const fondo = await FondoInvestigacion.findOne({ where: { camp_id: req.params.id }, raw: true });

            res.render('campus/editar', { campus, fondo });
        } catch (error) {
            console.error("Error al obtener campus y fondo:", error);
            res.status(500).send("Error al obtener campus.");
        }
    },

    actualizar: async (req, res) => {
        try {
            const {
                camp_id,
                camp_nom,
                camp_area,
                camp_perimetro,
                camp_capacidad,
                camp_cant_pobla,
                camp_calle_principal,
                camp_calle_secundaria,
                fondo_total,
                fondo_sostenibilidad,
            } = req.body;

            // Calcular densidad de población si el área es mayor a 0
            const camp_dens_pobla = camp_area > 0 ? camp_cant_pobla / camp_area : 0;

            // Actualizar el campus
            const campus = await Campus.findByPk(camp_id);
            if (!campus) return res.status(404).send("Campus no encontrado");
            await campus.update({
                camp_nom,
                camp_area,
                camp_perimetro,
                camp_capacidad,
                camp_cant_pobla,
                camp_dens_pobla,
                camp_calle_principal,
                camp_calle_secundaria,
            });

            // Actualizar el fondo asociado
            const fondo = await FondoInvestigacion.findOne({ where: { camp_id } });
            if (!fondo) return res.status(404).send("Fondo no encontrado.");
            await fondo.update({
                fondo_total: parseFloat(fondo_total),
                fondo_sostenibilidad: parseFloat(fondo_sostenibilidad),
            });

            res.redirect('/campus');
        } catch (error) {
            console.error("Error al actualizar campus y fondo:", error);
            res.status(500).send("Error al actualizar campus.");
        }
    },

    detalles: async (req, res) => {
        try {
            const campus = await Campus.findByPk(req.params.camp_id);
            const fondo = await FondoInvestigacion.findOne({ where: { camp_id: req.params.camp_id } });

            if (!campus) return res.status(404).send("Campus no encontrado");

            res.render("campus/detalles.ejs", { title: "Detalles del Campus", campus, fondo });
        } catch (error) {
            console.error("Error al obtener los detalles del campus:", error);
            res.status(500).send("Error al cargar los detalles del campus.");
        }
    },

    registrarFondo: async (req, res) => {
        try {
            const { camp_id, fondo_total, fondo_sostenibilidad } = req.body;

            // Verificar que el campus existe
            const campus = await Campus.findByPk(camp_id);
            if (!campus) {
                return res.status(404).send("El campus especificado no existe.");
            }

            // Crear el fondo asociado al campus
            await FondoInvestigacion.create({
                fondo_id: `FON${camp_id}`, // Generar un ID único basado en el ID del campus
                camp_id,
                fondo_total: parseFloat(fondo_total),
                fondo_sostenibilidad: parseFloat(fondo_sostenibilidad),
            });

            // Redirigir a la página de detalles del campus
            res.redirect(`/campus/${camp_id}`);
        } catch (error) {
            console.error("Error al registrar el fondo:", error);
            res.status(500).send("Hubo un error al registrar el fondo.");
        }
    },

    guardarImagen: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No se envió ninguna imagen' });
            }

            const file = req.file;

            const ext = path.extname(file.originalname);
            const newFileName = `${file.filename}${ext}`;
            const newPath = path.join('uploads', newFileName);

            fs.renameSync(file.path, newPath);

            // Respuesta de éxito
            res.status(200).json({
                message: 'Imagen subida exitosamente',
                file: {
                    name: newFileName,
                    url: `/public/images/${newFileName}`,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ocurrió un error al subir la imagen' });
        }
    },
};
