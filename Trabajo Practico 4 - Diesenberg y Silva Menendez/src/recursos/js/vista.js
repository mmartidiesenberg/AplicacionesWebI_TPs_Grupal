import { etiquetaPrecio } from "./catalogo.js"
import { calcularTotal } from "./carrito.js"

function formatearPrecio(precio) {
    const sufijo = precio.sufijo ? ` ${precio.sufijo}` : ""
    return `${precio.texto} $ ${precio.monto}${sufijo}`
}

function renderizarCategorias(select, categorias) {
    categorias.forEach((categoria) => {
        select.insertAdjacentHTML("beforeend", `<option value="${categoria.id}">${categoria.nombre}</option>`)
    })
}

function renderizarCatalogo(contenedor, productos) {
    let productosHTML = ""

    productos.forEach((producto) => {
        const presentacion = producto.presentacion ? `<li>${producto.presentacion}</li>`: ""
        const precios = producto.precios.map((precio) => `<li>${formatearPrecio(precio)}</li>`).join("")

        let selector = ""
        if (producto.precios.length > 1) {
            const opciones = producto.precios
                .map((precio, indice) => `<option value="${indice}">${etiquetaPrecio(precio)} - $ ${precio.monto}</option>`)
                .join("")

            selector = `
            <label class="oculto-visualmente" for="variante-${producto.id}">Elegí una opción de ${producto.nombre}</label>
            <select class="tarjeta__variante" id="variante-${producto.id}">${opciones}</select>
            `
        }

        productosHTML += `
        <article class="tarjeta">
            <picture class="tarjeta__figura">
                <img class="tarjeta__imagen" src="${producto.imagen}" alt="${producto.alt}">
            </picture>
            <h3 class="tarjeta__titulo">${producto.nombre}</h3>
            <p class="tarjeta__descripcion">${producto.descripcion}</p>
            <ul class="tarjeta__detalles">
                ${presentacion}
                ${precios}
            </ul>
            ${selector}
            <button class="boton boton--primario tarjeta__boton boton-agregar-producto" data-id="${producto.id}">Añadir al carrito</button>
        </article>
        `
    })

    contenedor.innerHTML = productosHTML
}

function renderizarResumen(contenedor, carrito, productos) {
    if (carrito.length === 0) {
        contenedor.innerHTML = `<p>Tu pedido está vacío.</p>`
        return
    }

    let resumenHTML = ""

    carrito.forEach((item, posicion) => {
        const producto = productos.find((p) => p.id === item.id)
        const precio = producto.precios[item.variante]
        const detalle = producto.precios.length > 1 ? ` (${etiquetaPrecio(precio)})` : ""

        resumenHTML += `
        <li class="resumen__item">
            <span class="resumen__nombre">${producto.nombre}${detalle}</span>
            <span class="resumen__precio">$ ${precio.monto * item.cantidad}</span>
            <div class="resumen__controles">
                <button class="boton boton--contorno resumen__boton" type="button" data-accion="restar" data-posicion="${posicion}" aria-label="Quitar uno">-</button>
                <span class="resumen__cantidad">${item.cantidad}</span>
                <button class="boton boton--contorno resumen__boton" type="button" data-accion="sumar" data-posicion="${posicion}" aria-label="Agregar uno">+</button>
                <button class="boton boton--contorno resumen__boton" type="button" data-accion="eliminar" data-posicion="${posicion}">Eliminar</button>
            </div>
        </li>
        `
    })

    contenedor.innerHTML = `<ul class="resumen__lista">${resumenHTML}</ul>`
}

function actualizarResumen(contenedorResumen, elementoTotal, carrito, productos) {
    renderizarResumen(contenedorResumen, carrito, productos)
    elementoTotal.textContent = calcularTotal(carrito, productos)
}

function limpiarErrores(mensajes) {
    mensajes.forEach((mensaje) => {
        mensaje.textContent = ""
    })
}

function mostrarCatalogo(contenedor, lista) {
    if (lista.length === 0) {
        contenedor.innerHTML = `<p class="catalogo__aviso">No encontramos productos con esa búsqueda.</p>`
        return
    }
    renderizarCatalogo(contenedor, lista)
}

export { mostrarCatalogo, renderizarCategorias, actualizarResumen, limpiarErrores }