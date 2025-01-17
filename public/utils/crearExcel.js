function exportTableToExcel(tableID, filename, titulo) {
    const table = document.getElementById(tableID);
    const rows = Array.from(table.querySelectorAll('tr'));

    const data = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('th, td'));
        cells.pop();
        return cells.map(cell => {
            const cellContent = cell.querySelector('button, from') ? '' : cell.textContent.trim();
            return cellContent;
        });
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data, { origin: 'A2' });

    // Agregar el título fusionado
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: data[0].length - 1 } }
    ];

    ws[XLSX.utils.encode_cell({ r: 0, c: 0 })] = {
        v: titulo,
        t: 's'
    };

    // Calcular el ancho máximo para cada columna
    const colWidths = data.reduce((widths, row) => {
        row.forEach((cell, i) => {
            const cellLength = cell ? cell.toString().length : 0;
            widths[i] = Math.max(widths[i] || 0, cellLength);
        });
        return widths;
    }, []);

    // Establecer el ancho de las columnas
    ws['!cols'] = colWidths.map(width => ({
        wch: width
    }));

    XLSX.utils.book_append_sheet(wb, ws, 'Vehiculos');
    XLSX.writeFile(wb, filename);
}