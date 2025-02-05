import sequelize from "../config/conexion.js";
import Campus from "../model/campus.model.js";
import modelos from "../model/vehiculos.model.js";
const { TipoVehiculo, TipoEmision, Frecuencia, Vehiculo } = modelos;


export const vehiculosController = {

    listarTiposEmision: async (req, res) => {
        try {
            const tpEmision = await TipoEmision.findAll({
                raw: true,
                nest: true,
            });
            res.render("vehiculos/tiposEmision.ejs", { tpEmision: tpEmision })
        } catch (error) {
            console.error("Error al obtener los tipos de emision:", error);
            res.status(500).send("Error al cargar la pagina");
        }
    },
    registrarTpEmision: async (req, res) => {
        try {
            const { tpe_id, tpe_detalle } = req.body;

            const existe = await TipoEmision.findByPk(tpe_id);

            if (existe) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a un tipo de emision" });

            // Crear el nuevo tipo de emisión
            await TipoEmision.create({
                tpe_id,
                tpe_detalle,
            });

            res.redirect('/vehiculos/tipos-emision');
        } catch (error) {
            console.error("Error al crear el tipo de emisión:", error);
            res.status(500).send("Error al registrar el tipo de emisión.");
        }
    },
    eliminarTpEmision: async (req, res) => {
        try {
            const tpEmi = await TipoEmision.findByPk(req.params.id);
            if (!tpEmi) return res.status(404).send("Tipo de Emision no encontrado");
            await tpEmi.destroy();
            res.redirect('/vehiculos/tipos-emision');
        } catch (error) {
            console.error("Error al eliminar este tipo de emision:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar este tipo de emision, ya que tiene datos asociados." });
        }
    },
    actualizarTpEmision: async (req, res) => {
        try {
            const { tpe_id, tpe_detalle } = req.body;


            const tipoEmision = await TipoEmision.findByPk(tpe_id);
            if (!tipoEmision) {
                return res.status(404).send("Tipo de Emisión no encontrado.");
            }

            await tipoEmision.update({ tpe_detalle });

            res.redirect('/vehiculos/tipos-emision');
        } catch (error) {
            console.error("Error al actualizar el tipo de emisión:", error);
            res.status(500).send("Error al actualizar el tipo de emisión.");
        }
    },




    listarFrecuencias: async (req, res) => {
        try {
            const frecuencia = await Frecuencia.findAll({
                raw: true,
                nest: true,
            });
            res.render("vehiculos/frecuencias.ejs", { datos: frecuencia })
        } catch (error) {
            console.error("Error al obtener las frecuencias:", error);
            res.status(500).send("Error al cargar la pagina");
        }
    },
    registrarFrecuencia: async (req, res) => {
        try {
            const { fre_id, fre_detalle } = req.body;

            const existe = await Frecuencia.findByPk(fre_id);

            if (existe) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a una frecuencia" });

            // Crear el nuevo tipo de emisión
            await Frecuencia.create({
                fre_id,
                fre_detalle,
            });

            res.redirect('/vehiculos/frecuencias');
        } catch (error) {
            console.error("Error al crear la frecuencia: ", error);
            res.status(500).send("Error al registrar la frecuencia.");
        }
    },
    eliminarFrecuencia: async (req, res) => {
        try {
            const frecuencia = await Frecuencia.findByPk(req.params.id);
            if (!frecuencia) return res.status(404).send("Frecuencia no encontrada");
            await frecuencia.destroy();
            res.redirect('/vehiculos/frecuencias');
        } catch (error) {
            console.error("Error al eliminar esta frecuencia:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar esta frecuencia, ya que tiene datos asociados." });
        }
    },
    actualizarFrecuencia: async (req, res) => {
        try {
            const { fre_id, fre_detalle } = req.body;


            const frecuencia = await Frecuencia.findByPk(fre_id);
            if (!frecuencia) {
                return res.status(404).send("Frecuencia no encontrada.");
            }

            await frecuencia.update({ fre_detalle });

            res.redirect('/vehiculos/frecuencias');
        } catch (error) {
            console.error("Error al actualizar la frecuencia:", error);
            res.status(500).send("Error al actualizar ela frecuencia.");
        }
    },




    listarTpVehiculo: async (req, res) => {
        try {
            const tiposVehiculo = await TipoVehiculo.findAll({
                raw: true,
                nest: true,
            });
            res.render("vehiculos/tiposVehiculo.ejs", { datos: tiposVehiculo });
        } catch (error) {
            console.error("Error al obtener los tipos de vehículo:", error);
            res.status(500).send("Error al cargar la página.");
        }
    },

    registrarTpVehiculo: async (req, res) => {
        try {
            const { tpv_id, tpv_detalle } = req.body;

            const existe = await TipoVehiculo.findByPk(tpv_id);

            if (existe) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a un tipo de vehículo" });

            // Crear el nuevo tipo de vehículo
            await TipoVehiculo.create({
                tpv_id,
                tpv_detalle,
            });

            res.redirect('/vehiculos/tipos-vehiculo');
        } catch (error) {
            console.error("Error al crear el tipo de vehículo:", error);
            res.status(500).send("Error al registrar el tipo de vehículo.");
        }
    },

    eliminarTpVehiculo: async (req, res) => {
        try {
            const tipoVehiculo = await TipoVehiculo.findByPk(req.params.id);
            if (!tipoVehiculo) {
                return res.status(404).send("Tipo de Vehículo no encontrado.");
            }
            await tipoVehiculo.destroy();
            res.redirect('/vehiculos/tipos-vehiculo');
        } catch (error) {
            console.error("Error al eliminar este tipo de vehículo:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar este tipo de vehículo, ya que tiene datos asociados." });
        }
    },

    actualizarTpVehiculo: async (req, res) => {
        try {
            const { tpv_id, tpv_detalle } = req.body;

            // Buscar el registro por ID
            const tipoVehiculo = await TipoVehiculo.findByPk(tpv_id);
            if (!tipoVehiculo) {
                return res.status(404).send("Tipo de Vehículo no encontrado.");
            }

            // Actualizar los detalles
            await tipoVehiculo.update({ tpv_detalle });

            res.redirect('/vehiculos/tipos-vehiculo');
        } catch (error) {
            console.error("Error al actualizar el tipo de vehículo:", error);
            res.status(500).send("Error al actualizar el tipo de vehículo.");
        }
    },



    listarVehiculos: async (req, res) => {
        try {
            const { camp_id } = req.params;
            const { tipoVehiculo, tipoEmision, frecuencia, orderBy, orderDir } = req.query;

            // Filtros dinámicos
            const whereCondition = { camp_id };
            if (tipoVehiculo) whereCondition.tpv_id = tipoVehiculo;
            if (tipoEmision) whereCondition.tpe_id = tipoEmision;
            if (frecuencia) whereCondition.fre_id = frecuencia;

            // Configuración del orden
            const order = [];
            if (orderBy) {
                order.push([orderBy, orderDir || "ASC"]);
            }

            // Obtener vehículos con filtros
            const vehiculos = await Vehiculo.findAll({
                where: whereCondition,
                include: [
                    { model: TipoVehiculo, attributes: ['tpv_id', 'tpv_detalle'] },
                    { model: Frecuencia, attributes: ['fre_id', 'fre_detalle'], as: 'Frecuencia' },
                    { model: TipoEmision, attributes: ['tpe_id', 'tpe_detalle'] },
                ],
                order,
                raw: true,
                nest: true,
            });

            // Consultar datos auxiliares
            const tiposVehiculo = await TipoVehiculo.findAll({ raw: true });
            const frecuencias = await Frecuencia.findAll({ raw: true });
            const tiposEmision = await TipoEmision.findAll({ raw: true });
            const campuses = await Campus.findAll({ raw: true });

            // Renderizar vista
            res.render('vehiculos/gestionVehiculos.ejs', {
                vehiculos,
                tiposVehiculo,
                frecuencias,
                tiposEmision,
                campuses,
                currentCampus: camp_id || null,
                tipoVehiculo,
                tipoEmision,
                frecuencia,
                orderBy,
                orderDir,
            });
        } catch (error) {
            console.error("Error al listar los vehículos:", error);
            res.status(500).send("Error al cargar los vehículos.");
        }
    },

    listarImpactoAmbiental : async (req, res) => {
        try {
            const { camp_id } = req.params;
    
            // Consulta SQL directa con Sequelize para obtener el impacto ambiental por campus
            const impactos = await sequelize.query(
                `SELECT 
                    ia.veh_id, 
                    v.tpv_id, 
                    tv.tpv_detalle, 
                    ia.camp_id, 
                    c.camp_nom, 
                    ia.impacto_emision, 
                    ia.emision_total
                FROM GM_TE_IMPACTO_AMBIENTAL ia
                JOIN GM_TE_VEHICULOS v ON ia.veh_id = v.veh_id
                JOIN GM_WSI_CAMPUS c ON ia.camp_id = c.camp_id
                JOIN GM_TE_TIPOS_VEHICULO tv ON v.tpv_id = tv.tpv_id
                WHERE ia.camp_id = :camp_id`,
                {
                    replacements: { camp_id },
                    type: sequelize.QueryTypes.SELECT
                }
            );
    
            res.render('impactoAmbiental/gestionImpacto.ejs', { impactos, currentCampus: camp_id });
        } catch (error) {
            console.error("Error al listar el impacto ambiental:", error);
            res.status(500).send("Error al cargar los datos de impacto ambiental.");
        }
    },

    registrarVehiculo: async (req, res) => {
        try {
            const {
                veh_id,
                fre_id,
                tpe_id,
                tpv_id,
                veh_cantidad,
                veh_cantidad_ruedas,
                veh_distancia_aprox_recorrida,
            } = req.body;

            const { camp_id } = req.params;
            const fecha_registro = new Date();

            // Llamar al procedimiento almacenado de PostgreSQL
            await sequelize.query(
                `SELECT registrar_vehiculo(:veh_id, :fre_id, :tpe_id, :tpv_id, :camp_id, :veh_cantidad, :veh_cantidad_ruedas, :fecha_registro, :veh_distancia)`,
                {
                    replacements: {
                        veh_id,
                        fre_id,
                        tpe_id,
                        tpv_id,
                        camp_id,
                        veh_cantidad,
                        veh_cantidad_ruedas,
                        fecha_registro,
                        veh_distancia: veh_distancia_aprox_recorrida
                    },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            res.redirect(`/vehiculos/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al registrar el vehículo:", error);
            res.status(500).send("Error al registrar el vehículo.");
        }
    },

    // Editar un vehículo existente
    actualizarVehiculo: async (req, res) => {
        try {
            const { veh_id, fre_id, tpe_id, tpv_id, veh_cantidad, veh_cantidad_ruedas, veh_fecha_registro, veh_distancia_aprox_recorrida } = req.body;

            const { camp_id } = req.params;

            const vehiculo = await Vehiculo.findByPk(veh_id);

            if (!vehiculo) {
                return res.status(404).send("Vehículo no encontrado.");
            }

            await vehiculo.update({
                fre_id,
                tpe_id,
                tpv_id,
                veh_cantidad,
                veh_cantidad_ruedas,
                veh_fecha_registro,
                veh_distancia_aprox_recorrida,
            });

            res.redirect(`/vehiculos/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al actualizar el vehículo:", error);
            res.status(500).send("Error al actualizar el vehículo.");
        }
    },

    // Eliminar un vehículo
    eliminarVehiculo: async (req, res) => {
        try {
            const { camp_id, id } = req.params;

            const vehiculo = await Vehiculo.findByPk(id);
            if (!vehiculo) {
                return res.status(404).send("Vehículo no encontrado.");
            }

            await vehiculo.destroy();

            res.redirect(`/vehiculos/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al eliminar el vehículo:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar este vehículo, ya que tiene datos asociados." });
        }
    },

    // Obtener datos auxiliares para el formulario
    obtenerDatosFormulario: async (req, res) => {
        try {
            const tiposVehiculo = await TipoVehiculo.findAll({ raw: true });
            const frecuencias = await Frecuencia.findAll({ raw: true });
            const tiposEmision = await TipoEmision.findAll({ raw: true });

            res.json({ tiposVehiculo, frecuencias, tiposEmision });
        } catch (error) {
            console.error("Error al obtener los datos del formulario:", error);
            res.status(500).send("Error al obtener los datos auxiliares.");
        }
    },





};