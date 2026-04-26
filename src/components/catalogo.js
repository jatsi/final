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
    <section id="contacto" class="py-5" style="background-color: #FFF8E7;">
      <div class="container" style="max-width: 700px;">
        <div class="text-center mb-4">
          <h3 class="fw-bold" style="color: #6F4E37;">Contáctanos</h3>
          <p class="text-muted mb-0">Déjanos tus datos y te escribimos pronto.</p>
        </div>
        <form id="form-contacto" class="p-4 rounded-4 shadow-sm" style="background-color: #F5F5DC;">
          <div class="mb-3">
            <label for="contacto-nombre" class="form-label fw-semibold" style="color: #6F4E37;">Nombre</label>
            <input id="contacto-nombre" name="nombre" class="form-control" type="text" placeholder="Tu nombre completo" required>
          </div>
          <div class="mb-3">
            <label for="contacto-email" class="form-label fw-semibold" style="color: #6F4E37;">Correo</label>
            <input id="contacto-email" name="email" class="form-control" type="email" placeholder="correo@ejemplo.com" required>
          </div>
          <div class="mb-4">
            <label for="contacto-mensaje" class="form-label fw-semibold" style="color: #6F4E37;">Mensaje</label>
            <textarea id="contacto-mensaje" name="mensaje" class="form-control" rows="4" placeholder="Escribe tu consulta..." required></textarea>
          </div>
          <button type="submit" class="btn text-white w-100 fw-bold" style="background-color: #6F4E37; border: none;">Enviar mensaje</button>
        </form>
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
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-primary">Agregar al carrito</button>
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
