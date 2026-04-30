import { supabase } from "../config/supabase.js"

// Cache de precios
let cache = null

async function getPrecios() {
    if (cache) return cache  // si ya tiene datos no consulta de nuevo

    const [hojas, tamanos, impresiones, urgencias] = await Promise.all([
        supabase.from('tipos_hoja').select('type, id, price'),
        supabase.from('tamanos').select('type, id, price'),
        supabase.from('impresion').select('type, id, price'),
        supabase.from('urgencias').select('type, id, price'),
    ])

    cache = {
        hojas: hojas.data,
        tamanos: tamanos.data,
        impresiones: impresiones.data,
        urgencias: urgencias.data
    }

    return cache
}

export const calcular = async (hoja, tamano, tipo, urgencia, cantidad) => {
    const precios = await getPrecios()

    const dataHoja = precios.hojas.find(h => h.type === hoja)
    const dataTamano = precios.tamanos.find(t => t.type === tamano)
    const dataImpresion = precios.impresiones.find(i => i.type === tipo)
    const dataUrgencia = precios.urgencias.find(u => u.type === urgencia)

    console.log('dataHoja:', dataHoja)
    console.log('dataTamano:', dataTamano)
    console.log('dataImpresion:', dataImpresion)
    console.log('dataUrgencia:', dataUrgencia)

    // Calcular 
    const costoPapel = cantidad * dataHoja.price * dataTamano.price
    const costoTinta = cantidad * dataImpresion.price * dataTamano.price
    const subtotal = costoPapel + costoTinta
    const totalRecargo = subtotal * dataUrgencia.price
    const total = subtotal + totalRecargo

    // Guardar cotizar en Supabase 
    const { data, error } = await supabase.from('cotizacion').insert({
        tipo_hoja_id: dataHoja.id,
        tamano_id: dataTamano.id,
        impresion_id: dataImpresion.id,
        urgencia_id: dataUrgencia.id,
        hoja_nombre: hoja,
        tamano_nombre: tamano,
        impresion_nombre: tipo,
        urgencia_nombre: urgencia,
        cantidad: cantidad,
        costo_papel: costoPapel.toFixed(2),
        costo_tinta: costoTinta.toFixed(2),
        recargo: totalRecargo.toFixed(2),
        precio_total: total.toFixed(2)
    }).select()

    console.log('error insert:', error)
    console.log('data insert:', data)


    return {
        id: data[0].id,
        costoPapel: costoPapel.toFixed(2),
        costoTinta: costoTinta.toFixed(2),
        recargo: totalRecargo.toFixed(2),
        total: total.toFixed(2)
    }
}



