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
                description: 'Puedo ayudarte con eso. ;)',
                side: 'left',
                align: 'start',
            },
        },
        {
            element: '.options:nth-child(1)',
            popover: {
                title: 'Opciones',
                description: 'lorem',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '#Materiales',
            popover: {
                title: 'Opciones',
                description: 'lorem',
                side: 'bottom',
                align: 'start',
            },
        },
        {
            element: '#Mano_Obra',
            popover: {
                title: 'Opciones',
                description: 'lorem',
                side: 'bottom',
                align: 'center',
            },
        },
        {
            element: '#Crear_Estimacion',
            popover: {
                title: 'Opciones',
                description: 'lorem',
                side: 'bottom',
                align: 'end',
            },
        },
        {
            element: '#historialContainer',
            popover: {
                title: 'Opciones',
                description: 'lorem',
                side: 'top',
                align: 'start',
            },
        },
    ],
})

document.getElementById('Hellp').addEventListener('click', function () {
    driverObj.drive()
})
