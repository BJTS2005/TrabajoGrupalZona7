
const modalEditar = document.getElementById('modalEditarIndicador');
modalEditar.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const cod = button.getAttribute('data-cod');
    const nombre = button.getAttribute('data-nombre');
    const puntos = button.getAttribute('data-puntos');
    const mie_ci = button.getAttribute('data-mie_ci');

    modalEditar.querySelector('#ind_cod_editar').value = cod;
    modalEditar.querySelector('#ind_nombre_editar').value = nombre;
    modalEditar.querySelector('#ind_puntos_editar').value = puntos;
    modalEditar.querySelector('#mie_ci_editar').value = mie_ci;
});


const modalGestionarRangos = document.getElementById("modalGestionarRangos");
modalGestionarRangos.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const ind_cod = button.getAttribute("data-ind_cod");
    const ind_nombre = button.getAttribute("data-ind_nombre");
    const cat_cod = button.getAttribute("data-cat_cod");

    document.getElementById("modalGestionarRangosLabel").innerText = `Gestionar Rangos para ${ind_nombre}`;
    document.getElementById("ind_cod_rango").value = ind_cod;
    document.getElementById("cat_cod_rango").value = cat_cod;

    const tablaRangos = document.getElementById("tabla-rangos");
    tablaRangos.innerHTML = "";

    fetch(`/indicadores/rangos/listar/${ind_cod}`)
        .then((response) => response.json())
        .then((data) => {
            data.forEach((rango) => {
                const fila = document.createElement("tr");

                // Agregar el identificador único
                fila.setAttribute("data-id", rango.id_ran);

                fila.innerHTML = `
                <td class="descripcion">${rango.descripcion_ran}</td>
                <td class="valor">${rango.valor_ran + '%'}</td>
                <td class="seleccionado">${rango.esta_seleccionado ? "Sí" : "No"}</td>
                <td>
                    <form action="/indicadores/rangos/eliminar/${rango.id_ran}" method="POST" class="d-inline" onsubmit="return confirm('¿Estás seguro de eliminar este rango?');">
                        <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                    </form>
                    <button class="btn btn-warning btn-sm" onclick="editarRango(${rango.id_ran}, '${rango.descripcion_ran}', ${rango.valor_ran}, ${rango.esta_seleccionado}, '${ind_cod}')">Editar</button>
                    ${!rango.esta_seleccionado ? `<form action="/rangos/seleccionar/${rango.id_ran}" method="POST" class="d-inline">
                        <button type="submit" class="btn btn-info btn-sm">Seleccionar</button>
                    </form>` : ""}
                </td>
            `;

                tablaRangos.appendChild(fila);
            });
        })
        .catch((error) => {
            console.error("Error al cargar los rangos:", error);
        });
});

document.getElementById('formRegistrarRango').addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
        ind_cod: document.getElementById('ind_cod_rango').value,
        descripcion_ran: document.getElementById('descripcion_ran').value,
        valor_ran: parseFloat(document.getElementById('valor_ran').value),
        esta_seleccionado: document.getElementById('esta_seleccionado').checked,
    };

    fetch('/indicadores/rangos/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                const tablaRangos = document.getElementById('tabla-rangos');
                const nuevoRango = data.rango;

                const nuevaFila = document.createElement('tr');
                nuevaFila.setAttribute("data-id", nuevoRango.id_ran);

                nuevaFila.innerHTML = `
            <td class="descripcion">${nuevoRango.descripcion_ran}</td>
            <td class="valor">${nuevoRango.valor_ran + "%"}</td>
            <td class="seleccionado">${nuevoRango.esta_seleccionado ? "Sí" : "No"}</td>
            <td>
                <form action="/indicadores/rangos/eliminar/${nuevoRango.id_ran}" method="POST" class="d-inline" onsubmit="return confirm('¿Estás seguro de eliminar este rango?');">
                        <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
                    </form>
                    <button class="btn btn-warning btn-sm" onclick="editarRango(${nuevoRango.id_ran}, '${nuevoRango.descripcion_ran}', ${nuevoRango.valor_ran}, ${nuevoRango.esta_seleccionado}, '${ind_cod}')">Editar</button>
                    ${!nuevoRango.esta_seleccionado ? `
                        <form action="/rangos/seleccionar/${nuevoRango.id_ran}" method="POST" class="d-inline">
                            <button type="submit" class="btn btn-info btn-sm">Seleccionar</button>
                        </form>` : ""}
            </td>
        `;
                tablaRangos.appendChild(nuevaFila);

                document.getElementById('descripcion_ran').value = '';
                document.getElementById('valor_ran').value = '';
                document.getElementById('esta_seleccionado').checked = false;
            } else {
                alert("Error al registrar el rango.");
            }
        })
        .catch(error => console.error("Error:", error));
});

function editarRango(id_ran, descripcion_ran, valor_ran, esta_seleccionado, ind_cod) {

    document.getElementById("id_ran_editar").value = id_ran;
    document.getElementById("ind_cod_editar").value = ind_cod;
    document.getElementById("descripcion_ran_editar").value = descripcion_ran;
    document.getElementById("valor_ran_editar").value = valor_ran;
    document.getElementById("esta_seleccionado_editar").checked = esta_seleccionado;

    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarRango"));
    modalEditar.show();
}

document.getElementById("formEditarRango").addEventListener("submit", function (event) {
    event.preventDefault();

    const id_ran = document.getElementById("id_ran_editar").value;
    const ind_cod = document.getElementById("ind_cod_editar").value;
    const descripcion_ran = document.getElementById("descripcion_ran_editar").value;
    const valor_ran = document.getElementById("valor_ran_editar").value;
    const esta_seleccionado = document.getElementById("esta_seleccionado_editar").checked;

    const rangoData = {
        id_ran,
        ind_cod,
        descripcion_ran,
        valor_ran,
        esta_seleccionado,
    };

    fetch("/indicadores/rangos/editar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(rangoData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {

                const fila = document.querySelector(`tr[data-id='${id_ran}']`);
                fila.querySelector(".descripcion").textContent = descripcion_ran;
                fila.querySelector(".valor").textContent = valor_ran + "%";
                fila.querySelector(".seleccionado").textContent = esta_seleccionado ? "Sí" : "No";

                const modalEditar = bootstrap.Modal.getInstance(document.getElementById("modalEditarRango"));
                modalEditar.hide();
            } else {
                alert("Error al actualizar el rango.");
            }
        })
        .catch((error) => {
            console.error("Error al actualizar el rango:", error);
        });
});



