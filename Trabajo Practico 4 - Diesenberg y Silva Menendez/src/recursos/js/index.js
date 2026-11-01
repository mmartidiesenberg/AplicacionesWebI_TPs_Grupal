import { productosMiga } from "./productos.js"
import { renderizarCatalogo, obtenerCarrito, guardarCarrito, contarProductos, agregarAlCarrito } from "./funciones.js"

const carrito = obtenerCarrito()
const contenedorProductos = document.getElementById("contenedor-productos")
const productosSeleccionados = document.getElementById("productos-seleccionados")
const formularioBuscador = document.querySelector(".buscador")
const campoBuscador = document.getElementById("id-buscar-catalogo")

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

function mostrarCatalogo(lista) {
    if (lista.length === 0) {
        contenedorProductos.innerHTML = `<p class="catalogo__aviso">No encontramos productos con esa búsqueda.</p>`
        return
    }
    renderizarCatalogo(contenedorProductos, lista)
}

mostrarCatalogo(productosMiga)
productosSeleccionados.textContent = contarProductos(carrito)

contenedorProductos.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".boton-agregar-producto")
    if (!boton) return

    const idProducto = parseInt(boton.dataset.id)
    const selector = document.getElementById("variante-" + idProducto)
    const variante = selector ? parseInt(selector.value) : 0

    agregarAlCarrito(carrito, idProducto, variante)
    guardarCarrito(carrito)
    productosSeleccionados.textContent = contarProductos(carrito)
})

campoBuscador.addEventListener("input", () => {
    const texto = normalizar(campoBuscador.value.trim())

    const productosFiltrados = productosMiga.filter((producto) => {
        return normalizar(producto.nombre).includes(texto)
    })

    mostrarCatalogo(productosFiltrados)
})

formularioBuscador.addEventListener("submit", (evento) => {
    evento.preventDefault()
})