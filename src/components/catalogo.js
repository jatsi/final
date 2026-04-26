import { productos } from '../data/producto.js';
import { crearCardProducto } from './card.js';


export function mostrarHero() {
    return `
    <section class="text-white d-flex align-items-center justify-content-center text-center" 
             style="min-height: 80vh; background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'); background-size: cover; background-position: center;">
        <div class="container">
            <iconify-icon icon="mdi:basket-outline" style="font-size: 5rem; color: #F5F5DC;"></iconify-icon>
            <h1 class="display-1 fw-bold mb-3" style="font-family: 'Montserrat Alternates', sans-serif;">EcoMarket</h1>
            <p class="fs-4 mb-5 mx-auto" style="max-width: 700px;">Bienvenido a la revolución de la frescura. Productos orgánicos, seleccionados a mano por Jade Pacompia.</p>
            <a href="#catalogo" class="btn btn-light btn-lg rounded-pill px-5 fw-bold" style="color: #6F4E37;">Explorar Catálogo</a>
        </div>
    </section>
    `;
}

export function mostrarCatalogo() {
    return `
    <section id="catalogo" class="py-5" style="background-color: #F5F5DC;">
        <div class="container text-center mb-5">
            <iconify-icon icon="mdi:leaf" style="color: #6F4E37; font-size: 2.5rem;"></iconify-icon>
            <h2 class="fw-bold" style="color: #6F4E37;">Nuestro Catálogo</h2>
            <p class="text-muted">Frescura y calidad garantizada en cada producto</p>
        </div>
        <div class="container">
            <div class="row g-4" id="contenedor-productos">
                </div>
        </div>
    </section>
    `;
}

export function renderizarMenuCategorias() {
    const listaMenu = document.querySelector('#lista-categorias-menu');
    if (!listaMenu) return;

    // Obtenemos categorías únicas de tus datos
    const categorias = ['Todos', ...new Set(productos.map(p => p.categoria))];
    
    listaMenu.innerHTML = categorias.map(cat => `
        <button class="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center" 
                style="background-color: transparent; color: #6F4E37; font-weight: 500;" 
                data-categoria="${cat}">
            <iconify-icon icon="mdi:chevron-right" class="me-2"></iconify-icon>
            ${cat}
        </button>
    `).join('');
}

// Esta función es para que los botones del menú lateral funcionen
export function configuracionPrincipalEventos() {
    // 1. EVENTO PARA LAS CATEGORÍAS (Baja al catálogo)
    const listaMenu = document.querySelector('#lista-categorias-menu');
    if (listaMenu) {
        listaMenu.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-categoria]');
            if (btn) {
                const cat = btn.getAttribute('data-categoria');
                filtrarProductos(cat);
                const seccionCatalogo = document.getElementById('catalogo');
                if (seccionCatalogo) {
                    seccionCatalogo.scrollIntoView({ behavior: 'smooth' });
                }
                const offcanvasElement = document.getElementById('menuCategorias');
                const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (offcanvas) offcanvas.hide();
            }
        });
    }
    const btnLogo = document.getElementById('btn-logo-inicio');
    if (btnLogo) {
        btnLogo.addEventListener('click', () => {
            filtrarProductos('Todos');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log("Regresando al inicio...");
        });
    }
}


function filtrarProductos(categoria) {
    const contenedor = document.querySelector('#contenedor-productos');
    const filtrados = categoria === 'Todos' 
        ? productos 
        : productos.filter(p => p.categoria === categoria);
    
    contenedor.innerHTML = filtrados.map(p => crearCardProducto(p)).join('');
}

export function buscarProductos(terminoBusqueda = '') {
    const contenedor = document.querySelector('#contenedor-productos');
    if (!contenedor) return;

    const terminoNormalizado = terminoBusqueda.trim().toLowerCase();
    if (!terminoNormalizado) {
        contenedor.innerHTML = productos.map(p => crearCardProducto(p)).join('');
        return;
    }

    const resultados = productos.filter((producto) => {
        const nombre = producto.nombre.toLowerCase();
        const descripcion = producto.descripcion.toLowerCase();
        const categoria = producto.categoria.toLowerCase();
        return nombre.includes(terminoNormalizado)
            || descripcion.includes(terminoNormalizado)
            || categoria.includes(terminoNormalizado);
    });

    if (resultados.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center mb-0">
                    No encontramos productos para "<strong>${terminoBusqueda.trim()}</strong>".
                </div>
            </div>
        `;
        desplazarAResultados();
        return;
    }

    contenedor.innerHTML = resultados.map(p => crearCardProducto(p)).join('');
    desplazarAResultados();
}

function desplazarAResultados() {
    const seccionCatalogo = document.getElementById('catalogo');
    if (!seccionCatalogo) return;
    seccionCatalogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Función vacía para evitar errores de importación si la llamas en main.js
export function mostrarModalDetalles(){
  return `
<!-- Modal -->
<div class="modal fade" id="detalleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="producto-nombre"></h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p id="producto-descripcion"> </p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
  `
}

// catalogo.js
document.addEventListener("click", function (e) {
  const boton = e.target.closest(".btn-ver-detalles");

  if (!boton) return;

  const productoId = Number(boton.dataset.id);
  const producto = productos.find(p => p.id === productoId);

  if (!producto) {
    console.error("Producto no encontrado:", productoId);
    return;
  }

  document.getElementById("producto-nombre").textContent = producto.nombre;
  document.getElementById("producto-descripcion").textContent = producto.descripcion;
 
});

export function renderizarTodo() {
    // Rellena el menú lateral
    renderizarMenuCategorias();
    
    // Activa los filtros de categorías
    configuracionPrincipalEventos();
    
    // Carga los productos (tu función produ)
    produ(); 
}

export function produ() {
    const contenedor = document.querySelector('#contenedor-productos');
    if (contenedor) {
        // productos y crearCardProducto deben estar importados arriba
        contenedor.innerHTML = productos.map(p => crearCardProducto(p)).join('');
    }
}
