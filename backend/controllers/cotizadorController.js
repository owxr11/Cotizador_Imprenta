import { json } from 'express'
import { supabase } from '../config/supabase.js'
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

export const getCotizacion = async (req, res) => {
    const { id } = req.params

    const { data, error } = await supabase
        .from('cotizacion')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return res.status(500).json({ error })
    res.json(data)
}

export const saveCobro = async (req, res) => {
    const { cotizacion_id, monto_pagado, cambio } = req.body

    if (!cotizacion_id || !monto_pagado || cambio === undefined) {
        return res.status(400).json({ ok: false, error: 'Faltan datos' })
    }

    if (monto_pagado <= 0) {
        return res.status(400).json({ ok: false, error: 'Pago inválido' })
    }

    if (cambio < 0) {
        return res.status(400).json({ ok: false, error: 'Pago insuficiente' })
    }

    const { error } = await supabase.from('cobros').insert({
        cotizacion_id,
        monto_pagado,
        cambio
    })

    console.log('error saveCobro:', error)

    if (error) return res.status(500).json({ ok: false, error })
    res.json({ ok: true })
}