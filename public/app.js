document.addEventListener('DOMContentLoaded', () => {
    // Recupera los datos almacenados en localStorage o establece valores por defecto si no existen.
    const materiales = JSON.parse(localStorage.getItem('materiales')) || []
    const manoObra = JSON.parse(localStorage.getItem('manoObra')) || []
    const Historial = JSON.parse(localStorage.getItem('Historial')) || []

    // Muestra un formulario específico basado en su ID.
    const mostrarFormulario = formularioId => {
        // Oculta todos los formularios.
        document.querySelectorAll('.formulario').forEach(form => (form.style.display = 'none'))
        // Muestra solo el formulario correspondiente.
        document.getElementById(
            `formulario${formularioId.charAt(0).toUpperCase() + formularioId.slice(1)}`,
        ).style.display = 'block'
    }

    // Actualiza la lista de materiales o mano de obra en el DOM.
    const actualizarLista = (listaId, items) => {
        const lista = document.getElementById(listaId)
        lista.innerHTML = '' // Limpia la lista actual.
        items.forEach(item => {
            const itemDiv = document.createElement('div')
            itemDiv.textContent = `${item.nombre} - ${item.cantidad} ${item.unidad} - $${item.precio}`
            lista.appendChild(itemDiv)
        })
    }

    // Limpia los datos de materiales y mano de obra después de la confirmación del usuario.
    const limpiarDatos = () => {
        if (confirm('Esto borrará los datos de "Materiales" y "Mano de obra", ¿Seguro que deseas limpiar los datos?')) {
            localStorage.removeItem('materiales')
            localStorage.removeItem('manoObra')
            window.location.reload() // Recarga la página para reflejar los cambios.
        }
    }

    // Limpia todo el historial de estimaciones.
    const limpiarHistorial = () => {
        if (confirm('¿Estás seguro de que deseas limpiar todos los datos?')) {
            localStorage.removeItem('Historial')
            window.location.reload() // Recarga la página para reflejar los cambios.
        }
    }

    // Muestra el historial de estimaciones.
    const mostrarHistorial = () => {
        const historialContainer = document.getElementById('historialContainer')
        const historialEstimaciones = document.getElementById('historialEstimaciones')
        historialEstimaciones.innerHTML = ''
        const loader = document.createElement('div') // Agrega un loader mientras se carga el historial.
        loader.className = 'loader'
        historialEstimaciones.appendChild(loader)
        setTimeout(() => {
            historialEstimaciones.removeChild(loader)
            Historial.forEach((item, index) => {
                const itemDiv = document.createElement('div')
                itemDiv.className = 'historial-item'
                itemDiv.innerHTML = `
                <p><strong>${item.fechaProyecto}</strong></p>
                <p><strong>${item.Proyecto}</strong></p>
                <p><strong>Materiales:</strong><br> ${item.materiales
                    .map(mat => `${mat.nombre}: ${mat.cantidad} * $${mat.precio}`)
                    .join('<br>')}</p>
                <p><strong>Total Materiales:</strong>$${Number(
                    item.totalMateriales.replace('Total Materiales: $', ''),
                ).toFixed(2)}</p>
                <p><strong>Mano de Obra:</strong><br> ${item.manoObra
                    .map(trab => `${trab.nombre}: ${trab.cantidad} * $${trab.precio}`)
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

    // Función para agregar nuevos materiales.
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

    // Función para agregar nueva mano de obra.
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

    // Función para crear una estimación del proyecto.
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

    // Función para imprimir la estimación como PDF.
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

        // Configuración del formato y tamaño de texto del PDF.
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

        // Almacena la estimación actual en el historial.
        Historial.push({
            fechaProyecto: fechaProyecto,
            Proyecto: nombreProyecto,
            materiales: materiales,
            totalMateriales: totalMateriales,
            manoObra: manoObra,
            totalManoObra: totalManoObra,
            totalEstimado: totalEstimado,
        })

        // Limita el número máximo de elementos en el historial.
        const maxHistorialItems = 50
        if (Historial.length > maxHistorialItems) {
            Historial.shift() // Elimina el elemento más antiguo.
        }

        localStorage.setItem('Historial', JSON.stringify(Historial))
        window.location.reload()
    }

    // Inicializa las listas y funciones del historial.
    actualizarLista('listaMateriales', materiales)
    actualizarLista('listaManoObra', manoObra)
    actualizarLista('listaManoObraProyecto', manoObra)
    actualizarLista('listaMaterialesProyecto', materiales)

    // Asigna las funciones a los elementos del DOM.
    window.limpiarDatos = limpiarDatos
    window.limpiarHistorial = limpiarHistorial
    window.imprimirEstimacion = imprimirEstimacion
    window.mostrarFormulario = mostrarFormulario
    window.mostrarHistorial = mostrarHistorial

    // Muestra el historial al cargar la página.
    mostrarHistorial()
})
