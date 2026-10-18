// ==============================================
// KAYLA BOUTIQUE - CÓDIGO COMPLETO
// ==============================================

const CONFIG = {
  telefono: "573001640580",
  tienda: "Kayla Boutique",
  moneda: "COP",
  locale: "es-CO"
};

// 📷 FOTOS: guarda tus fotos en una carpeta llamada "img" junto a index.html
// con EXACTAMENTE estos nombres (formato .jpg).
const FOTO = function(nombre) {
  if (/^(https?:|data:)/.test(nombre)) return nombre;
  return "img/" + nombre;
};

const PRODUCTOS = [
  { id: 1, nombre: "Vestido Rojo", categoria: "Vestidos", precio: 120000, imagen: FOTO("producto1.jpg") },
  { id: 2, nombre: "Vestido Rojo Manga Larga", categoria: "Vestidos", precio: 135000, imagen: FOTO("producto2.jpg") },
  { id: 3, nombre: "Vestido Largo", categoria: "Vestidos", precio: 119000, imagen: FOTO("producto3.jpg") },
  { id: 4, nombre: "Camiseta Blanca Básica", categoria: "Camisetas", precio: 45000, imagen: FOTO("producto4.jpg") },
  { id: 5, nombre: "Conjunto Camisa y Falda a Cuadros", categoria: "Conjuntos", precio: 110000, imagen: FOTO("producto5.jpg") },
  { id: 6, nombre: "Conjunto Deportivo Negro", categoria: "Conjuntos", precio: 139000, imagen: FOTO("producto6.jpg") },
  { id: 7, nombre: "Overol Casual", categoria: "Conjuntos", precio: 129000, imagen: FOTO("producto7.jpg") },
  { id: 8, nombre: "Jean Azul", categoria: "Jeans", precio: 89000, imagen: FOTO("producto8.jpg") },
];

// Las 4 imágenes principales de la página de inicio
const INICIO = [
  { titulo: "Vestidos", imagen: FOTO("inicio-vestidos.jpg") },
  { titulo: "Conjuntos", imagen: FOTO("inicio-conjuntos.jpg") },
  { titulo: "Denim", imagen: FOTO("inicio-denim.jpg") },
  { titulo: "Oversize", imagen: FOTO("inicio-oversize.jpg") },
];
const TALLAS = ["S", "M", "L", "XL"];
let carrito = JSON.parse(localStorage.getItem("kayla_carrito") || "[]");
let filtroActivo = "Todas";
let textoBusqueda = "";
const tallasElegidas = {};

const $ = function(s) { return document.querySelector(s); };
const contProductos = $("#productos");
const contFiltros = $("#filtros");
const listaCarrito = $("#carritoLista");

const dinero = function(n) {
  return new Intl.NumberFormat(CONFIG.locale, {
    style: "currency",
    currency: CONFIG.moneda,
    maximumFractionDigits: 0
  }).format(n);
};

function guardarCarrito() {
  try { localStorage.setItem("kayla_carrito", JSON.stringify(carrito)); } catch(e) {}
}

function aviso(t) {
  const el = $("#aviso");
  if (!el) return;
  el.textContent = t;
  el.classList.add("visible");
  clearTimeout(aviso.t);
  aviso.t = setTimeout(function() { el.classList.remove("visible"); }, 2200);
}

const escapar = function(t) {
  return String(t).replace(/[&<>"']/g, function(c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
};

// 🖼️ Cuadro de reemplazo si una foto no existe
function placeholder() {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">' +
    '<rect width="100%" height="100%" fill="#fde8f1"/>' +
    '<text x="50%" y="52%" font-family="Arial" font-size="18" fill="#c98aa6" text-anchor="middle">Foto pendiente</text>' +
    '</svg>';
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

document.addEventListener("error", function(e) {
  const img = e.target;
  if (img && img.tagName === "IMG" && !img.dataset.fallback) {
    img.dataset.fallback = "1";
    img.src = placeholder();
  }
}, true);

// 🎨 PINTAR FILTROS
function pintarFiltros() {
  if (!contFiltros) return;
  const cats = ["Todas"].concat(PRODUCTOS.map(function(p) { return p.categoria; }));
  const catsUnicas = cats.filter(function(c, i, arr) { return arr.indexOf(c) === i; });
  contFiltros.innerHTML = catsUnicas.map(function(c) {
    return '<button class="filtro ' + (c === filtroActivo ? "activo" : "") + '" data-cat="' + c + '">' + c + "</button>";
  }).join("");
}

if (contFiltros) contFiltros.addEventListener("click", function(e) {
  const b = e.target.closest(".filtro");
  if (!b) return;
  filtroActivo = b.getAttribute("data-cat");
  pintarFiltros();
  pintarProductos();
});

const busc = $("#buscador");
if (busc) busc.addEventListener("input", function(e) {
  textoBusqueda = e.target.value.trim().toLowerCase();
  pintarProductos();
});

// 🎨 PINTAR PRODUCTOS
function pintarProductos() {
  if (!contProductos) {
    console.log("⚠️ No se encontró el elemento #productos en el HTML");
    return;
  }

  const lista = PRODUCTOS.filter(function(p) {
    return (filtroActivo === "Todas" || p.categoria === filtroActivo) &&
           (p.nombre + " " + p.categoria).toLowerCase().indexOf(textoBusqueda) !== -1;
  });

  const sin = $("#sinResultados");
  if (sin) sin.hidden = lista.length > 0;

  contProductos.innerHTML = lista.map(function(p) {
    const t = tallasElegidas[p.id] || "M";
    return '<article class="producto">' +
      '<div class="foto"><img src="' + escapar(p.imagen) + '" alt="' + escapar(p.nombre) + '" loading="lazy"></div>' +
      '<div class="info">' +
        '<span class="categoria">' + escapar(p.categoria) + "</span>" +
        "<h3>" + escapar(p.nombre) + "</h3>" +
        '<p class="descripcion">' + escapar(p.desc) + "</p>" +
        '<div class="precio">' + dinero(p.precio) + "</div>" +
        '<div class="tallas" data-id="' + p.id + '">' +
          TALLAS.map(function(tt) {
            return '<button class="talla ' + (tt === t ? "activa" : "") + '" data-talla="' + tt + '">' + tt + "</button>";
          }).join("") +
        "</div>" +
        '<button class="btn-agregar" data-agregar="' + p.id + '">Agregar al carrito</button>' +
      "</div>" +
    "</article>";
  }).join("");
}

if (contProductos) contProductos.addEventListener("click", function(e) {
  const tb = e.target.closest(".talla");
  if (tb) {
    const id = parseInt(tb.parentElement.getAttribute("data-id"));
    tallasElegidas[id] = tb.getAttribute("data-talla");
    tb.parentElement.querySelectorAll(".talla").forEach(function(b) {
      b.classList.toggle("activa", b === tb);
    });
    return;
  }
  const ad = e.target.closest("[data-agregar]");
  if (ad) agregar(parseInt(ad.getAttribute("data-agregar")));
});

function agregar(id) {
  const prod = PRODUCTOS.find(function(p) { return p.id === id; });
  const t = tallasElegidas[id] || "M";
  const ex = carrito.find(function(i) { return i.id === id && i.talla === t; });
  if (ex) ex.cant++;
  else carrito.push({ id: id, talla: t, cant: 1 });
  guardarCarrito();
  pintarCarrito();
  aviso("✅ " + prod.nombre + " (" + t + ")");
}

function cambiarCantidad(id, t, d) {
  const it = carrito.find(function(i) { return i.id === id && i.talla === t; });
  if (!it) return;
  it.cant += d;
  if (it.cant <= 0) carrito = carrito.filter(function(i) { return i !== it; });
  guardarCarrito();
  pintarCarrito();
}

function quitar(id, t) {
  carrito = carrito.filter(function(i) { return !(i.id === id && i.talla === t); });
  guardarCarrito();
  pintarCarrito();
}

function totales() {
  const cant = carrito.reduce(function(s, i) { return s + i.cant; }, 0);
  const total = carrito.reduce(function(s, i) {
    const p = PRODUCTOS.find(function(x) { return x.id === i.id; });
    return s + (p ? p.precio * i.cant : 0);
  }, 0);
  return { cant: cant, total: total };
}

function pintarCarrito() {
  carrito = carrito.filter(function(i) { return PRODUCTOS.some(function(p) { return p.id === i.id; }); });
  if (!listaCarrito) return;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<div class="vacio"><span>🛒</span><p>Tu carrito está vacío.</p></div>';
  } else {
    listaCarrito.innerHTML = carrito.map(function(i) {
      const p = PRODUCTOS.find(function(x) { return x.id === i.id; });
      return '<div class="item">' +
        '<div class="item-foto"><img src="' + escapar(p.imagen) + '" alt="' + escapar(p.nombre) + '"></div>' +
        "<div>" +
          "<h4>" + escapar(p.nombre) + "</h4>" +
          "<small>Talla " + i.talla + " · " + dinero(p.precio) + "</small>" +
          '<div class="cantidad">' +
            '<button data-menos="' + i.id + "|" + i.talla + '">−</button>' +
            "<span>" + i.cant + "</span>" +
            '<button data-mas="' + i.id + "|" + i.talla + '">+</button>' +
          "</div>" +
        "</div>" +
        '<div class="item-der">' +
          "<strong>" + dinero(p.precio * i.cant) + "</strong>" +
          '<button class="quitar" data-quitar="' + i.id + "|" + i.talla + '">Quitar</button>' +
        "</div>" +
      "</div>";
    }).join("");
  }

  const datos = totales();
  const ce = $("#contador");
  if (ce) ce.textContent = datos.cant;
  const te = $("#total");
  if (te) te.textContent = dinero(datos.total);
}

if (listaCarrito) listaCarrito.addEventListener("click", function(e) {
  const b = e.target.closest("button");
  if (!b) return;
  const atributos = b.dataset;
  let clave = null, valor = null;
  for (let k in atributos) { clave = k; valor = atributos[k]; break; }
  if (!valor) return;
  const partes = valor.split("|");
  const id = parseInt(partes[0]);
  const t = partes[1];
  if (clave === "mas") cambiarCantidad(id, t, 1);
  if (clave === "menos") cambiarCantidad(id, t, -1);
  if (clave === "quitar") quitar(id, t);
});

function abrirCarrito() {
  const c = $("#carrito"), v = $("#velo");
  if (c) c.classList.add("abierto");
  if (v) v.hidden = false;
  document.body.style.overflow = "hidden";
}

function cerrarCarrito() {
  const c = $("#carrito"), v = $("#velo");
  if (c) c.classList.remove("abierto");
  if (v) v.hidden = true;
  document.body.style.overflow = "";
}

const btnAbrirCarrito = $("#abrirCarrito");
if (btnAbrirCarrito) btnAbrirCarrito.addEventListener("click", abrirCarrito);
const btnCerrarCarrito = $("#cerrarCarrito");
if (btnCerrarCarrito) btnCerrarCarrito.addEventListener("click", cerrarCarrito);
const velo = $("#velo");
if (velo) velo.addEventListener("click", cerrarCarrito);

const btnVaciar = $("#vaciar");
if (btnVaciar) btnVaciar.addEventListener("click", function() {
  carrito = [];
  guardarCarrito();
  pintarCarrito();
  aviso("🗑️ Carrito vaciado");
});

function enlaceWhatsApp(m) {
  return "https://wa.me/" + CONFIG.telefono + "?text=" + encodeURIComponent(m);
}

const btnPedir = $("#pedirWhatsapp");
if (btnPedir) btnPedir.addEventListener("click", function() {
  if (carrito.length === 0) {
    aviso("🛒 Agrega al menos una prenda");
    return;
  }
  const nombre = $("#nombreCliente") ? $("#nombreCliente").value.trim() : "";
  const nota = $("#notaCliente") ? $("#notaCliente").value.trim() : "";
  if (!nombre) {
    aviso("✍️ Escribe tu nombre");
    if ($("#nombreCliente")) $("#nombreCliente").focus();
    return;
  }
  const lineas = carrito.map(function(i) {
    const p = PRODUCTOS.find(function(x) { return x.id === i.id; });
    return "• " + i.cant + " x " + p.nombre + " (Talla " + i.talla + ") - " + dinero(p.precio * i.cant);
  });
  const datos = totales();
  const mensaje = "¡Hola " + CONFIG.tienda + "! 👋\nQuiero hacer el siguiente pedido:\n\n" +
    lineas.join("\n") + "\n\n*Total: " + dinero(datos.total) + "*\nNombre: " + nombre +
    (nota ? "\nNota: " + nota : "") + "\n\nEstamos ubicados en Canalete Córdoba - Envío a nivel nacional\n¡Gracias!";
  window.open(enlaceWhatsApp(mensaje), "_blank", "noopener");
});

const saludo = "¡Hola " + CONFIG.tienda + "! 👋 Quisiera más información.";
["#whatsappContacto", "#whatsappFlotante"].forEach(function(sel) {
  const a = $(sel);
  if (a) { a.href = enlaceWhatsApp(saludo); a.target = "_blank"; }
});

const btnMenu = $("#btnMenu");
if (btnMenu) btnMenu.addEventListener("click", function() {
  const menu = $("#menu"); if (menu) menu.classList.toggle("abierto");
});
const menu = $("#menu");
if (menu) menu.addEventListener("click", function(e) {
  if (e.target.tagName === "A") this.classList.remove("abierto");
});

const anio = $("#anio");
if (anio) anio.textContent = new Date().getFullYear();

// 🖼️ PINTAR IMÁGENES DE LA PÁGINA DE INICIO
function pintarInicio() {
  const cont = document.getElementById("inicioCategorias");
  if (!cont) return;
  cont.innerHTML = INICIO.map(function(item) {
    return '<div class="inicio-card"><img src="' + escapar(item.imagen) + '" alt="' + escapar(item.titulo) + '" loading="lazy"><h3>' + escapar(item.titulo) + "</h3></div>";
  }).join("");
}

// 🖼️ Que las fotos se vean COMPLETAS (sin recortes ni deformarse)
(function() {
  const st = document.createElement("style");
  st.textContent =
    ".producto .foto{height:auto !important;aspect-ratio:auto !important;background:none !important;overflow:hidden;}" +
    ".producto .foto img{width:100% !important;height:auto !important;object-fit:contain !important;display:block;}" +
    ".item-foto{background:none !important;}" +
    ".item-foto img{width:100% !important;height:100% !important;object-fit:contain !important;}" +
    ".inicio-card{background:none !important;}" +
    ".inicio-card img{width:100% !important;height:auto !important;aspect-ratio:auto !important;object-fit:contain !important;display:block;}";
  document.head.appendChild(st);
})();

// 🚀 INICIAR TODO
pintarFiltros();
pintarProductos();
pintarCarrito();
pintarInicio();