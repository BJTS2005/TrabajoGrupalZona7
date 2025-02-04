import { GreenJob, GraduadoGreenJob } from "../model/greenJobs.model.js";
import Campus from "../model/campus.model.js";

export const greenJobsController = {


    // *** Listar Todos los Green Jobs Globalmente ***
    listarGreenJobs: async (req, res) => {
        try {
            const greenJobs = await GreenJob.findAll({ raw: true });
            res.render("greenJobs/listarGreenJobs.ejs", { greenJobs });
        } catch (error) {
            console.error("Error al listar los Green Jobs globalmente:", error);
            res.status(500).send("Error al cargar los Green Jobs.");
        }
    },

    // *** Registrar un Nuevo Green Job Globalmente ***
    registrarGreenJob: async (req, res) => {
        try {
            const { job_id, job_detalle } = req.body;

            const existente = await GreenJob.findByPk(job_id);

            if(existente) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a un Green Job" });

            await GreenJob.create({
                job_id,
                job_detalle,
            });

            res.redirect("/greenJobs/listar");
        } catch (error) {
            console.error("Error al registrar el Green Job:", error);
            res.status(500).send("Error al registrar el Green Job.");
        }
    },

    // *** Actualizar un Green Job General ***
    actualizarGreenJob: async (req, res) => {
        try {
            const { job_id, job_detalle } = req.body;

            const greenJob = await GreenJob.findByPk(job_id);
            if (!greenJob) {
                return res.status(404).send("Green Job no encontrado.");
            }

            await greenJob.update({
                job_detalle,
            });

            res.redirect("/greenJobs/listar");
        } catch (error) {
            console.error("Error al actualizar el Green Job:", error);
            res.status(500).send("Error al actualizar el Green Job.");
        }
    },

    // *** Eliminar un Green Job General ***
    eliminarGreenJob: async (req, res) => {
        try {
            const { job_id } = req.params;

            // Verificar si existen registros asociados
            const asociados = await GraduadoGreenJob.findOne({ where: { job_id } });
            if (asociados) {
                return res.status(400).send("No se puede eliminar un Green Job con registros asociados.");
            }

            const greenJob = await GreenJob.findByPk(job_id);
            if (!greenJob) {
                return res.status(404).send("Green Job no encontrado.");
            }

            await greenJob.destroy();
            res.redirect("/greenJobs/listar");
        } catch (error) {
            console.error("Error al eliminar el Green Job:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar este Green Job, ya que tiene datos asociados." });
        }
    },

    // *** Listar Green Jobs por Campus ***
    listarGreenJobsPorCampus: async (req, res) => {
        try {
            const { camp_id } = req.params;
            const { orderBy, orderDir, jobId } = req.query;

            // Condición inicial (filtro por campus)
            const condicion = camp_id ? { camp_id } : {};

            // Filtro por Tipo de Green Job
            if (jobId) {
                condicion.job_id = jobId;
            }

            // Configuración del Orden
            const order = [];
            if (orderBy) {
                order.push([orderBy, orderDir || "ASC"]);
            }

            // Consultar registros de Graduados-Green Jobs
            const graduadosGreenJobs = await GraduadoGreenJob.findAll({
                where: condicion,
                include: [
                    { model: GreenJob, attributes: ["job_id", "job_detalle"], as: "GreenJob" },
                    { model: Campus, attributes: ["camp_id", "camp_nom"] },
                ],
                order,
                raw: true,
                nest: true,
            });

            // Consultar todos los Green Jobs disponibles
            const greenJobs = await GreenJob.findAll({
                attributes: ["job_id", "job_detalle"],
                raw: true,
            });

            // Calcular resumen
            const totalGraduados = graduadosGreenJobs.reduce((acc, item) => acc + (item.gra_cantidad || 0), 0);

            res.render("greenJobs/gestionGreenJobs.ejs", {
                graduadosGreenJobs,
                greenJobs,
                currentCampus: camp_id,
                jobId,
                orderBy,
                orderDir,
                totalGraduados,
            });
        } catch (error) {
            console.error("Error al listar los Green Jobs:", error);
            res.status(500).send("Error al cargar los Green Jobs.");
        }
    },

    // *** Registrar Graduados en un Green Job para un Campus ***
    registrarGraduadosGreenJob: async (req, res) => {
        try {
            const { camp_id } = req.params;
            const { job_id, gra_cantidad } = req.body;

            // Verificar si ya existe el registro
            const existente = await GraduadoGreenJob.findOne({
                where: { camp_id, job_id },
            });

            if (existente) {
                return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a este Green Job" });
            }

            // Crear el registro si no existe
            await GraduadoGreenJob.create({
                camp_id,
                job_id,
                gra_cantidad,
            });

            res.redirect(`/greenJobs/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al registrar los graduados en el Green Job:", error);
            res.status(500).send("Error al registrar los graduados.");
        }
    },

    // *** Actualizar Cantidad de Graduados en un Green Job ***
    actualizarGraduadosGreenJob: async (req, res) => {
        try {
            const { gra_id, gra_cantidad } = req.body;
            const { camp_id } = req.params;

            const graduadoGreenJob = await GraduadoGreenJob.findByPk(gra_id);
            if (!graduadoGreenJob) {
                return res.status(404).send("Registro no encontrado.");
            }

            await graduadoGreenJob.update({
                gra_cantidad,
            });

            res.redirect(`/greenJobs/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al actualizar los graduados:", error);
            res.status(500).send("Error al actualizar los graduados.");
        }
    },

    // *** Eliminar un Registro de Graduados-Green Job ***
    eliminarGraduadosGreenJob: async (req, res) => {
        try {
            const { camp_id, gra_id } = req.params;

            const graduadoGreenJob = await GraduadoGreenJob.findByPk(gra_id);
            if (!graduadoGreenJob) {
                return res.status(404).send("Registro no encontrado.");
            }

            await graduadoGreenJob.destroy();
            res.redirect(`/greenJobs/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al eliminar el registro:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar esta categoría, ya que tiene datos asociados." });
        }
    },


};
