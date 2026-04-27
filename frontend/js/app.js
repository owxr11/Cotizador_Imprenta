// Escuchar botones
document.getElementById('btn-calcular').addEventListener('click', calcular)
document.getElementById('btn-borrar').addEventListener('click', borrar)

// Mostrar lo que respondió el backend
function mostrarResultados(datos) {
    document.getElementById('res-papel').textContent = '$' + datos.costoPapel;
    document.getElementById('res-tinta').textContent = '$' + datos.costoTinta;
    document.getElementById('res-recargo').textContent = '$' + datos.recargo;
    document.getElementById('res-total').textContent = 'Total a pagar: $' + datos.total + ' MX';
}

// Limpiar formulario
function borrar() {
    document.getElementById('sel-hoja').selectedIndex = 0;
    document.getElementById('sel-tamano').selectedIndex = 0;
    document.getElementById('sel-impresion').selectedIndex = 0;
    document.getElementById('sel-urgencia').selectedIndex = 0;
    document.getElementById('inp-hojas').value = '';
    document.getElementById('res-papel').textContent = '$0.00';
    document.getElementById('res-tinta').textContent = '$0.00';
    document.getElementById('res-recargo').textContent = '$0.00';
    document.getElementById('res-total').textContent = 'Total a pagar: $0.00 MX';
}// Escuchar botones
document.getElementById('btn-calcular').addEventListener('click', calcular)
document.getElementById('btn-borrar').addEventListener('click', borrar)

async function calcular() {

    // Bloquear campos y botón antes de mandar la petición
    bloquear()

    const hoja = document.getElementById('sel-hoja').value;
    const tamano = document.getElementById('sel-tamano').value;
    const impresion = document.getElementById('sel-impresion').value;
    const urgencia = document.getElementById('sel-urgencia').value;
    const hojas = document.getElementById('inp-hojas').value;

    const respuesta = await fetch('http://localhost:3000/api/cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hoja, tamano, impresion, urgencia, hojas })
    });

    const datos = await respuesta.json();
    mostrarResultados(datos);
}

function mostrarResultados(datos) {
    document.getElementById('res-papel').textContent = '$' + datos.costoPapel;
    document.getElementById('res-tinta').textContent = '$' + datos.costoTinta;
    document.getElementById('res-recargo').textContent = '$' + datos.recargo;
    document.getElementById('res-total').textContent = 'Total a pagar: $' + datos.total + ' MX';
}

// Bloquear todos los campos y el botón calcular
function bloquear() {
    document.getElementById('sel-hoja').disabled = true;
    document.getElementById('sel-tamano').disabled = true;
    document.getElementById('sel-impresion').disabled = true;
    document.getElementById('sel-urgencia').disabled = true;
    document.getElementById('inp-hojas').disabled = true;
    document.getElementById('btn-calcular').disabled = true;
}

// Habilitar todos los campos y limpiar
function borrar() {
    document.getElementById('sel-hoja').disabled = false;
    document.getElementById('sel-tamano').disabled = false;
    document.getElementById('sel-impresion').disabled = false;
    document.getElementById('sel-urgencia').disabled = false;
    document.getElementById('inp-hojas').disabled = false;
    document.getElementById('btn-calcular').disabled = false;

    document.getElementById('sel-hoja').selectedIndex = 0;
    document.getElementById('sel-tamano').selectedIndex = 0;
    document.getElementById('sel-impresion').selectedIndex = 0;
    document.getElementById('sel-urgencia').selectedIndex = 0;
    document.getElementById('inp-hojas').value = '';
    document.getElementById('res-papel').textContent = '$0.00';
    document.getElementById('res-tinta').textContent = '$0.00';
    document.getElementById('res-recargo').textContent = '$0.00';
    document.getElementById('res-total').textContent = 'Total a pagar: $0.00 MX';
}