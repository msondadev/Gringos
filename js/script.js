
  function mostrarConfirmacion() {
        alert("¡Su formulario fue enviado!");
            return true; // Permite que el formulario se envíe después de mostrar el pop-up
}
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById('custom-popup');
  const closeBtn = document.getElementById('close-popup-btn');

  if (closeBtn && popup) {
    closeBtn.addEventListener('click', () => popup.classList.remove('show'));
  }

  // Función reutilizable para crear tarjetas
  function crearTarjeta(producto) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("oferta-tarjeta");

    tarjeta.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div class="oferta-info">
        <p class="oferta-titulo">${producto.nombre}</p>
        <p class="descripcion">${producto.descripcion}</p>
        <p class="precio">$${producto.precio.toFixed(2)}</p>
        <button class="btn-comprar">Agregar al carrito</button>
      </div>
    `;

    tarjeta.querySelector(".btn-comprar").addEventListener("click", () => {
      agregarAlCarrito({ nombre: producto.nombre, descripcion: producto.descripcion, precio: producto.precio });
    });

    return tarjeta;
  }

  function agregarAlCarrito(producto) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const index = carrito.findIndex(p => p.nombre === producto.nombre);
    if (index !== -1) {
      carrito[index].cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    if (popup) popup.classList.add('show');
  }

  // Ofertas en index.html
  const contenedorOfertas = document.getElementById("contenedor-ofertas");
  if (contenedorOfertas) {
    fetch("./data/productos.json")
      .then(res => res.json())
      .then(productos => {
        const ofertas = productos.filter(p => p.oferta);
        if (ofertas.length === 0) {
          contenedorOfertas.innerHTML = "<p>No hay ofertas disponibles.</p>";
          return;
        }
        ofertas.forEach(p => contenedorOfertas.appendChild(crearTarjeta(p)));
      })
      .catch(err => console.error("Error cargando ofertas:", err));
  }
    // Productos en productos.html con filtro
  const contenedorProductos = document.getElementById("contenedor-productos");
  if (contenedorProductos) {
    fetch("../data/productos.json")
      .then(res => res.json())
      .then(productos => {
        function renderizar(lista) {
          contenedorProductos.innerHTML = "";
          lista.forEach(p => contenedorProductos.appendChild(crearTarjeta(p)));
        }
        renderizar(productos);

        document.querySelectorAll(".filtro-categoria").forEach(btn => {
          btn.addEventListener("click", () => {
            const cat = btn.dataset.categoria;
            if (cat === "todos") renderizar(productos);
            else renderizar(productos.filter(p => p.categoria === cat));
          });
        });
      })
      .catch(err => console.error("Error cargando productos:", err));
  }

  // Carrito en carrito.html
  const contenedorCarrito = document.getElementById("contenedor-carrito");
  const totalCarrito = document.getElementById("total-carrito");
  const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");

  if (contenedorCarrito && totalCarrito && btnVaciarCarrito) {
    function renderizarCarrito() {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalCarrito.textContent = "";
        return;
      }

      let total = 0;
      const tabla = document.createElement("table");
      tabla.innerHTML = `
        <thead>
          <tr>
            <th>Producto</th><th>Descripción</th><th>Precio</th><th>Cantidad</th>
            <th>Subtotal</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      const tbody = tabla.querySelector("tbody");

      carrito.forEach((p, i) => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td data-label="Producto">${p.nombre}</td>
          <td data-label="Descripción">${p.descripcion}</td>
          <td data-label="Precio">$${p.precio.toFixed(2)}</td>
          <td data-label="Cantidad">${p.cantidad}</td>
          <td data-label="Subtotal">$${subtotal.toFixed(2)}</td>
          <td data-label="Acciones">
            <button class="sumar" data-index="${i}">+</button>
            <button class="restar" data-index="${i}">–</button>
          </td>
        `;
        tbody.appendChild(fila);
      });

      contenedorCarrito.innerHTML = "";
      contenedorCarrito.appendChild(tabla);
      totalCarrito.textContent = `Total: $${total.toFixed(2)}`;

      document.querySelectorAll(".sumar").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = parseInt(btn.dataset.index);
          carrito[i].cantidad++;
          localStorage.setItem("carrito", JSON.stringify(carrito));
          renderizarCarrito();
        });
      });

      document.querySelectorAll(".restar").forEach(btn => {
        btn.addEventListener("click", () => {
          const i = parseInt(btn.dataset.index);
          if (carrito[i].cantidad > 1) {
            carrito[i].cantidad--;
          } else {
            carrito.splice(i, 1);
          }
          localStorage.setItem("carrito", JSON.stringify(carrito));
          renderizarCarrito();
        });
      });
    }

    renderizarCarrito();

    btnVaciarCarrito.addEventListener("click", () => {
      localStorage.removeItem("carrito");
      renderizarCarrito();
    });
  }
});

