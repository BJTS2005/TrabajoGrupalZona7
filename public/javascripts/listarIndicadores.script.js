
const modalEditar = document.getElementById('modalEditarIndicador');
modalEditar.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const cod = button.getAttribute('data-cod');
    const nombre = button.getAttribute('data-nombre');
    const puntos = button.getAttribute('data-puntos');
    const mie_ci = button.getAttribute('data-mie_ci');
    console.log(cod, nombre, puntos, mie_ci);
    modalEditar.querySelector('#ind_cod_editar').value = cod;
    modalEditar.querySelector('#ind_nombre_editar').value = nombre;
    modalEditar.querySelector('#ind_puntos_editar').value = puntos;
    modalEditar.querySelector('#mie_ci_editar').value = mie_ci;
    
});
