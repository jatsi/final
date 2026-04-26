import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

import { productos } from './data/producto.js'
import {
  mostrarHero,
  mostrarCatalogo,
  mostrarModalDetalles,
  configuracionPrincipalEventos,
  renderizarMenuCategorias,
  produ,
  renderizarTodo
} from './components/catalogo.js'

const carrito = []

function inicializarApp() {
  document.querySelector('#app').innerHTML = `
    ${mostrarHero()}
    ${mostrarCatalogo()}
    ${mostrarModalDetalles()}
  `

  renderizarTodo()
  renderizarMenuCategorias()
  configuracionPrincipalEventos()
  produ()
  configurarEventosCarrito()
  actualizarVistaCarrito()
}

function configurarEventosCarrito() {
  document.querySelector('#app').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-agregar-carrito')
    if (!btn) return

    const id = Number(btn.getAttribute('data-id'))
    agregarProductoAlCarrito(id)
  })
}

function agregarProductoAlCarrito(idProducto) {
  const producto = productos.find((p) => p.id === idProducto)
  if (!producto) return

  const itemExistente = carrito.find((item) => item.id === idProducto)

  if (itemExistente) {
    itemExistente.cantidad += 1
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    })
  }

  actualizarVistaCarrito()
  abrirCarritoColapsable()

  if (window.Swal) {
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
        toast.style.color = '#6F4E37'
      }
    })
  }
}

function abrirCarritoColapsable() {
  const collapseElement = document.getElementById('carritoCollapse')
  if (!collapseElement || !window.bootstrap) return

  const instancia = bootstrap.Collapse.getOrCreateInstance(collapseElement, { toggle: false })
  instancia.show()
}

function actualizarVistaCarrito() {
  const contador = document.getElementById('carrito-count')
  const lista = document.getElementById('carrito-items')
  const total = document.getElementById('carrito-total')

  if (!contador || !lista || !total) return

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const totalCompra = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)

  contador.textContent = String(cantidadTotal)

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="text-muted small mb-0">Tu carrito está vacío.</p>'
  } else {
    lista.innerHTML = carrito
      .map(
        (item) => `
          <div class="d-flex justify-content-between align-items-start mb-2 carrito-item-row">
            <div>
              <p class="mb-0 fw-semibold">${item.nombre}</p>
              <small class="text-muted">Cantidad: ${item.cantidad}</small>
            </div>
            <span class="fw-bold">S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
          </div>
        `
      )
      .join('')
  }

  total.textContent = `S/ ${totalCompra.toFixed(2)}`
}

window.addEventListener('DOMContentLoaded', inicializarApp)
