const tiposHoja = {
    Bond: 1.00,
    Couche: 2.00,
    Opalina: 2.50,
    Fotografico: 3.50,
    Cartulina: 4.00
}

const tamanos = {
    Carta: 1.0,
    Oficio: 1.3,
    Tabloide: 1.8,
    A3: 2.0
}

const impresion = {
    BlancoNegro: 0.30,
    Color: 0.80,
}

const urgencias = {
    Normal: 0.00,
    Regular: 0.20,
    Alta: 0.40
}

// Funcion cotizar imprenta 
export const calcular = (hoja, tamano, tipo, urgencia, hojas) => {

    // Obtencion de datos
    const precioPapel = tiposHoja[hoja]
    const factor = tamanos[tamano]
    const tinta = impresion[tipo]
    const recargo = urgencias[urgencia]

    // Formulas 
    const costoPapel = hojas * precioPapel * factor
    const costoTinta = hojas * tinta * factor
    const subtotal = costoPapel + costoTinta
    const totalRecargo = subtotal * recargo
    const total = subtotal + totalRecargo

    // respuesta
    return {
        costoPapel: costoPapel.toFixed(2),
        costoTinta: costoTinta.toFixed(2),
        recargo: totalRecargo.toFixed(2),
        total: total.toFixed(2)
    }
}