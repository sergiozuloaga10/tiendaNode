document.addEventListener("DOMContentLoaded", () => {
    const deleteGameModal = document.getElementById("deleteGameModal");
  
    deleteGameModal.addEventListener("show.bs.modal", async (event) => {
      const button = event.relatedTarget; // Botón que activó el modal
      const gameId = button.getAttribute("data-id"); // ID del usuario desde el atributo del botón
        console.log(button.getAttribute("data-id"));
      // Realiza una solicitud AJAX para obtener los datos del usuario
      try {
        const response = await fetch(`/adm/games/delete/${gameId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del videojuego");
        }
  
        const gameData = await response.json();
  
        // Llena los campos del formulario con los datos recibidos
        document.getElementById("deleteGameId").value = gameData.id_videojuego;
        console.log(gameData.id_videojuego);
        document.getElementById("name").value = gameData.nombre_juego;
        document.getElementById("editame").innerHTML = `¿Seguro que quieres eliminar a ${gameData.nombre_juego}?`
  
         // Agregar el CSRF Token al formulario para el envío posterior
        document.getElementsByName("_csrf").value = gameData.csrf;


      } catch (error) {
        console.error("Error al cargar los datos del juego:", error);
      }
    });
  });
  