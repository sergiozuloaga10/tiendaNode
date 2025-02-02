document.addEventListener("DOMContentLoaded", () => {
    const editUserModal = document.getElementById("deleteUserModal");
  
    editUserModal.addEventListener("show.bs.modal", async (event) => {
      const button = event.relatedTarget; // Botón que activó el modal
      const userId = button.getAttribute("data-id"); // ID del usuario desde el atributo del botón
  
      // Realiza una solicitud AJAX para obtener los datos del usuario
      try {
        const response = await fetch(`/adm/us/delete/${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
  
        const userData = await response.json();
  
        // Llena los campos del formulario con los datos recibidos
        document.getElementById("deleteUserId").value = userData.id_usuario;
        document.getElementById("name").value = userData.nombre_usuario;
        document.getElementById("editame").innerHTML = `¿Seguro que quieres eliminar a ${userData.nombre_usuario}?`
  
         // Agregar el CSRF Token al formulario para el envío posterior
        document.getElementsByName("_csrf").value = userData.csrf;


      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    });
  });
  