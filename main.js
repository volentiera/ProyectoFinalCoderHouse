//Este script contiene los productos que tengo para vender, tiene 4 botones para mostrar los items segun su tipo y se pueden agregar
//al carrito que es una pagina separada. Los datos los traigo de una api y los coloco en clases y de ahi manejo todo.

//Clases
class Producto {
    constructor(id, nombre, imagen, tipo, talle, marca, precio) {
        this.id = id
        this.nombre = nombre
        this.imagen = imagen
        this.tipo = tipo
        this.talle = talle
        this.marca = marca
        this.precio = (precio * iva) + precio
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

//----------------Variables/constantes globales---------------
let catalogoProductos = []
let carrito
let producto
const iva = 0.21
let divCartas



// -----------------Funciones------------------

// guarda los archivos para que no se borren cuando refresco la pagina index.
function parseJsonToProducto(object) {
    let id = object.id
    let nombre = object.nombre
    let imagen = object.imagen
    let tipo = object.tipo
    let talle = object.talle
    let marca = object.marca
    let precio = object.precio
    return new Producto(id, nombre, imagen, tipo, talle, marca, precio)
}
// guarda los archivos para que no se borren cuando refresco la pagina index.
window.addEventListener('DOMContentLoaded', () => {
    carrito = new Carrito()
    storage = JSON.parse((localStorage.getItem("carrito")))
    if (storage != null) {
        storage.productos.map(element => {
            let productoParseado = parseJsonToProducto(element)
            carrito.productos.push(productoParseado)
        })
    }
})

//Trae los datos de una mockapi y los pasa a la clase producto
async function inicializarCatalogoProductos() {
    let data = await (await fetch("https://62e2a4b4b54fc209b87dbcaf.mockapi.io/catalogoProductos", {
        method: "GET"
    })).json()
    for (let i = 0; i < data.length; i++) {
        producto = new Producto(data[i].id, data[i].nombre, data[i].imagen, data[i].tipo, data[i].talle, data[i].marca, Math.round(data[i].precio))
        catalogoProductos.push(producto)
    }
}

function toast() {
    Toastify({
        text: "Se agrego al carrito, Clickee para ir al Carrito",
        destination: "paginas/carrito.html",
        duration: 2000
    }).showToast();
}
//Define como seran todas las cartas que estan en la api.

function crearCarta(producto) {
    let crearCarta = `    
    <div class="card col-3 shadow-lg">
    <img src="${producto.imagen}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">Talle: ${producto.talle}</p>
            <p class="card-text">Marca: ${producto.marca}</p>
            <p class="card-text">Precio:  $ ${producto.precio}</p>
            <a class="btn btn-primary botonCompra d-flex justify-content-center" id="${producto.id}">Agregar al carrito</a>
        </div>
    </div>
    `
    return crearCarta

}
//Crea toda las cartas de la api.
function crearCartaHtml() {
    let cardsDiv = document.getElementById("cards")
    catalogoProductos.forEach(producto => {
        cardsDiv.innerHTML += crearCarta(producto)
    })
}


//Limpiar las cartas para que no se acumulen indefinidamente al apretar botones de busqueda segun tipo.

function limpiarCartas() {
    divCartas = document.getElementById("cards")
    divCartas.innerHTML = ""
}

//Crea cartas segun el tipo: indumentaria al clickear el boton indumentaria.
function cartasIndumentaria() {
    let buscar = catalogoProductos.filter(producto => producto.tipo == "indumentaria")
    let botonIndumentaria = document.getElementById("botonIndumentaria")
    botonIndumentaria.onclick = () => {
        limpiarCartas()
        let cardsDiv = document.getElementById("cards")
        buscar.forEach(producto => {
            cardsDiv.innerHTML += crearCarta(producto)
        })
        let botones = document.getElementsByClassName("botonCompra")
        let arrayDeBotones = Array.from(botones)
        arrayDeBotones.forEach(boton => {
            boton.addEventListener("click", (e) => {
                let productoSeleccionado = buscar.find(producto => producto.id == e.target.id)
                carrito.productos.push(productoSeleccionado)
                renovarStorage()
                toast()
            })
        })
    }
}
//Crea cartas segun el tipo: calzado al clickear el boton calzado.
function cartasCalzado() {
    let buscar = catalogoProductos.filter(producto => producto.tipo == "calzado")
    let botonCalzado = document.getElementById("botonCalzado")
    botonCalzado.onclick = () => {
        limpiarCartas()
        let cardsDiv = document.getElementById("cards")
        buscar.forEach(producto => {
            cardsDiv.innerHTML += crearCarta(producto)
        })
        let botones = document.getElementsByClassName("botonCompra")
        let arrayDeBotones = Array.from(botones)
        arrayDeBotones.forEach(boton => {
            boton.addEventListener("click", (e) => {
                let productoSeleccionado = buscar.find(producto => producto.id == e.target.id)
                carrito.productos.push(productoSeleccionado)
                renovarStorage()
                toast()
            })
        })
    }
}
//Crea cartas segun el tipo: accesorio al clickear el boton accesorio.
function cartasAccesorio() {
    let buscar = catalogoProductos.filter(producto => producto.tipo == "accesorio")
    let botonAccesorio = document.getElementById("botonAccesorio")
    botonAccesorio.onclick = () => {
        limpiarCartas()
        let cardsDiv = document.getElementById("cards")
        buscar.forEach(producto => {
            cardsDiv.innerHTML += crearCarta(producto)
        })
        let botones = document.getElementsByClassName("botonCompra")
        let arrayDeBotones = Array.from(botones)
        arrayDeBotones.forEach(boton => {
            boton.addEventListener("click", (e) => {
                let productoSeleccionado = buscar.find(producto => producto.id == e.target.id)
                carrito.productos.push(productoSeleccionado)
                renovarStorage()
                toast()
            })
        })
    }
}
//Renueva el storage del carrito
function renovarStorage() {
    localStorage.removeItem("carrito")
    localStorage.setItem("carrito", JSON.stringify(carrito))
}
//agrega al carrito segun el boton apretado de cada carta, Tambien hago esta misma funcion en cada una de las busquedas segun tipo
function agregarAlCarrito() {
    let botones = document.getElementsByClassName("botonCompra")
    let arrayDeBotones = Array.from(botones)
    arrayDeBotones.forEach(boton => {
        boton.addEventListener("click", (e) => {
            let productoSeleccionado = catalogoProductos.find(producto => producto.id == e.target.id)
            carrito.productos.push(productoSeleccionado)
            renovarStorage()
            toast()
        })
    })
}
//Muestra todas las cartas al apretar el boton todos.
function botonTodo() {
    let botonTodo = document.getElementById("botonTodo")
    botonTodo.onclick = () => {
        limpiarCartas()
        crearCartaHtml()
        agregarAlCarrito()
    }
}

//funcion principal
async function main() {
    await inicializarCatalogoProductos()
    crearCartaHtml()
    agregarAlCarrito()
    cartasIndumentaria()
    cartasCalzado()
    cartasAccesorio()
    botonTodo()

}
main()