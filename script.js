import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let experienciaId = 0;
let educacionId = 0;

function agregarExperiencia() {
  const id = experienciaId++;
  const div = document.createElement('div');
  div.className = 'mb-3 border rounded p-3 position-relative';
  div.id = `experiencia_${id}`;
  
  div.innerHTML = `
    <button type="button" class="btn-close position-absolute top-0 end-0 mt-2 me-2" aria-label="Eliminar" onclick="eliminarExperiencia(${id})"></button>
    <input type="text" class="form-control mb-1" placeholder="Empresa" name="empresa_${id}" required>
    <input type="text" class="form-control mb-1" placeholder="Cargo" name="cargo_${id}" required>
    <textarea class="form-control mb-1" placeholder="Tareas" name="tareas_${id}" required></textarea>
    <input type="date" class="form-control mb-1" name="inicio_${id}" required>
    <input type="date" class="form-control mb-1" name="fin_${id}" required>
  `;
  
  document.getElementById('experiencias').appendChild(div);
}

function eliminarExperiencia(id) {
  const div = document.getElementById(`experiencia_${id}`);
  if (div) div.remove();
}

function agregarEducacion() {
  const id = educacionId++;
  const div = document.createElement('div');
  div.className = 'mb-3 border rounded p-3 position-relative';
  div.id = `educacion_${id}`;

  div.innerHTML = `
    <button type="button" class="btn-close position-absolute top-0 end-0 mt-2 me-2" aria-label="Eliminar" onclick="eliminarEducacion(${id})"></button>
    <input type="text" class="form-control mb-1" placeholder="Institución" name="institucion_${id}" required>
    <input type="text" class="form-control mb-1" placeholder="Título" name="titulo_${id}" required>
    <input type="date" class="form-control mb-1" name="edu_inicio_${id}" required>
    <input type="date" class="form-control mb-1" name="edu_fin_${id}" required>
  `;
  
  document.getElementById('educacion').appendChild(div);
}

function eliminarEducacion(id) {
  const div = document.getElementById(`educacion_${id}`);
  if (div) div.remove();
}

// 👉 Hacer funciones accesibles desde HTML
window.agregarExperiencia = agregarExperiencia;
window.eliminarExperiencia = eliminarExperiencia;
window.agregarEducacion = agregarEducacion;
window.eliminarEducacion = eliminarEducacion;

// Enviar formulario
document.getElementById("cvForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const nombre = formData.get("nombre");
  const correo = formData.get("correo");
  const cargo_A = formData.get("cargo_A");
  const telefono = formData.get("telefono");
  const perfil = formData.get("perfil");

  const experiencias = [];
  for (let i = 0; i < experienciaId; i++) {
    if (document.getElementById(`experiencia_${i}`)) {
      experiencias.push({
        empresa: formData.get(`empresa_${i}`),
        cargo: formData.get(`cargo_${i}`),
        tareas: formData.get(`tareas_${i}`),
        inicio: formData.get(`inicio_${i}`),
        fin: formData.get(`fin_${i}`),
      });
    }
  }

  const educacion = [];
  for (let i = 0; i < educacionId; i++) {
    if (document.getElementById(`educacion_${i}`)) {
      educacion.push({
        institucion: formData.get(`institucion_${i}`),
        titulo: formData.get(`titulo_${i}`),
        inicio: formData.get(`edu_inicio_${i}`),
        fin: formData.get(`edu_fin_${i}`),
      });
    }
  }

  try {
    await addDoc(collection(window.db, "hojas_de_vida"), {
      nombre,
      correo,
      cargo_A,
      telefono,
      perfil,
      experiencias,
      educacion,
      creadoEn: new Date()
    });
    alert("Hoja de vida enviada correctamente.");
    e.target.reset();
    document.getElementById("experiencias").innerHTML = "";
    document.getElementById("educacion").innerHTML = "";
    experienciaId = 0;
    educacionId = 0;
  } catch (err) {
    console.error("Error al guardar en Firestore:", err);
    alert("Error al enviar la hoja de vida.");
  }
});
