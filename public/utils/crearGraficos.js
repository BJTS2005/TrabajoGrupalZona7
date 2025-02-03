function crearGraficoPastel(nombreLabel, nFila, nCantidad, nombreTabla) {
    const tabla = document.querySelector(`#${nombreTabla}`);
    console.log(tabla);
    
    const etiquetas = [];
    const datos = [];
    
    tabla.querySelectorAll('tr').forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length > 0) {
            etiquetas.push(celdas[nFila].textContent.trim());
            if (nCantidad !== -1) {
                datos.push(parseFloat(celdas[nCantidad].textContent) || 0);
            }
        }
    });

    // Consolidar etiquetas y valores
    const consolidado = {};

    if (nCantidad === -1) {
        // Si nCantidad es -1, contar cuántas veces aparece cada etiqueta
        etiquetas.forEach(etiqueta => {
            consolidado[etiqueta] = (consolidado[etiqueta] || 0) + 1;
        });
    } else {
        // Si nCantidad es válido, sumar los valores
        for (let i = 0; i < etiquetas.length; i++) {
            const etiqueta = etiquetas[i];
            const valor = datos[i];

            if (consolidado[etiqueta]) {
                consolidado[etiqueta] += valor;
            } else {
                consolidado[etiqueta] = valor;
            }
        }
    }

    // Crear arrays finales sin duplicados
    const etiquetasUnicas = Object.keys(consolidado);
    const datosSumados = Object.values(consolidado);

    // Crear gráfico de pastel
    const ctx = document.getElementById(`${nombreLabel}`).getContext('2d');
    const miGrafico = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: etiquetasUnicas,
            datasets: [{
                data: datosSumados,
                backgroundColor: [
                    '#9966FF',  // Púrpura vibrante
                    '#FF6384',  // Rosa coral
                    '#36A2EB',  // Azul brillante
                    '#FFCE56',  // Amarillo cálido
                    '#4BC0C0',  // Turquesa
                    '#FF9F40',  // Naranja brillante
                    '#FF99CC',  // Rosa pastel
                    '#7ED321',  // Verde lima
                    '#50E3C2',  // Menta brillante
                    '#FF5C5C'   // Rojo coral
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}



/*function crearGraficoPastel(nombreLabel, nFila, nCantidad, nombreTabla) {
    const tabla = document.querySelector(`#${nombreTabla}`);
            console.log(tabla)
            const datos = []
            const etiquetas = []

            tabla.querySelectorAll('tr').forEach(fila => {
                const celdas = fila.querySelectorAll('td')
                if (celdas.length > 0) {
                    etiquetas.push(celdas[nFila].textContent)
                    datos.push(celdas[nCantidad].textContent)
                }
            });

    // Consolidar etiquetas y sumar sus valores
    const consolidado = {};

    for (let i = 0; i < etiquetas.length; i++) {
        const etiqueta = etiquetas[i];
        const valor = parseFloat(datos[i]) || 0; // Convertir a número

        if (consolidado[etiqueta]) {
            consolidado[etiqueta] += valor;
        } else {
            consolidado[etiqueta] = valor;
        }
    }

    // Crear nuevos arrays sin duplicados
    const etiquetasUnicas = Object.keys(consolidado);
    const datosSumados = Object.values(consolidado);


    const ctx = document.getElementById(`${nombreLabel}`).getContext('2d');
    const miGrafico = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: etiquetasUnicas,
            datasets: [{
                data: datosSumados,
                backgroundColor: [
                    '#9966FF',  // Púrpura vibrante
                    '#FF6384',  // Rosa coral
                    '#36A2EB',  // Azul brillante
                    '#FFCE56',  // Amarillo cálido
                    '#4BC0C0',  // Turquesa
                    '#FF9F40',  // Naranja brillante
                    '#FF99CC',  // Rosa pastel
                    '#7ED321',  // Verde lima
                    '#50E3C2',  // Menta brillante
                    '#FF5C5C'   // Rojo coral
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}*/