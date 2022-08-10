
//variables globales
let contactos = []

let formulario
let inputNombre
let inputApellido
let inputEmail
let inputTipo
let inputComentarios
let botonSubmit
let nombre
let apellido
let email
let tipo
let comentarios
let contacto


//clase

class Contacto {
    constructor(nombre, apellido, email, tipo, comentarios) {
        this.nombre = nombre
        this.apellido = apellido
        this.email = email
        this.tipo = tipo
        this.comentarios = comentarios
    }
}
//inicializo los elementos
function inicializarElementos() {
    formulario = document.getElementById("formulario")
    botonSubmit = document.getElementById("botonSubmit")
    inputNombre = document.getElementById("inputNombre")
    inputApellido = document.getElementById("inputApellido")
    inputEmail = document.getElementById("inputEmail")
    inputTipo = document.getElementById("inputTipo")
    inputComentarios = document.getElementById("inputComentarios")
}

// Realiza el programa al hacer click en el boton
function inicializarEventos() {
    botonSubmit.onclick = (event) => validarFormulario(event)
}

// muestra alert si los valores ingresados no son validos
function alertError(){
        Swal.fire({
            icon: 'error',
            title: `Ingrese Nombre, Apellido y Email`,
        })
}
//Ingresa los datos que obtubo del form y los mete en la clase
function validarFormulario(event) {
    event.preventDefault()
    nombre = inputNombre.value
    apellido = inputApellido.value
    email = inputEmail.value
    tipo = inputTipo.value
    comentarios = inputComentarios.value
    contacto = new Contacto(nombre, apellido, email, tipo, comentarios)
    if ((nombre !== "") && (apellido !== "") && (email !== "")){
    contactos.push(contacto)
    formulario.reset()
    botonSubmit.addEventListener("click", alertSuccess(contacto))
    obtenerContactoLocalStorage()
    }else {
        botonSubmit.addEventListener("click", alertError())
    }
}

// muestra alert si los valores ingresados son validos
function alertSuccess(contacto) {
    Swal.fire({
        icon: 'success',
        title: `Bienvenido: ${contacto.nombre}`,
        text: `En breve responderemos su ${contacto.tipo}`,
    })
}

//obtiene el contacto y lo manda a una mockapi 
function obtenerContactoLocalStorage() {
    localStorage.setItem("Contactos", JSON.stringify(contactos[0]))
    let contactosAlmacenados = localStorage.getItem("Contactos")
    if (contactosAlmacenados !== null) {
        contactos = JSON.parse(contactosAlmacenados)
    }
    fetch("https://62e2a4b4b54fc209b87dbcaf.mockapi.io/Comentarios", {
        method: "POST",
        body: contactosAlmacenados,
        headers: {
            "Content-type": "application/json"
        }
    }).then(response => response.json())
    .then(data => data)
    contactos = []
}

//funcion principal
function main() {
    inicializarElementos()
    inicializarEventos()
}

main()