import { calcular } from '../services/cotizadorService.js'

export const cotizar = async (req, res) => {
    const { hoja, tamano, impresion, urgencia, hojas } = req.body

    // Validar que no vengan campos vacios
    if (!hoja || !tamano || !impresion || !urgencia || !hojas) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    // Validar cantidad de hojas dentro de los limites
    const cantidad = parseInt(hojas)
    if (isNaN(cantidad)) {
        return res.status(400).json({ error: 'La cantidad de hojas debe ser un número' })
    }

    if (cantidad < 1) {
        return res.status(400).json({ error: 'La cantidad minima es 1 hoja' })
    }
    if (cantidad > 10000) {
        return res.status(400).json({ error: 'La cantidad maxima es de 10000 hojas' })
    }

    // Retornar el resultado
    const resultado = await calcular(hoja, tamano, impresion, urgencia, cantidad)
    res.json(resultado)
}

