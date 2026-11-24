import { contactoMiga } from "./productos.js"
import { actualizarResumen, limpiarErrores } from "./vista.js"
import { cargarProductos } from "./catalogo.js"
import { obtenerCarrito, guardarCarrito } from "./carrito.js"
import { construirPedido, generarEnlaceWhatsApp } from "./envio.js"

const carrito = obtenerCarrito()
const resumen = document.getElementById("resumen")
const total = document.getElementById("total")
const formulario = document.getElementById("formulario-pedido")
const vistaPedido = document.getElementById("vista-pedido")
const vistaConfirmacion = document.getElementById("vista-confirmacion")
const mensajesError = document.querySelectorAll(".formulario__error")
let productosMiga = []

async function iniciar() {
    try {
        productosMiga = await cargarProductos()
        actualizarResumen(resumen, total, carrito, productosMiga)
    } catch (error) {
        console.error(error)
        resumen.innerHTML = `<p>No pudimos cargar tu pedido. Probá recargar la página.</p>`
    }
}

iniciar()

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
    actualizarResumen(resumen, total, carrito, productosMiga)
})

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault()
    limpiarErrores(mensajesError)

    const nombre = formulario.elements["nombre"].value.trim()
    const telefono = formulario.elements["telefono"].value.trim()
    const entrega = formulario.elements["entrega"].value
    const pago = formulario.elements["pago"].value
    let valido = true

    if (nombre.length < 3 || !/^[\p{L} '\-]+$/u.test(nombre)) {
        document.getElementById("error-nombre").textContent = "Ingresá tu nombre completo (solo letras)."
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

    const pedido = construirPedido(carrito, productosMiga, { nombre, telefono, entrega, pago })
    const enlaceWhatsApp = generarEnlaceWhatsApp(contactoMiga.whatsapp, pedido)

    console.log(JSON.stringify(pedido, null, 2))

    document.getElementById("confirmacion-nombre").textContent = pedido.cliente.nombre
    document.getElementById("confirmacion-entrega").textContent = pedido.entrega
    document.getElementById("confirmacion-pago").textContent = pedido.pago
    document.getElementById("confirmacion-total").textContent = pedido.total
    document.getElementById("confirmacion-whatsapp").href = enlaceWhatsApp
    document.getElementById("confirmacion-retiro").hidden = entrega !== "Retiro en el local"

    carrito.length = 0
    guardarCarrito(carrito)

    vistaPedido.hidden = true
    vistaConfirmacion.hidden = false
    window.scrollTo(0, 0)

    window.open(enlaceWhatsApp, "_blank")
})

formulario.addEventListener("reset", () => {
    limpiarErrores(mensajesError)
})