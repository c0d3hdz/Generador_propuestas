document.addEventListener('DOMContentLoaded', () => {
    const materiales = JSON.parse(localStorage.getItem('materiales')) || []
    const manoObra = JSON.parse(localStorage.getItem('manoObra')) || []
    const Historial = JSON.parse(localStorage.getItem('Historial')) || []
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
            itemDiv.textContent = `${item.nombre} - ${item.cantidad} ${item.unidad} - $${item.precio}`
            lista.appendChild(itemDiv)
        })
    }

    const limpiarDatos = () => {
        if (confirm('Esto borrara los datos de "Materiales" y "Mano de obra", ¿Seguro que deseas limpiar los datos?')) {
            localStorage.removeItem('materiales')
            localStorage.removeItem('manoObra')
            window.location.reload()
        }
    }
    const limpiarHistorial = () => {
        if (confirm('¿Estás seguro de que deseas limpiar todos los datos?')) {
            localStorage.removeItem('Historial')
            window.location.reload()
        }
    }

    const mostrarHistorial = () => {
        const historialContainer = document.getElementById('historialContainer')
        const historialEstimaciones = document.getElementById('historialEstimaciones')
        historialEstimaciones.innerHTML = ''
        const loader = document.createElement('div')
        loader.className = 'loader'
        historialEstimaciones.appendChild(loader)
        setTimeout(() => {
            historialEstimaciones.removeChild(loader)
            Historial.forEach((item, index) => {
                const itemDiv = document.createElement('div')
                itemDiv.className = 'historial-item'
                itemDiv.innerHTML = `
                <p><strong>Fecha:</strong> ${item.fechaProyecto}</p>
                <p><strong>Proyecto:</strong> ${item.Proyecto}</p>
                <p><strong>Materiales:</strong> ${item.materiales
                    .map(mat => `${mat.nombre}: ${mat.cantidad} * $${mat.precio}`)
                    .join('<br>')}</p>
                <p><strong>Total Materiales:</strong> $${Number(
                    item.totalMateriales.replace('Total Materiales: $', ''),
                ).toFixed(2)}</p>
                <p><strong>Mano de Obra:</strong> ${item.manoObra
                    .map(trab => `${trab.nombre}: ${trab.metros} * $${trab.precio}`)
                    .join('<br>')}</p>
                <p><strong>Total Mano de Obra:</strong> $${Number(
                    item.totalManoObra.replace('Total Mano de Obra: $', ''),
                ).toFixed(2)}</p>
                <p><strong>Total Estimado:</strong> $${Number(
                    item.totalEstimado.replace('Total Estimado: $', ''),
                ).toFixed(2)}</p>
            `
                historialEstimaciones.appendChild(itemDiv)
            })
            historialContainer.style.display = 'block'
        }, 1000)
    }

    document.getElementById('formMateriales').addEventListener('submit', e => {
        e.preventDefault()
        const nombreMaterial = document.getElementById('nombreMaterial').value
        const cantidadMaterial = document.getElementById('cantidadMaterial').value
        const unidadMaterial = document.getElementById('unidadMaterial').value
        const precioMaterial = document.getElementById('precioMaterial').value
        materiales.push({
            nombre: nombreMaterial,
            cantidad: cantidadMaterial,
            unidad: unidadMaterial,
            precio: precioMaterial,
        })
        localStorage.setItem('materiales', JSON.stringify(materiales))
        document.getElementById('formMateriales').reset()
        actualizarLista('listaMateriales', materiales)
        actualizarLista('listaMaterialesProyecto', materiales)
    })

    document.getElementById('formManoObra').addEventListener('submit', e => {
        e.preventDefault()
        const nombreTrabajo = document.getElementById('nombreTrabajo').value
        const cantidadMetros = document.getElementById('cantidadMetros').value
        const unidadTrabajo = document.getElementById('unidadTrabajo').value
        const precioTrabajo = document.getElementById('precioTrabajo').value
        manoObra.push({ nombre: nombreTrabajo, cantidad: cantidadMetros, unidad: unidadTrabajo, precio: precioTrabajo })
        localStorage.setItem('manoObra', JSON.stringify(manoObra))
        document.getElementById('formManoObra').reset()
        actualizarLista('listaManoObra', manoObra)
        actualizarLista('listaManoObraProyecto', manoObra)
    })

    document.getElementById('formProyecto').addEventListener('submit', e => {
        e.preventDefault()
        const nombreProyecto = document.getElementById('nombreProyecto').value
        const fechaProyecto = document.getElementById('fechaProyecto').value
        let totalMateriales = 0
        let totalManoObra = 0

        materiales.forEach(material => {
            totalMateriales += Number(material.cantidad) * Number(material.precio)
        })

        manoObra.forEach(trabajo => {
            totalManoObra += Number(trabajo.cantidad) * Number(trabajo.precio)
        })

        const total = totalMateriales + totalManoObra

        const materialesDetalle = materiales
            .map(material => `${material.nombre}: ${material.cantidad} * $${material.precio}`)
            .join('<br>')
        const manoObraDetalle = manoObra
            .map(trabajo => `${trabajo.nombre}: ${trabajo.cantidad} * $${trabajo.precio}`)
            .join('<br>')

        document.getElementById('detalleEstimacion').innerHTML = `
        <p>Nombre del Proyecto: ${nombreProyecto}</p>
        <p>Fecha: ${fechaProyecto}</p>
        <p>Materiales:<br>${materialesDetalle}</p>
        <p>Total Materiales: $${totalMateriales.toFixed(2)}</p>
        <p>Mano de Obra:<br>${manoObraDetalle}</p>
        <p>Total Mano de Obra: $${totalManoObra.toFixed(2)}</p>
        <p>Total Estimado: $${total.toFixed(2)}</p>
    `
        document.getElementById('resultadoEstimacion').style.display = 'block'
    })

    const imprimirEstimacion = () => {
        const { jsPDF } = window.jspdf
        const doc = new jsPDF()

        const titleFontSize = 16
        const sectionFontSize = 14
        const textFontSize = 12
        const lineHeight = 10
        const startX = 10
        let currentY = 10

        const nombreProyecto = document.querySelector('#detalleEstimacion p:nth-child(1)').textContent
        const fechaProyecto = document.querySelector('#detalleEstimacion p:nth-child(2)').textContent
        const materialesDetalle = materiales
            .map(material => `${material.nombre}: ${material.cantidad} ${material.unidad} * $${material.precio}`)
            .join('\n')
        const totalMateriales = document.querySelector('#detalleEstimacion p:nth-child(4)').textContent
        const manoObraDetalle = manoObra
            .map(trabajo => `${trabajo.nombre}: ${trabajo.cantidad} ${trabajo.unidad} * $${trabajo.precio}`)
            .join('\n')
        const totalManoObra = document.querySelector('#detalleEstimacion p:nth-child(6)').textContent
        const totalEstimado = document.querySelector('#detalleEstimacion p:nth-child(7)').textContent

        doc.setFontSize(titleFontSize)
        doc.text('Estimación del Proyecto', startX, currentY)
        currentY += lineHeight

        doc.setFontSize(sectionFontSize)
        doc.text(`${fechaProyecto}`, startX, currentY)
        currentY += lineHeight
        doc.text(`${nombreProyecto}`, startX, currentY)
        currentY += lineHeight * 1.5

        doc.setFontSize(textFontSize)
        doc.text(materialesDetalle, startX, currentY)
        currentY += lineHeight * materiales.length

        doc.setFontSize(sectionFontSize)
        doc.text(totalMateriales, startX, currentY)
        currentY += lineHeight * 1.5

        doc.setFontSize(textFontSize)
        doc.text(manoObraDetalle, startX, currentY)
        currentY += lineHeight * manoObra.length

        doc.setFontSize(sectionFontSize)
        doc.text(totalManoObra, startX, currentY)
        currentY += lineHeight * 1.5

        doc.setFontSize(sectionFontSize)
        doc.text(totalEstimado, startX, currentY)
        currentY += lineHeight * 1.5

        doc.save('estimacion.pdf')

        Historial.push({
            fechaProyecto: fechaProyecto,
            Proyecto: nombreProyecto,
            materiales: materiales,
            totalMateriales: totalMateriales,
            manoObra: manoObra,
            totalManoObra: totalManoObra,
            totalEstimado: totalEstimado,
        })
        localStorage.setItem('Historial', JSON.stringify(Historial))
        window.location.reload()
    }

    actualizarLista('listaMateriales', materiales)
    actualizarLista('listaManoObra', manoObra)
    actualizarLista('listaManoObraProyecto', manoObra)
    actualizarLista('listaMaterialesProyecto', materiales)

    window.limpiarDatos = limpiarDatos
    window.limpiarHistorial = limpiarHistorial
    window.imprimirEstimacion = imprimirEstimacion
    window.mostrarFormulario = mostrarFormulario
    window.mostrarHistorial = mostrarHistorial
    mostrarHistorial()
})
