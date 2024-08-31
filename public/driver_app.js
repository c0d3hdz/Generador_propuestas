const driver = window.driver.js.driver
const driverObj = driver({
    popoverClass: 'driverjs-theme',
    animate: true,
    showProgress: false,
    showButtons: ['next', 'previous'],
    steps: [
        {
            element: '#Hellp',
            popover: {
                title: '¿Necesitas ayuda?',
                description: 'Haz clic aquí para obtener asistencia sobre cómo usar la aplicación.',
                side: 'left',
                align: 'start',
            },
        },
        {
            element: '.options:nth-child(1)',
            popover: {
                title: 'Opciones',
                description: 'Selecciona las opciones disponibles para crear tu estimación.',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '#Materiales',
            popover: {
                title: 'Materiales',
                description: 'Agrega los materiales necesarios, especificando la cantidad y el precio de cada uno.',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '#Mano_Obra',
            popover: {
                title: 'Mano de Obra',
                description: 'Introduce el tipo de trabajo, cantidades y precios de la mano de obra requerida.',
                side: 'bottom',
                align: 'center',
            },
        },
        {
            element: '#Crear_Estimacion',
            popover: {
                title: 'Crear Estimación',
                description: 'Genera la estimación final con toda la información ingresada.',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            element: '#historialContainer',
            popover: {
                title: 'Historial de Estimaciones',
                description: 'Visualiza todas las estimaciones generadas anteriormente.',
                side: 'top',
                align: 'start',
            },
        },
    ],
})

document.getElementById('Hellp').addEventListener('click', function () {
    driverObj.drive()
})
