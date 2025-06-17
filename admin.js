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

  // Helper para mostrar objetos/arrays de forma estructurada
  function renderField(key, value) {
    if (typeof value === 'object' && value !== null) {
      let html = `<div style="margin-bottom:10px;"><strong>${key}:</strong><div style="margin-left:15px;">`;
      if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          html += `<div><strong>Item ${idx + 1}:</strong>${typeof item === 'object' ? renderField('', item) : ' ' + item}</div>`;
        });
      } else {
        for (const [subKey, subValue] of Object.entries(value)) {
          html += renderField(subKey, subValue);
        }
      }
      html += `</div></div>`;
      return html;
    } else {
      return `<p><strong>${key}:</strong> ${value || ''}</p>`;
    }
  }

  // Obtener los datos de la hoja de vida
  const docRef = doc(db, 'hojas_de_vida', id);
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      let html = '';
      for (const [key, value] of Object.entries(data)) {
        if (key.toLowerCase() !== 'creadoen') {
          html += renderField(key, value);
        }
      }
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
