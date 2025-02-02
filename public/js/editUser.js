document.addEventListener("DOMContentLoaded", () => {
  const editUserModal = document.getElementById("editUserModal");

  editUserModal.addEventListener("show.bs.modal", async (event) => {
    const button = event.relatedTarget; // Botón que activó el modal
    const userId = button.getAttribute("data-id"); // ID del usuario desde el atributo del botón

    // Realiza una solicitud AJAX para obtener los datos del usuario
    try {
      const response = await fetch(`/adm/us/edit/${userId}`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
      }

      const userData = await response.json();

      // Llena los campos del formulario con los datos recibidos
      document.getElementById("editUserId").value = userData.id_usuario;
      document.getElementById("editUserName").value = userData.nombre_usuario;
      document.getElementById("editUserEmail").value = userData.correo;
      document.getElementById("editUserPass").value = userData.contraseña;
      document.getElementById("editUserAddress").value = userData.direccion;

       // Agregar el CSRF Token al formulario para el envío posterior
    document.getElementsByName("_csrf").value = userData.csrf;

      // Seleccionar el rol correspondiente
      const roleSelect = document.getElementById("editUserRole");
      roleSelect.value = userData.id_rol; // Selecciona el rol actual
      console.log(userData.id_rol);
    } catch (error) {
      console.error("Error al cargar los datos del usuario:", error);
    }
  });
});
