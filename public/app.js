document.addEventListener('DOMContentLoaded', () => {
    const materiales = JSON.parse(localStorage.getItem('materiales')) || []
    const manoObra = JSON.parse(localStorage.getItem('manoObra')) || []

    const mostrarFormulario = formularioId => {
        document.querySelectorAll('.formulario').forEach(form => (form.style.display = 'none'))
        document.getElementById(
            `formulario${formularioId.charAt(0).toUpperCase() + formularioId.slice(1)}`,
        ).style.display = 'block'
    }

    const actualizarLista = (listaId, items) => {
        const lista = document.getElementById(listaId)
        lista.innerHTML = ''
        items.forEach(item => {
            const itemDiv = document.createElement('div')
            itemDiv.textContent = `${item.nombre} - ${item.cantidad || item.metros} - $${item.precio}`
            lista.appendChild(itemDiv)
        })
    }

    const limpiarDatos = () => {
        if (confirm('¿Estás seguro de que deseas limpiar todos los datos?')) {
            localStorage.removeItem('materiales')
            localStorage.removeItem('manoObra')
            window.location.reload()
        }
    }

    document.getElementById('formMateriales').addEventListener('submit', e => {
        e.preventDefault()
        const nombreMaterial = document.getElementById('nombreMaterial').value
        const cantidadMaterial = document.getElementById('cantidadMaterial').value
        const precioMaterial = document.getElementById('precioMaterial').value
        materiales.push({ nombre: nombreMaterial, cantidad: cantidadMaterial, precio: precioMaterial })
        localStorage.setItem('materiales', JSON.stringify(materiales))
        document.getElementById('formMateriales').reset()
        actualizarLista('listaMateriales', materiales)
        actualizarLista('listaMaterialesProyecto', materiales)
    })

    document.getElementById('formManoObra').addEventListener('submit', e => {
        e.preventDefault()
        const nombreTrabajo = document.getElementById('nombreTrabajo').value
        const cantidadMetros = document.getElementById('cantidadMetros').value
        const precioTrabajo = document.getElementById('precioTrabajo').value
        manoObra.push({ nombre: nombreTrabajo, metros: cantidadMetros, precio: precioTrabajo })
        localStorage.setItem('manoObra', JSON.stringify(manoObra))
        document.getElementById('formManoObra').reset()
        actualizarLista('listaManoObra', manoObra)
        actualizarLista('listaManoObraProyecto', manoObra)
    })

    document.getElementById('formProyecto').addEventListener('submit', e => {
        e.preventDefault()
        const nombreProyecto = document.getElementById('nombreProyecto').value
        let totalMateriales = 0
        let totalManoObra = 0

        materiales.forEach(material => {
            totalMateriales += Number(material.cantidad) * Number(material.precio)
        })

        manoObra.forEach(trabajo => {
            totalManoObra += Number(trabajo.metros) * Number(trabajo.precio)
        })

        const total = totalMateriales + totalManoObra

        document.getElementById('detalleEstimacion').innerHTML = `
            <p>Nombre del Proyecto: ${nombreProyecto}</p>
            <p>Total Materiales: $${totalMateriales.toFixed(2)}</p>
            <p>Total Mano de Obra: $${totalManoObra.toFixed(2)}</p>
            <p>Total Estimado: $${total.toFixed(2)}</p>
        `
        document.getElementById('resultadoEstimacion').style.display = 'block'
    })

    const imprimirEstimacion = () => {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF()

        const nombreProyecto = document.querySelector('#detalleEstimacion p:nth-child(1)').textContent
        const totalMateriales = document.querySelector('#detalleEstimacion p:nth-child(2)').textContent
        const totalManoObra = document.querySelector('#detalleEstimacion p:nth-child(3)').textContent
        const totalEstimado = document.querySelector('#detalleEstimacion p:nth-child(4)').textContent
        const fechaProyecto = document.getElementById('fechaProyecto').value
        doc.text(fechaProyecto, 10, 10)
        doc.text(nombreProyecto, 10, 20)
        doc.text(totalMateriales, 10, 30)
        doc.text(totalManoObra, 10, 40)
        doc.text(totalEstimado, 10, 50)

        doc.save('estimacion.pdf')
    }

    actualizarLista('listaMateriales', materiales)
    actualizarLista('listaManoObra', manoObra)
    actualizarLista('listaManoObraProyecto', manoObra)
    actualizarLista('listaManoObraProyecto', manoObra)

    window.limpiarDatos = limpiarDatos
    window.imprimirEstimacion = imprimirEstimacion
    window.mostrarFormulario = mostrarFormulario
})
