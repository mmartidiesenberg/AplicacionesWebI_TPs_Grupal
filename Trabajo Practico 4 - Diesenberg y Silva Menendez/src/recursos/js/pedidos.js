import { productosMiga } from "./productos.js"
import { obtenerCarrito, guardarCarrito, calcularTotal, renderizarResumen } from "./funciones.js"

const carrito = obtenerCarrito()
const resumen = document.getElementById("resumen")
const total = document.getElementById("total")
const formulario = document.getElementById("formulario-pedido")
const vistaPedido = document.getElementById("vista-pedido")
const vistaConfirmacion = document.getElementById("vista-confirmacion")
const mensajesError = document.querySelectorAll(".formulario__error")

function actualizarResumen() {
    renderizarResumen(resumen, carrito, productosMiga)
    total.textContent = calcularTotal(carrito, productosMiga)
}

function limpiarErrores() {
    mensajesError.forEach((mensaje) => {
        mensaje.textContent = ""
    })
}

actualizarResumen()

resumen.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button")
    if (!boton) return

    const posicion = parseInt(boton.dataset.posicion)
    const accion = boton.dataset.accion

    if (accion === "sumar") {
        carrito[posicion].cantidad++
    }

    if (accion === "restar") {
        carrito[posicion].cantidad--
        if (carrito[posicion].cantidad === 0) {
            carrito.splice(posicion, 1)
        }
    }

    if (accion === "eliminar") {
        carrito.splice(posicion, 1)
    }

    guardarCarrito(carrito)
    actualizarResumen()
})

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault()
    limpiarErrores()

    const nombre = formulario.elements["nombre"].value.trim()
    const telefono = formulario.elements["telefono"].value.trim()
    const entrega = formulario.elements["entrega"].value
    const pago = formulario.elements["pago"].value
    let valido = true

    if (nombre.length < 3) {
        document.getElementById("error-nombre").textContent = "Ingresá tu nombre completo."
        valido = false
    }

    if (telefono.length < 8 || isNaN(telefono)) {
        document.getElementById("error-telefono").textContent = "Ingresá un teléfono válido (solo números, mínimo 8)."
        valido = false
    }

    if (entrega === "") {
        document.getElementById("error-entrega").textContent = "Elegí cómo querés recibir tu pedido."
        valido = false
    }

    if (pago === "") {
        document.getElementById("error-pago").textContent = "Elegí una forma de pago."
        valido = false
    }

    if (carrito.length === 0) {
        document.getElementById("error-carrito").textContent = "Tu pedido está vacío. Agregá productos desde el catálogo."
        valido = false
    }

    if (!valido) return

    document.getElementById("confirmacion-nombre").textContent = nombre
    document.getElementById("confirmacion-entrega").textContent = entrega
    document.getElementById("confirmacion-pago").textContent = pago
    document.getElementById("confirmacion-total").textContent = calcularTotal(carrito, productosMiga)

    carrito.length = 0
    guardarCarrito(carrito)

    vistaPedido.hidden = true
    vistaConfirmacion.hidden = false
    window.scrollTo(0, 0)
})

formulario.addEventListener("reset", () => {
    limpiarErrores()
})