const Driver = window.driver.js.driver

const Hellp = new Driver({
    popoverClass: 'driverjs-theme',
})


Hellp.highlight({
    element: '#Hellp',
    popover: {
        side: 'bottom',
        title: '¿Necesitas ayuda?',
        description: 'Puedo ayudarte con eso :)',
    },
})

const Tour_Animate = new Driver({
    showProgress: true,
    steps: [
        {
            element: '.options',
            popover: {
                title: 'Ejemplo de Tour Animado',
                description:
                    'Aquí hay un ejemplo de código que muestra un tour animado. Vamos a guiarte a través de él.',
                side: 'left',
                align: 'start',
            },
        },
    ],
})
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('Hellp').addEventListener('click', function () {
        Tour_Animate.start() 
    })
})
