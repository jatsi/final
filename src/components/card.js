export function crearCardProducto(producto) {
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="card h-100 border-0 shadow-sm" style="border-radius: 20px; background-color: #ffffff;">
        <img src="${producto.imagen}" class="card-img-top p-3" alt="${producto.nombre}" style="border-radius: 30px; height: 250px; object-fit: contain;">
        
        <div class="card-body text-center pt-0">
          <h5 class="card-title fw-bold" style="color: #382819;">${producto.nombre}</h5>
          <p class="card-text text-muted small">${producto.descripcion}</p>
          <p class="fs-5 fw-bold" style="color: #6F4E37;">S/ ${producto.precio.toFixed(2)}</p>
          
          <div class="d-grid gap-2">
            <button class="btn btn-agregar-carrito rounded-pill fw-bold" 
                    data-id="${producto.id}"
                    style="background-color: #6F4E37; color: white;">
              Agregar al carrito
            </button>
<button class="btn btn-outline-secondary rounded-pill fw-bold btn-ver-detalles"
        data-id="${producto.id}"
        data-bs-toggle="modal"
        data-bs-target="#detalleModal"
        style="border-color: #D2B48C; color: #6F4E37;">
  Ver detalles
</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
