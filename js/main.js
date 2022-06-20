// VARIABLES
const contenederPoductos = document.querySelector("#contenedorProductos");
const contenederCarrito = document.querySelector("#contenedorCarrito");
const btnCarrito = document.querySelector("#btnCarrito");
const divCarrito = document.querySelector("#divCarrito");
const burbujaCarrito = document.querySelector("#burbujaCarrito");
const totalCarrito = document.querySelector("#totalCarrito");
const selectOrdenar = document.querySelector("#ordenar");
const selectFiltrar = document.querySelector("#categorias");
const inputBuscar = document.querySelector("#buscar");

const ordenar = { nombre: "Por nombre", precio: "Por precio" };
const categorias = {
  todo: "Ver todos",
  daily: "daily",
  todoterreno: "todoterreno",
};

//FUNCIONES

function crearSelect(objeto, etiqueta) {
  etiqueta.innerHTML = "";
  for (key in objeto) {
    etiqueta.innerHTML += `<option value=${key}>${objeto[key]}</option> `;
  }
}

function mostrarProductos(array) {
  contenederPoductos.innerHTML = "";
  array.forEach((producto) => {
    contenederPoductos.innerHTML += `
        <div class="col mb-5">
            <div class="card h-100">
                <!-- Product image-->
                <img class="card-img-top" src=${producto.img} alt="..." />
                <!-- Product details-->
                <div class="card-body p-4">
                    <div class="text-center">
                        <!-- Product name-->
                        <h5 class="fw-bolder">${producto.nombre}</h5>
                        <!-- Product price-->
                        <h3>$${producto.precio}</h3>
                        <p>${producto.detalle}</p>
                    </div>
                </div>
                <!-- Product actions-->
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <button onclick=agregarAlCarrito(${producto.id}) class="btn btn-danger mt-auto" href="#">Agregar al Carrito</button>
                    </div>
                </div>
            </div>
        </div>
        `;
  });
}

function mostrarCarrito() {
  const carrito = capturarStorage();
  contenederCarrito.innerHTML = "";
  carrito.forEach((producto) => {
    contenederCarrito.innerHTML += `
        <tr>
            <th scope="row"><button onclick="restarCantidad(${
              producto.id
            })" class="btn text-white"><</button>${
      producto.cantidad
    }<button onclick="incrementarCantidad(${
      producto.id
    })" class="btn text-white">></button></th>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.precio * producto.cantidad}</td>
            <td><button class="btn btn-danger" onclick="eliminarProductoCarrito(${
              producto.id
            })">x </button></td>
        </tr>
        `;
  });
  cantidadCarrito();
  mostrarTotalCarrito();
}

function verCarrito() {
  if (divCarrito.style.display === "none") {
    divCarrito.style.display = "inline";
  } else {
    divCarrito.style.display = "none";
  }
}



function capturarStorage() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function guardarStorage(elemento) {
  localStorage.setItem("carrito", JSON.stringify(elemento));
}


function cantidadCarrito() {
  const carrito = capturarStorage();
  burbujaCarrito.innerHTML = carrito.length;
}

function dentroDeCarrito(id) {
  const carrito = capturarStorage();
  return carrito.find((e) => e.id === id);
}

function mostrarTotalCarrito() {
  const carrito = capturarStorage();
  const total = carrito.reduce(
    (acc, elem) => acc + elem.cantidad * elem.precio,
    0
  );
  totalCarrito.innerHTML = total;
}

function agregarAlCarrito(id) {
  const carrito = capturarStorage();
  if (dentroDeCarrito(id)) {
    incrementarCantidad(id);
  } else {
    const productoAgregar = productos.find((prod) => prod.id === id);
    carrito.push({ ...productoAgregar, cantidad: 1 });
    swal.fire(`Producto: ${productoAgregar.nombre} agregado al carrito`)
    guardarStorage(carrito);
    mostrarCarrito();
  }
}

function eliminarProductoCarrito(id) {
  const carrito = capturarStorage();
  const resultado = carrito.filter((prod) => prod.id !== id); 
  guardarStorage(resultado);
  mostrarCarrito();
}

function incrementarCantidad(id) {
  const carrito = capturarStorage();
  const indice = carrito.findIndex((e) => e.id === id); // busco la posicion del objeto
  carrito[indice].cantidad < carrito[indice].stock
    ? carrito[indice].cantidad++
    : swal.fire("sin stock"); //segun la  posicion le sumo uno a cantidad
  guardarStorage(carrito);
  mostrarCarrito();
}

function restarCantidad(id) {
  let carrito = capturarStorage();
  const indice = carrito.findIndex((e) => e.id === id); 
  if (carrito[indice].cantidad > 1) {
    carrito[indice].cantidad--; 
    guardarStorage(carrito);
    mostrarCarrito();
  } else {
    carrito = confirm(`desea eliminar ${carrito[indice].nombre} del carrito de compras`) && eliminarProductoCarrito(id);
  }
}

function eliminarCarrito() {
  confirm("desea eliminar todos los productos del carrito de compra") &&
    localStorage.removeItem("carrito");
  mostrarCarrito();
}

function confirmarCompra() {
  eliminarCarrito();
  Swal.fire('Gracias por su compra!') //aca
}

function filtrar() {
  const reultado =
    selectFiltrar.value !== "todo"
      ? productos.filter((e) => e.categoria === selectFiltrar.value)
      : productos;
  return reultado;
}

function buscar(array, valor) {
  const reult = array.filter((e) =>
    e.nombre.toLowerCase().match(valor.toLowerCase())
  );
  return reult;
}

// LOGICA
mostrarProductos(productos);
mostrarCarrito();
cantidadCarrito();

crearSelect(ordenar, selectOrdenar);
crearSelect(categorias, selectFiltrar);

selectFiltrar.onchange = () => {
  const prodFiltrados = filtrar();
  mostrarProductos(prodFiltrados);
};

selectOrdenar.onchange = (e) => {
  const prodFiltrados = filtrar(e);
  const prodOrdenados = prodFiltrados.sort((a, b) => {
    if (a[selectOrdenar.value] > b[selectOrdenar.value]) {
      return 1;
    }
    if (a[selectOrdenar.value] < b[selectOrdenar.value]) {
      return -1;
    }
    return 0;
  });
  mostrarProductos(prodOrdenados);
};

inputBuscar.oninput = (e) => {
  const prodFiltrados = buscar(filtrar(), e.target.value);
  mostrarProductos(prodFiltrados);
};