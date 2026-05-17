const params = new URLSearchParams(window.location.search)
const cotizacionId = params.get('id')
let totalCotizacion = parseFloat(params.get('total'))

function cargarCotizacion() {
    document.getElementById('r-hoja').textContent = params.get('hoja')
    document.getElementById('r-tamano').textContent = params.get('tamano')
    document.getElementById('r-impresion').textContent = params.get('impresion')
    document.getElementById('r-urgencia').textContent = params.get('urgencia')
    document.getElementById('r-cantidad').textContent = params.get('cantidad')
    document.getElementById('r-papel').textContent = '$' + params.get('papel')
    document.getElementById('r-tinta').textContent = '$' + params.get('tinta')
    document.getElementById('r-recargo').textContent = '$' + params.get('recargo')
    document.getElementById('r-total').textContent = 'Total: $' + params.get('total') + ' MX'
}

function calcCambio() {
    const pagado = parseFloat(document.getElementById('inp-pagado').value) || 0
    const cambio = pagado - totalCotizacion
    const resCambio = document.getElementById('res-cambio')
    const btnGuardar = document.getElementById('btn-guardar')

    if (pagado >= totalCotizacion) {
        resCambio.textContent = '$' + cambio.toFixed(2)
        resCambio.classList.remove('text-danger')
        resCambio.classList.add('text-success')
        btnGuardar.disabled = false
    } else {
        resCambio.textContent = pagado > 0 ? '— Pago insuficiente' : '—'
        resCambio.classList.remove('text-success')
        resCambio.classList.add('text-danger')
        btnGuardar.disabled = true
    }
}

async function guardarCobro() {
    const pagado = parseFloat(document.getElementById('inp-pagado').value)
    const cambio = pagado - totalCotizacion

    const res = await fetch('http://localhost:3000/api/cobro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cotizacion_id: cotizacionId,
            monto_pagado: pagado.toFixed(2),
            cambio: cambio.toFixed(2)
        })
    })

    const datos = await res.json()
    const msg = document.getElementById('msg-status')
    msg.style.display = 'block'

    if (datos.ok) {
        msg.className = 'mt-3 text-center text-success fw-bold'
        msg.textContent = 'Cobro guardado correctamente'
        document.getElementById('btn-guardar').disabled = true
        document.getElementById('inp-pagado').disabled = true
        document.getElementById('btn-ticket').disabled = false
    } else {
        msg.className = 'mt-3 text-center text-danger'
        msg.textContent = 'Error al guardar el cobro'
    }
}

function generarTicket() {
    const { jsPDF } = window.jspdf
    const doc = new jsPDF({ unit: 'mm', format: [80, 150] })

    const hoja = document.getElementById('r-hoja').textContent
    const tamano = document.getElementById('r-tamano').textContent
    const impresion = document.getElementById('r-impresion').textContent
    const urgencia = document.getElementById('r-urgencia').textContent
    const cantidad = document.getElementById('r-cantidad').textContent
    const papel = document.getElementById('r-papel').textContent
    const tinta = document.getElementById('r-tinta').textContent
    const recargo = document.getElementById('r-recargo').textContent
    const total = document.getElementById('r-total').textContent
    const pagado = '$' + document.getElementById('inp-pagado').value
    const cambio = document.getElementById('res-cambio').textContent

    let y = 10

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('IMPRENTA', 40, y, { align: 'center' })
    y += 6

    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Ticket de Venta', 40, y, { align: 'center' })
    y += 4
    doc.text(new Date().toLocaleString('es-MX'), 40, y, { align: 'center' })
    y += 6

    doc.setLineWidth(0.3)
    doc.line(5, y, 75, y)
    y += 5

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('DETALLE DEL PEDIDO', 5, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.text('Tipo de hoja:', 5, y)
    doc.text(hoja, 75, y, { align: 'right' })
    y += 5

    doc.text('Tamano:', 5, y)
    doc.text(tamano, 75, y, { align: 'right' })
    y += 5

    doc.text('Impresion:', 5, y)
    doc.text(impresion, 75, y, { align: 'right' })
    y += 5

    doc.text('Urgencia:', 5, y)
    doc.text(urgencia, 75, y, { align: 'right' })
    y += 5

    doc.text('Cantidad:', 5, y)
    doc.text(cantidad + ' hojas', 75, y, { align: 'right' })
    y += 6

    doc.line(5, y, 75, y)
    y += 5

    doc.setFont('helvetica', 'bold')
    doc.text('DESGLOSE', 5, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.text('Costo papel:', 5, y)
    doc.text(papel, 75, y, { align: 'right' })
    y += 5

    doc.text('Costo tinta:', 5, y)
    doc.text(tinta, 75, y, { align: 'right' })
    y += 5

    doc.text('Recargo:', 5, y)
    doc.text(recargo, 75, y, { align: 'right' })
    y += 6

    doc.line(5, y, 75, y)
    y += 5

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL:', 5, y)
    doc.text(total, 75, y, { align: 'right' })
    y += 6

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Pagado:', 5, y)
    doc.text(pagado, 75, y, { align: 'right' })
    y += 5

    doc.text('Cambio:', 5, y)
    doc.text(cambio, 75, y, { align: 'right' })
    y += 8

    doc.line(5, y, 75, y)
    y += 5
    doc.setFontSize(8)
    doc.text('Gracias por su preferencia!', 40, y, { align: 'center' })

    doc.save(`ticket-${cotizacionId}.pdf`)
}

cargarCotizacion()