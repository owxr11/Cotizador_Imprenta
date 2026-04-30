import { Router } from 'express'
import { cotizar, getCotizacion, saveCobro } from '../controllers/cotizadorController.js'

const router = Router()

// Ruta para ingresar a cotizar
router.post('/cotizar', cotizar)
router.get('/cobro/:id', getCotizacion)
router.post('/cobro', saveCobro)

export default router