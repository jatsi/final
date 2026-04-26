import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'
import Swal from 'sweetalert2'
import { crearCardProducto } from './components/card.js'

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
  configurarEventosLogin()
  configurarEventosBusqueda()
  configurarFormularioContacto()
  actualizarVistaCarrito()
}

function configurarEventosCarrito() {
  document.querySelector('#app').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-agregar-carrito')
    if (!btn) return

    const id = Number(btn.getAttribute('data-id'))
    agregarProductoAlCarrito(id)
  })

  document.addEventListener('click', (e) => {
    const btnCantidad = e.target.closest('[data-carrito-accion]')
    if (!btnCantidad) return

    const idProducto = Number(btnCantidad.getAttribute('data-id'))
    const accion = btnCantidad.getAttribute('data-carrito-accion')

    if (accion === 'sumar') cambiarCantidadProducto(idProducto, 1)
    if (accion === 'restar') cambiarCantidadProducto(idProducto, -1)
    if (accion === 'eliminar') eliminarProductoDelCarrito(idProducto)
  })
}

function configurarEventosLogin() {
  const formLogin = document.getElementById('formLogin')
  if (!formLogin) return

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault()
    const correo = formLogin.querySelector('input[type="email"]')?.value.trim()
    const password = formLogin.querySelector('input[type="password"]')?.value.trim()

    if (!correo || !password) {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Completa tu correo y contraseña para continuar.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#6F4E37'
      })
      return
    }

    Swal.fire({
      title: '¡Bienvenido!',
      text: `Inicio de sesión correcto para ${correo}.`,
      icon: 'success',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      confirmButtonColor: '#6F4E37'
    }).then(() => {
      const modal = document.getElementById('modalLogin')
      if (!modal || !window.bootstrap) return
      const instancia = bootstrap.Modal.getOrCreateInstance(modal)
      instancia.hide()
      formLogin.reset()
    })
  })
}


function configurarEventosBusqueda() {
  const inputBusqueda = document.getElementById('busqueda-input')
  const botonBusqueda = document.getElementById('btn-buscar')
  if (!inputBusqueda || !botonBusqueda) return

  botonBusqueda.addEventListener('click', () => {
    buscarProductos(inputBusqueda.value)
  })

  inputBusqueda.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    buscarProductos(inputBusqueda.value)
  })

  inputBusqueda.addEventListener('input', () => {
    if (inputBusqueda.value.trim() === '') {
      buscarProductos('')
    }
  })
}

function buscarProductos(terminoBusqueda) {
  const contenedor = document.getElementById('contenedor-productos')
  if (!contenedor) return

  const termino = terminoBusqueda.trim().toLowerCase()
  const resultados = termino
    ? productos.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(termino) ||
          producto.categoria.toLowerCase().includes(termino) ||
          producto.descripcion.toLowerCase().includes(termino)
      )
    : productos

  if (resultados.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-muted mb-0">No encontramos productos con ese criterio.</p>
      </div>
    `
    return
  }

  contenedor.innerHTML = resultados.map((producto) => crearCardProducto(producto)).join('')
}

function configurarFormularioContacto() {
  const formulario = document.getElementById('form-contacto')
  if (!formulario) return

  formulario.addEventListener('submit', (e) => {
    e.preventDefault()

    Swal.fire({
      title: 'registro exitoso',
      html: '<small>tus datos se enviaron correctamente</small>',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#6F4E37',
      background: '#F5F5DC'
    }).then(() => {
      formulario.reset()
    })
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