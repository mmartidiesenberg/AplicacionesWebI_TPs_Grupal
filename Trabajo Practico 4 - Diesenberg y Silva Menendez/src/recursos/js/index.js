import { productosMiga } from "./productos.js"
import { renderizarCatalogo } from "./funciones.js"

const productosEnCarro = []

const contenedorProductos = document.getElementById("contenedor-productos")
const productosSeleccionados = document.getElementById("productos-seleccionados")

// Renderizamos
renderizarCatalogo(contenedorProductos, productosMiga)

// Escuchadores de los botones de cada producto
const botonesProducto = contenedorProductos.querySelectorAll(".boton-agregar-producto")

botonesProducto.forEach((boton) => {
    boton.addEventListener("click", () => {
        const idProducto = parseInt(boton.dataset.id)
        productosEnCarro.push(idProducto)
        console.log(productosEnCarro)

        if (productosSeleccionados) {
            productosSeleccionados.textContent = productosEnCarro.length
        }
    })
})