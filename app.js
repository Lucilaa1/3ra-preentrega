class BaseDeDatos {
    constructor() {
        this.productos = [];
        this.agregarRegistro(1, "Alimento Balanceado", 800, "Alimento", "Alimento-balanceado.jpeg");
        this.agregarRegistro(2, "Alimento Balanceado Humedo", 500, "Alimento", "AlimentoBalanceado-Humedo.jpg");
        this.agregarRegistro(3, "Leche de Gatos Bebés", 350, "Alimento", "leche-Gatitos.jpg");
        this.agregarRegistro(4, "Comedero", 300, "Comederos y Bebederos", "comedero.jpg");
        this.agregarRegistro(5, "Collar", 250, "Accesorios", "collar.jpg");
        this.agregarRegistro(6, "Cama Moises", 2000, "Camas y Cuchas", "cama-Moises.png");
        this.agregarRegistro(7, "Bandeja Sanitaria", 300, "Higiene", "bandeja-Sanitaria.jpg");
        this.agregarRegistro(8, "Cepillo", 250, "Estética", "cepillo.jpg");
        this.agregarRegistro(9, "Transportadora", 3000, "Viaje y Paseo", "transportadora.jpg");
        this.agregarRegistro(10, "Rascador Torre", 1500, "Otros", "rascador-Torre.jpg");
        this.agregarRegistro(11, "Juguete de Ratón", 500, "Juguetes", "juguete-Raton.jpg");
        this.agregarRegistro(12, "Juguete Interactivo", 400, "Juguetes", "juguete-Interactivo.jpg");
    }

    agregarRegistro(id, nombre, precio, categoria, imagen) {
        const producto = new Producto(id, nombre, precio, categoria, imagen);
        this.productos.push(producto);
    }

    traerRegistros() {
        return this.productos;
    }

    registroPorId(id) {
        return this.productos.find((producto) => producto.id === id);
    }

    registrosPorNombre(palabra) {
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
    }

    registrosPorCategoria(categoria) {
        return this.productos.filter((producto) => producto.categoria == categoria);
    }
}
 
class Carrito {
    constructor() {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.totalProductos = 0;
        this.listar();
    }

    estaEnCarrito({ id }) {
        return this.carrito.find((producto) => producto.id === id);
    }

    agregar(producto) {
        let productoEnCarrito = this.estaEnCarrito(producto);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            this.carrito.push({...producto, cantidad: 1 });
            localStorage.setItem("carrito", JSON.stringify(this.carrito));
        }
        this.listar();
    }

    quitar(id) {
        const indice = this.carrito.findIndex((producto) => producto.id === id);

        if (this.carrito[indice].cantidad > 1){
            this.carrito[indice].cantidad--;
        } else{
            this.carrito.splice(indice, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    listar() {
        this.total = 0;
        this.totalProductos = 0;
        divCarrito.innerHTML = "";
        for (const producto of this.carrito) {
            divCarrito.innerHTML += `
                <div class="producto">
                    <h2>${producto.nombre}</h2>
                    <p>${producto.precio}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <a data-id="${producto.id}" class="btnQuitar">ELIMINAR</a>
                </div>
            `;    
            this.total += (producto.precio * producto.cantidad);
            this.totalProducto += producto.cantidad;
        }

        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) {
            boton.onclick = (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            }
        }
        spanCantidadProductos.innerText = this.totalProductos;
        spanTotalCarrito.innerText = this.total;
    }
}

class Producto {
    constructor(id, nombre, precio, categoria, imagen = "imgDefecto.jpg") {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

const bd = new BaseDeDatos();

const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");
const botonesCategorias = document.querySelectorAll(".btnCategoria");

botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (event) => {
        event.preventDefault();
        const botonSeleccionado = document.querySelector(".seleccionado");
        if (botonSeleccionado){
            botonSeleccionado.classList.remove("seleccionado");    
        }
        boton.classList.add("seleccionado");
        const productosPorCategoria = bd.registrosPorCategoria(boton.innerText);
        cargarProductos(productosPorCategoria);
    });
});
    const botonTodos = document.querySelector("#btnTodos");

    botonTodos.addEventListener("click", (event) => {
    event.preventDefault();
    const botonSeleccionado = document.querySelector(".seleccionado");
    if (botonSeleccionado){
        botonSeleccionado.classList.remove("seleccionado");    
    }
    botonTodos.classList.add("seleccionado");
    cargarProductos(bd.traerRegistros());
});

function quitarClaseSeleccionado(){
    const botonSeleccionado = document.querySelector(".seleccionado");
    if (botonSeleccionado){
        botonSeleccionado.classList.remove("seleccionado");    
    } 
}

cargarProductos(bd.traerRegistros());

function cargarProductos(productos) {
    divProductos.innerHTML = "";
    for (const producto of productos) {
        divProductos.innerHTML += `
        <div class="producto">
        <h2>${producto.nombre}</h2> 
        <p>$${producto.precio}</p> 
        <img src="img/${producto.imagen}" width="150" />
        <p><a class="btnAgregar" data-id="${producto.id}">COMPRAR</a></p>
        </div>
        `;
    }

    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = bd.registroPorId(id);
            console.log("Estás agregando el producto:", producto.nombre);
            carrito.agregar(producto);
        });
    }
}

formBuscar.addEventListener("submit", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
});

inputBuscar.addEventListener("keyup", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
});

const carrito = new Carrito();