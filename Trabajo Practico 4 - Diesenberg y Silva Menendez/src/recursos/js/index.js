import { categoriasMiga } from "./productos.js"
import { mostrarCatalogo, renderizarCategorias } from "./vista.js"
import { cargarProductos, filtrarProductos } from "./catalogo.js"
import { obtenerCarrito, guardarCarrito, contarProductos, agregarAlCarrito } from "./carrito.js"

const carrito = obtenerCarrito()
const contenedorProductos = document.getElementById("contenedor-productos")
const productosSeleccionados = document.getElementById("productos-seleccionados")
const formularioBuscador = document.querySelector(".buscador")
const campoBuscador = document.getElementById("id-buscar-catalogo")
const selectCategoria = document.getElementById("filtro-categoria")
const selectOrden = document.getElementById("filtro-orden")
const botonLimpiar = document.getElementById("limpiar-filtros")
let productosMiga = []

function aplicarFiltros() {
    const filtros = {
        texto: campoBuscador.value.trim(),
        categoria: selectCategoria.value,
        orden: selectOrden.value
    }
    mostrarCatalogo(contenedorProductos, filtrarProductos(productosMiga, filtros))
}
async function iniciar() {
    try {
        productosMiga = await cargarProductos()
        renderizarCategorias(selectCategoria, categoriasMiga)
        aplicarFiltros()
    } catch (error) {
        console.error(error)
        contenedorProductos.innerHTML = `<p class="catalogo__aviso">No pudimos cargar el catálogo. Probá recargar la página.</p>`
    }
}
iniciar()
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

campoBuscador.addEventListener("input", aplicarFiltros)
selectCategoria.addEventListener("change", aplicarFiltros)
selectOrden.addEventListener("change", aplicarFiltros)

botonLimpiar.addEventListener("click", () => {
    campoBuscador.value = ""
    selectCategoria.value = ""
    selectOrden.value = ""
    aplicarFiltros()
})

formularioBuscador.addEventListener("submit", (evento) => {
    evento.preventDefault()
})