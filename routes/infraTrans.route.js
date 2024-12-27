import { infraestructurasController } from "../controllers/infTrans.controller.js";
import  express  from "express";

const router = express.Router();

router.get('/tipos', infraestructurasController.listarTiposInfraestructura);
router.post('/tipos', infraestructurasController.registrarTipoInfraestructura);
router.post('/tipos/eliminar/:id', infraestructurasController.eliminarTipoInfraestructura);
router.post('/tipos/actualizar', infraestructurasController.actualizarTipoInfraestructura);

router.get('/gestionar/:camp_id', infraestructurasController.listarInfraestructuras);
router.post('/gestionar/:camp_id', infraestructurasController.registrarInfraestructura);
router.post('/gestionar/:camp_id/eliminar/:id', infraestructurasController.eliminarInfraestructura);
router.post('/gestionar/:camp_id/actualizar', infraestructurasController.actualizarInfraestructura);

export default router;