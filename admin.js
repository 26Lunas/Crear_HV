// admin.js
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

// DOM
const loginSection = document.getElementById("loginSection");
const adminPanel = document.getElementById("adminPanel");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const listaHV = document.getElementById("listaHV");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("adminEmail").value;
  const pass = document.getElementById("adminPass").value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginSection.style.display = "none";
    adminPanel.style.display = "block";
    cargarHojasDeVida();
  } else {
    loginSection.style.display = "block";
    adminPanel.style.display = "none";
  }
});

async function cargarHojasDeVida() {
  listaHV.innerHTML = "Cargando...";
  const querySnapshot = await getDocs(collection(db, "hojas_de_vida"));
  let html = `<table class="table table-bordered"><thead><tr>
    <th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Cargo</th><th>Acciones</th>
  </tr></thead><tbody>`;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    html += `<tr>
      <td>${data.nombre || ""}</td>
      <td>${data.correo || ""}</td>
      <td>${data.telefono || ""}</td>
      <td>${data.cargo_A || ""}</td>
      <td>
        <button class="btn btn-outline-success btn-sm" onclick="verHV('${doc.id}')">Ver</button>
      </td>
    </tr>`;
  });

  html += "</tbody></table>";
  listaHV.innerHTML = html;
}

window.verHV = function (id) {
  const modal = document.getElementById('hojaVidaModal');
  const detalles = document.getElementById('hojaVidaDetalles');
  const closeBtn = document.querySelector('.close');
  const descargarBtn = document.getElementById('descargarPDF');

  // Obtener los datos de la hoja de vida
  const docRef = doc(db, 'hojas_de_vida', id);
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Datos personales
      const nombre = data.nombre || 'Nombre Apellido';
      const cargo = data.cargo_A || '';
      const documento = data.documento || '';
      const nacimiento = data.nacimiento || '';
      const estadoCivil = data.estadoCivil || '';
      const direccion = data.direccion || '';
      const telefono = data.telefono || '';
      const correo = data.correo || '';
      // Foto (puedes poner una imagen por defecto o dejar vacío)
      const foto = data.foto || 'https://via.placeholder.com/120x120?text=Foto';
      // Perfil
      const perfil = data.perfil || '';
      // Educación
      const educacion = Array.isArray(data.educacion) ? data.educacion : [];
      // Experiencia
      const experiencias = Array.isArray(data.experiencias) ? data.experiencias : [];

      let html = `
      <div class="cv-header">
        <div class="cv-foto"><img src="${foto}" alt="Foto" /></div>
        <div class="cv-nombre">
          <h2>${nombre}</h2>
          <div class="cv-cargo">${cargo}</div>
        </div>
      </div>
      <hr />
      <div class="cv-section">
        <div class="section-title">DATOS PERSONALES</div>
        <div class="cv-datos">
          <div><strong>Documento de identidad:</strong> ${documento}</div>
          <div><strong>Fecha de nacimiento:</strong> ${nacimiento}</div>
          <div><strong>Estado civil:</strong> ${estadoCivil}</div>
          <div><strong>Dirección:</strong> ${direccion}</div>
          <div><strong>Celular:</strong> ${telefono}</div>
          <div><strong>Email:</strong> ${correo}</div>
        </div>
      </div>
      <hr />
      <div class="cv-section">
        <div class="section-title">PERFIL LABORAL</div>
        <div>${perfil}</div>
      </div>
      <hr />
      <div class="cv-section">
        <div class="section-title">EDUCACIÓN</div>
        <div>
          ${educacion.length === 0 ? '<div class="item-block">(Sin datos)</div>' : educacion.map(e => `
            <div class="item-block">
              <div><strong>${e.titulo || ''}</strong></div>
              <div>${e.institucion || ''}</div>
              <div>${e.inicio || ''} - ${e.fin || ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <hr />
      <div class="cv-section">
        <div class="section-title">EXPERIENCIA PROFESIONAL</div>
        <div>
          ${experiencias.length === 0 ? '<div class="item-block">(Sin datos)</div>' : experiencias.map(e => `
            <div class="item-block">
              <div><strong>${e.cargo || ''}</strong> - ${e.empresa || ''}</div>
              <div>${e.inicio || ''} - ${e.fin || ''}</div>
              <div>${e.tareas || ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
      `;
      detalles.innerHTML = html;
      modal.style.display = 'block';
    } else {
      alert('No se encontró la hoja de vida.');
    }
  });

  // Cerrar el modal
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };

  // Descargar PDF
  descargarBtn.onclick = function() {
    const element = document.getElementById('hojaVidaDetalles');
    html2pdf().from(element).save('hoja_de_vida.pdf');
  };
};
