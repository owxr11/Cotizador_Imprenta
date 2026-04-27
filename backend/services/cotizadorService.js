import { supabase } from "../config/supabase.js";

export const calcular = async (hoja, tamano, tipo, urgencia, cantidad) => {
    // Consultar modificadores desde Supabase
    const { data: dataHoja } = await supabase.from('tipos_hoja').select('id, price').eq('type', hoja).single()
    const { data: dataTamano } = await supabase.from('tamanos').select('id, price').eq('type', tamano).single()
    const { data: dataImpresion } = await supabase.from('impresion').select('id, price').eq('type', tipo).single()
    const { data: dataUrgencia } = await supabase.from('urgencias').select('id, price').eq('type', urgencia).single()

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
        cantidad: cantidad,
        costo_papel: costoPapel.toFixed(2),
        costo_tinta: costoTinta.toFixed(2),
        recargo: totalRecargo.toFixed(2),
        precio_total: total.toFixed(2)
    })

    console.log('error insert:', error)
    console.log('data insert:', data)


    return {
        costoPapel: costoPapel.toFixed(2),
        costoTinta: costoTinta.toFixed(2),
        recargo: totalRecargo.toFixed(2),
        total: total.toFixed(2)
    }
}



