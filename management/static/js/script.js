// script.js

// Variables globales
let hamburguesas = JSON.parse(localStorage.getItem("hamburguesas")) || [];
let fbxURLs      = [];     // Blob URLs en memoria
let editandoId   = null;

// Reconstruye placeholders de blob URLs al inicio
hamburguesas.forEach(() => fbxURLs.push({ url: null, nombre: "" }));

document.addEventListener("DOMContentLoaded", () => {
  // —————————————————————————————
  // 1) LOGIN PAGE (index.html)
  // —————————————————————————————
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const errorLogin     = document.getElementById("error-login");
    const loginContainer = document.getElementById("login-container");
    loginContainer.style.display = "flex";

    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const usuario = document.getElementById("usuario").value.trim();
      const clave   = document.getElementById("clave").value.trim();
      if (usuario === "admin" && clave === "1234") {
        localStorage.setItem("isLogged", "true");        // ← guardamos sesión
        window.location.href = "panel.html";
      } else {
        errorLogin.textContent = "Usuario o contraseña incorrectos";
      }
    });
    return;
  }

  // —————————————————————————————
  // 2) PANEL PAGE (panel.html)
  // —————————————————————————————
  const panel = document.getElementById("panel");
  if (panel) {
    // bloqueo de acceso directo
    if (localStorage.getItem("isLogged") !== "true") {
      window.location.href = "index.html";
      return;
    }

    const lista           = document.getElementById("lista-hamburguesas");
    const agregarBtn      = document.getElementById("agregarBtn");
    const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");

    cerrarSesionBtn.addEventListener("click", () => {
      localStorage.removeItem("isLogged");               // ← cerramos sesión
      window.location.href = "index.html";
    });
    agregarBtn.addEventListener("click", () => {
      window.location.href = "formulario.html";
    });

    function mostrarHamburguesas() {
      lista.innerHTML = "";
      hamburguesas.forEach((ham, index) => {
        let fbxEl = `<p><strong>Modelo 3D:</strong> ${ham.modelo_3d}</p>`;
        if (fbxURLs[index] && fbxURLs[index].url) {
          fbxEl = `
            <a class="fbx-link"
               href="${fbxURLs[index].url}"
               download="${fbxURLs[index].nombre}">
              Descargar 3D (.fbx)
            </a>`;
        }
        lista.insertAdjacentHTML("beforeend", `
          <div class="hamburguesa">
            <div class="numero">${index+1}</div>
            <div class="info">
              <h3>${ham.nombre}</h3>
              <p><strong>Descripción:</strong> ${ham.descripcion}</p>
              <p><strong>Alto:</strong> ${ham.tamaño_alto} cm</p>
              <p><strong>Ancho:</strong> ${ham.tamaño_ancho} cm</p>
              <p><strong>Peso:</strong> ${ham.peso} g</p>
              <p><strong>Precio:</strong> ${ham.precio} Bs</p>
              ${fbxEl}
            </div>
            <div class="derecha">
              <div class="botones">
                <button onclick="startEdit(${index})">✏️ Editar</button>
                <button onclick="eliminar(${index})">🗑️ Eliminar</button>
              </div>
              <div class="foto">
                ${ ham.imagen
                    ? `<img src="${ham.imagen}" alt="foto de ${ham.nombre}" />`
                    : `<div class="no-foto">Sin foto</div>` }
              </div>
              <div class="texto-textura">
                <p><strong>Textura:</strong> ${ham.textura}</p>
              </div>
            </div>
          </div>
        `);
      });
    }

    mostrarHamburguesas();
    return;
  }

  // —————————————————————————————
  // 3) FORMULARIO PAGE (formulario.html)
  // —————————————————————————————
  const form = document.getElementById("formHamburguesa");
  if (form) {
    // bloqueo de acceso directo
    if (localStorage.getItem("isLogged") !== "true") {
      window.location.href = "index.html";
      return;
    }

    const btnGuardar = document.getElementById("guardarBtn");
    const cancelar   = document.getElementById("cancelarBtn");
    const anuncio    = document.getElementById("anuncioCreacion");
    const textoAn    = document.getElementById("textoAnuncio");

    // validadores
    const campos = [
      {
        id: "nombre", isFile: false,
        validator: v => /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ ]+$/.test(v),
        msg: "El nombre solo admite letras y espacios."
      },
      {
        id: "descripcion", isFile: false,
        validator: v => v.length >= 5,
        msg: "Descripción mínima 5 caracteres."
      },
      {
        id: "modelo3d", isFile: true,
        validator: f => f && f.name.toLowerCase().endsWith(".fbx"),
        msg: "Sube un .fbx válido."
      },
      {
        id: "foto", isFile: true,
        validator: f => f && ["image/png","image/jpeg","image/webp"].includes(f.type),
        msg: "Imagen PNG/JPG/WEBP."
      },
      {
        id: "textura", isFile: true,
        validator: f => f && ["image/png","image/jpeg"].includes(f.type),
        msg: "Textura PNG o JPG."
      },
      {
        id: "tamanio_alto", isFile: false,
        validator: v => { const n = +v; return n>=1&&n<=100; },
        msg: "Alto 1–100 cm."
      },
      {
        id: "tamanio_ancho", isFile: false,
        validator: v => { const n = +v; return n>=1&&n<=100; },
        msg: "Ancho 1–100 cm."
      },
      {
        id: "peso", isFile: false,
        validator: v => { const n = +v; return n>=1&&n<=500; },
        msg: "Peso 1–500 g."
      },
      {
        id: "precio", isFile: false,
        validator: v => {
          const num = parseFloat(v.replace(",", "."));
          return /^\d+([.,]\d{1,2})?$/.test(v) && num>=0.01;
        },
        msg: "Precio ≥ 0.01 Bs."
      }
    ];

    const touched = {};

    function validarTodo() {
      let allOK = true;
      campos.forEach(c => {
        const fld     = document.getElementById(c.id);
        const wrapper = fld.closest(".field");
        const err     = document.getElementById(`error-${c.id}`);
        const val     = c.isFile ? fld.files[0] : fld.value.trim();

        if (touched[c.id] && !c.validator(val)) {
          wrapper.classList.add("invalid");
          err.textContent = c.msg;
          allOK = false;
        } else {
          wrapper.classList.remove("invalid");
          err.textContent = "";
          if (touched[c.id] && c.validator(val)) delete touched[c.id];
        }
      });
      btnGuardar.disabled = !allOK;
      return allOK;
    }

    // marcar “touched” al interactuar
    campos.forEach(c => {
      const fld = document.getElementById(c.id);
      const ev  = c.isFile ? "change" : "input";
      fld.addEventListener(ev, () => {
        touched[c.id] = true;
        validarTodo();
      });
    });

    // cancelar
    cancelar.addEventListener("click", () => {
      window.location.href = "panel.html";
    });

    // enviar
    form.addEventListener("submit", e => {
      e.preventDefault();
      campos.forEach(c => touched[c.id] = true);
      if (!validarTodo()) return;

      // valores
      const nombre   = form.nombre.value.trim();
      const desc     = form.descripcion.value.trim();
      const mdlFile  = document.getElementById("modelo3d").files[0];
      const fotoFile = document.getElementById("foto").files[0];
      const texFile  = document.getElementById("textura").files[0];
      const alto     = +form.tamanio_alto.value;
      const ancho    = +form.tamanio_ancho.value;
      const peso     = +form.peso.value;
      const precio   = parseFloat(form.precio.value.replace(",", ".")).toFixed(2);

      // FBX blob
      const blobUrl = URL.createObjectURL(mdlFile);
      if (editandoId !== null) {
        fbxURLs[editandoId] = { url: blobUrl, nombre: mdlFile.name };
      } else {
        fbxURLs.push({ url: blobUrl, nombre: mdlFile.name });
      }

      // leer imágenes
      const reader1 = new FileReader();
      reader1.onloadend = () => {
        const fotoData = reader1.result;
        const reader2 = new FileReader();
        reader2.onloadend = () => {
          const texData = reader2.result;

          const nueva = {
            nombre,
            descripcion: desc,
            modelo_3d: mdlFile.name,
            tamaño_alto: alto,
            tamaño_ancho: ancho,
            peso,
            precio,
            imagen: fotoData,
            texturaData: texData,
            textura: texFile.name
          };

          if (editandoId !== null) {
            hamburguesas[editandoId] = nueva;
            editandoId = null;
          } else {
            hamburguesas.push(nueva);
          }
          localStorage.setItem("hamburguesas", JSON.stringify(hamburguesas));

          textoAn.textContent = "🎉 ¡Hamburguesa guardada con éxito!";
          anuncio.classList.remove("hidden");
          setTimeout(() => {
            window.location.href = "panel.html";
          }, 1200);
        };
        reader2.readAsDataURL(texFile);
      };
      reader1.readAsDataURL(fotoFile);
    });

    return;
  }
});

// —————————————————————————————
// Funciones globales editar/eliminar
// —————————————————————————————
function startEdit(index) {
  editandoId = index;
  window.location.href = "formulario.html";
}

function eliminar(index) {
  if (!confirm("¿Eliminar esta hamburguesa?")) return;
  hamburguesas.splice(index, 1);
  if (fbxURLs[index]?.url) URL.revokeObjectURL(fbxURLs[index].url);
  fbxURLs.splice(index, 1);
  localStorage.setItem("hamburguesas", JSON.stringify(hamburguesas));
  window.location.reload();
}
