// ===== Biblioteca básica =====


const KEY = "biblioteca:v1";


let libros = [];
let filtro = "todos"; 


function cargar() {
  const texto = localStorage.getItem(KEY);
  if (texto) {
    libros = JSON.parse(texto);
  } else {
    libros = [];
  }
}


function guardar() {
  const texto = JSON.stringify(libros);
  localStorage.setItem(KEY, texto);
}


function dibujarLista() {
  const contenedor = document.querySelector("#lista-libros");
  contenedor.innerHTML = "";


  let listaFiltrada = libros;
  if (filtro === "leidos") {
    listaFiltrada = libros.filter(l => l.leido);
  } else if (filtro === "no-leidos") {
    listaFiltrada = libros.filter(l => !l.leido);
  }


  if (listaFiltrada.length === 0) {
    const vacio = document.createElement("div");
    vacio.className = "libro";
    vacio.innerHTML = "<p>No hay libros.</p>";
    contenedor.appendChild(vacio);
    actualizarEstadisticas();
    return;
  }


  for (let i = 0; i < listaFiltrada.length; i++) {
    const l = listaFiltrada[i];

    const card = document.createElement("div");
    card.className = "libro";
    card.innerHTML = `
      <h3>${l.titulo}</h3>
      <p><strong>Autor:</strong> ${l.autor}</p>
      <p><strong>Género:</strong> ${l.genero}</p>
      <p><strong>Estado:</strong> ${l.leido ? "Leído ✅" : "Pendiente ⏳"}</p>
      <div class="acciones">
        <button class="btn-toggle">${l.leido ? "Marcar como NO leído" : "Marcar como leído"}</button>
        <button class="btn-borrar">Eliminar</button>
      </div>
    `;


    const btnToggle = card.querySelector(".btn-toggle");
    btnToggle.addEventListener("click", function () {
      l.leido = !l.leido;
      guardar();
      dibujarLista();
    });

    
    const btnBorrar = card.querySelector(".btn-borrar");
    btnBorrar.addEventListener("click", function () {
      const confirmar = confirm(`¿Eliminar "${l.titulo}"?`);
      if (confirmar) {
        libros.splice(libros.indexOf(l), 1);
        guardar();
        dibujarLista();
      }
    });

    contenedor.appendChild(card);
  }

  actualizarEstadisticas();
}


function actualizarEstadisticas() {
  const box = document.querySelector("#estadisticas");
  if (!box) return;
  let total = libros.length;
  let leidos = libros.filter(l => l.leido).length;
  box.textContent = "Total: " + total + " | Leídos: " + leidos + " | Pendientes: " + (total - leidos);
}


document.addEventListener("DOMContentLoaded", function () {
  cargar();
  dibujarLista();

  
  const form = document.querySelector("#form-libro");
  const inputTitulo = document.querySelector("#titulo");
  const inputAutor = document.querySelector("#autor");
  const selectGenero = document.querySelector("#genero");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const genero = selectGenero.value;

    if (titulo === "" || autor === "") {
      alert("Título y Autor son obligatorios.");
      return;
    }

    const nuevoLibro = {
      id: Date.now(),
      titulo: titulo,
      autor: autor,
      genero: genero,
      leido: false
    };

    libros.push(nuevoLibro);
    guardar();
    form.reset();
    dibujarLista();
  });


  const filtros = document.querySelector("#filtros");
  filtros.addEventListener("click", function (e) {
    const boton = e.target;
    if (boton.tagName === "BUTTON") {
      filtro = boton.dataset.filtro;
      dibujarLista();
    }
  });
});
