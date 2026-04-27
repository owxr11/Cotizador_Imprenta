import { Router } from 'express'
import { cotizar } from '../controllers/cotizadorController.js'

const router = Router()

// Ruta para ingresar a cotizar
router.post('/cotizar', cotizar)

export default router