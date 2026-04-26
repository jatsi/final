import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

import { productos } from './data/producto.js'
import { crearCardProducto } from './components/card.js' // Importante para renderizar
import {
  mostrarHero,
  mostrarCatalogo,
  mostrarModalDetalles,
  configuracionPrincipalEventos,
  renderizarMenuCategorias,
  produ
} from './components/catalogo.js'
import { renderizarTodo } from './components/catalogo.js'

// Esto dispara toda la magia en el orden correcto
renderizarTodo();

function inicializarApp() {
    // Inyectamos el contenido
    document.querySelector('#app').innerHTML = `
      ${mostrarHero()}
      ${mostrarCatalogo()}
     ${ mostrarModalDetalles()}
     ${ produ()}
    `;

    // ACTIVACIÓN DE EVENTOS
    // Usamos un pequeño delay o nos aseguramos de llamar a las funciones aquí
    renderizarMenuCategorias();
    configuracionPrincipalEventos();
    produ();  // ACTIVA EL BOTÓN DE LOGIN
}
    // 3. CARGAR PRODUCTOS INICIALES (Esto faltaba)
    
    document.querySelector('#app').addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-agregar-carrito');
        if (btn) {
            const id = btn.getAttribute('data-id');
            const producto = productos.find(p => p.id == id);

            if (producto) {
                Swal.fire({
                    title: '¡Añadido!',
                    text: `${producto.nombre} se sumó al carrito.`,
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    background: '#F5F5DC',
                    iconColor: '#6F4E37',
                    didOpen: (toast) => {
                        toast.style.color = '#6F4E37';
                    }
                });
            }
        }
    });

window.addEventListener('DOMContentLoaded', inicializarApp);
// Arrancar la aplicación
inicializarApp();