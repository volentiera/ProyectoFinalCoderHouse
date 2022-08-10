//Muestra los items agregados al carrito y permite borrar todos los items o comprarlos y al comprarlos envia el json a una api.

//Clases

class Producto {
    constructor(id, nombre, imagen, tipo, talle, marca, precio) {
        this.id = id
        this.nombre = nombre
        this.imagen = imagen
        this.tipo = tipo
        this.talle = talle
        this.marca = marca
        this.precio = precio
    }


}
class Carrito {
    constructor() {
        this.productos = []
    }

    calcularTotal() {
        let total = 0
        for (let i = 0; i < this.productos.length; i++) {
            total = total + this.productos[i].precio

        }
        return Math.round(total)
    }

}
//todo lo global

let divCarrito = null
let storage
let carrito
let producto
let productoParseado


// funciones

//Limpia el carrito.
function limpiarCarrito() {
    divCarrito = document.getElementById("carrito")
    divCarrito.innerHTML = ""
}
//Muestra el precio total y genera 2 botones para comprar o para eliminar.
function verTotalCarrito(carrito) {
    if (divCarrito == null) {} else {
        divCarrito.innerHTML += `
    <div class="separador50"></div>
    <div class="d-flex justify-content-between align-items-center"">
        <div>
            <h1 class="text-center">Precio Total: $ ${carrito.calcularTotal()}</h1>
        </div>
        <div class="justify-content-end">
            <button type="button" class="btn btn-primary" id="botonConfirmar">Confirmar Compra</button>
            <button type="button" class="btn btn-danger" id="botonEliminar">Eliminar Articulos</button>
        </div>
    </div>
    <div class="separador50"></div>
    `
    }
}
//crea el html del carrito
function crearCarrito() {
    carrito.productos.forEach((element, index) => {
        divCarrito = document.getElementById("carrito")
        divCarrito.innerHTML +=
            `
        <div id="producto-${index}" class="row border-bottom">
            <div class="col-3">
                <img src="${element.imagen}" class="modificarImagenCarrito" alt="..."/>
            </div>
            <div class="col-9 d-flex justify-content-between align-items-center text-center">
                <div class="col-1">
                    <h5>${index+1}-</h5>
                </div>
                <div class="col">
                    <h5>${element.nombre}</h5>
                </div>
                <div class="col">
                    <h5>Precio: $${element.precio}</h5>
                </div>
                <div class="col">
                    <h5>Talle: ${element.talle}</h5>
                </div>

            </div>
        </div>
        `
    })
}
// guarda los archivos para que no se borren cuando refresco la pagina index.
function parseJsonToProducto(object) {
    let id = object.id
    let nombre = object.nombre
    let imagen = object.imagen
    let tipo = object.tipo
    let talle = object.talle
    let marca = object.marca
    let precio = object.precio
    return new Producto(id, nombre, imagen, tipo, talle, marca, Math.round(precio))
}
//borra todo al eliminar o comprar el carrito.
function borrarTodo() {
    carrito = []
    productoParseado = []
    localStorage.clear()
}
//envia los datos a una api y elimina los items del carrito.
function comprarYSubirApi() {
    let botones = document.getElementById("botonConfirmar")
    if (botones != null) {
        botones.addEventListener("click", () => {
            const swalCompra = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
            })
            swalCompra.fire({
                title: '¿Desea comprar los productos?',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Si!',
                cancelButtonText: 'No!'
            }).then((result) => {
                if (result.isConfirmed) {
                    subirApi()
                    borrarTodo()
                    limpiarCarrito()
                    swalCompra.fire(
                        'Productos Comprados',
                        '',
                        'success'
                    )
                }
            })
        })
    }
}
//sube a la api al comprar el carrito.
function subirApi() {
    localStorage.getItem("carrito", JSON.stringify(carrito))
    let carritoAlmacenado = localStorage.getItem("carrito")
    if (carritoAlmacenado !== null) {
        contactos = JSON.parse(carritoAlmacenado)
        console.log(carritoAlmacenado)
    }
    fetch("https://62e2a4b4b54fc209b87dbcaf.mockapi.io/CarritoComprado", {
            method: "POST",
            body: carritoAlmacenado,
            headers: {
                "Content-type": "application/json"
            }
        }).then(response => response.json())
        .then(data => data)
}
//borra todo al clickear el boton eliminar.
function eliminarDelCarrito() {
    let botones = document.getElementById("botonEliminar")
    if (botones != null) {
        botones.addEventListener("click", () => {
            const swalBorrar = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
            })
            swalBorrar.fire({
                title: '¿Desea borrar todos los productos?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si!',
                cancelButtonText: 'No!',
            }).then((result) => {
                if (result.isConfirmed) {
                    borrarTodo()
                    limpiarCarrito()
                    swalBorrar.fire(
                        'Productos borrados!',
                        '',
                        'success'
                    )
                }
            })
        })
    }
}

// guarda los archivos para que no se borren cuando refresco la pagina index y contiene la funcionalidad de la pagina
window.addEventListener('DOMContentLoaded', () => {
    carrito = new Carrito()
    storage = JSON.parse((localStorage.getItem("carrito")))
    if (storage != null) {
        storage.productos.map(element => {
            productoParseado = parseJsonToProducto(element)
            carrito.productos.push(productoParseado)
        })
    }
    crearCarrito()
    verTotalCarrito(carrito)
    comprarYSubirApi()
    eliminarDelCarrito()

})