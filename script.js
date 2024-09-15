const API_URL = 'https://66c3d9fed057009ee9c15b91.mockapi.io/api/user1/CRUD';

// crear tarea
function crearTarea(event) {
  event.preventDefault();

  const title = document.getElementById('tarea-titulo').value;
  const description = document.getElementById('tarea-descripcion').value;
  const date = document.getElementById('tarea-fecha').value || new Date().toISOString();
  const status = document.getElementById('opciones').value;



  const Tarea = {
    title,
    description,
    status,
    date: new Date(date).toISOString() // convertir a formato normal
  };

 
  axios.post(API_URL, Tarea)
    .then(response => {
      console.log('Tarea creada:', response.data);
      obtenerTareas(); // actualizar la lista de tareas
    })
    .catch(error => {
      console.error('Error al crear tarea:', error);
    });
}

// obtener y mostrar las tareas
function obtenerTareas() {
  axios.get(API_URL)
    .then(response => {
      // limpiar las columnas
      document.getElementById('to-do').innerHTML = '<strong>to do</strong>';
      document.getElementById('doing').innerHTML = '<strong>doing</strong>';
      document.getElementById('done').innerHTML = '<strong>done</strong>';

      // procesar cada tarea
      response.data.forEach(Tarea => {
        mostrarTarea(Tarea); // llamada a funcion que procesa cada tarea en particular
      });
    })
    .catch(error => {
      console.error('Error al obtener tareas:', error);
    });
}

// Funcion para mostrar una tarea
function mostrarTarea(Tarea) {
  const tareaElement = document.createElement('div');
  tareaElement.className = 'Tarea';
  tareaElement.draggable = true;

  // Verificar si existe el timestamp de la tarea
  let fechaTarea = 'sin fecha';
  if (Tarea.date) {
      const timestamp = new Date(Tarea.date).getTime(); // convertir la fecha a timestamp
      fechaTarea = transformTimestampToDate(timestamp); // formatear el timestamp a la fecha correcta
  }


  tareaElement.innerHTML = `
      <p><strong>${Tarea.title || 'Título no disponible'}</strong></p>
      <p>${Tarea.description || 'Descripción no disponible'}</p>
      <p><em>${fechaTarea}</em></p>
      <button class="btn-editar" onclick="editarTarea('${Tarea.id}')">Editar</button>
      <button class="btn-borrar" onclick="eliminarTarea('${Tarea.id}')">Borrar</button>
  `;

  // colocar la tarea en la columna correcta
  if (Tarea.status === 'opcion1') {
      document.getElementById('to-do').appendChild(tareaElement);
  } else if (Tarea.status === 'opcion2') {
      document.getElementById('doing').appendChild(tareaElement);
  } else {
      document.getElementById('done').appendChild(tareaElement);
  }
}

function transformTimestampToDate(dateTimestamp) {
  const offset = new Date().getTimezoneOffset() * 60 * 1000;
  dateTimestamp += offset; // Ajustar por el desfase de la zona horaria

  const dateFormat = new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
  });

  const fechaCorrecta = dateFormat.format(dateTimestamp);
  return fechaCorrecta;
}


// actualizar tarea
function actualizarTarea(id, newTitle, newDescription, newDate, newStatus) {
  const Tarea = {
    title: newTitle,
    description: newDescription,
    status: newStatus,
    date: new Date(newDate).toISOString() // usar la fecha proporcionada por el usuario
  };

  axios.put(`${API_URL}/${id}`, Tarea)
    .then(response => {
      console.log('Tarea actualizada:', response.data);
      obtenerTareas(); // refrescar la lista de tareas
    })
    .catch(error => {
      console.error('Error al actualizar tarea:', error);
    });
}


// eliminar tarea
function eliminarTarea(id) {
  axios.delete(`${API_URL}/${id}`)
    .then(() => {
      console.log('Tarea eliminada');
      obtenerTareas(); // refrescar la lista de tareas
    })
    .catch(error => {
      console.error('Error al eliminar tarea:', error);
    });
}

// editar tarea
function editarTarea(id) {
  axios.get(`${API_URL}/${id}`)
    .then(response => {
      const tarea = response.data;
      document.getElementById('tarea-titulo').value = tarea.title;
      document.getElementById('tarea-descripcion').value = tarea.description;
      document.getElementById('tarea-fecha').value = new Date(tarea.date).toISOString().split('T')[0];
      document.getElementById('opciones').value = tarea.status;

      const btnCrearEditar = document.getElementById('btn-crear-editar');
      btnCrearEditar.value = 'Actualizar Tarea';
      btnCrearEditar.onclick = function(event) {
        event.preventDefault();
        actualizarTarea(
          id,
          document.getElementById('tarea-titulo').value,
          document.getElementById('tarea-descripcion').value,
          document.getElementById('tarea-fecha').value, // pasar la fecha editada
          document.getElementById('opciones').value
        );
      };
    })
    .catch(error => {
      console.error('Error al obtener tarea para editar:', error);
    });
}

console.log(editarTarea)




// cargar las tareas al cargar la página
window.onload = obtenerTareas;
