function formatearPrecio(precio) {
    const sufijo = precio.sufijo ? ` ${precio.sufijo}` : ""
    return `${precio.texto} $ ${precio.monto}${sufijo}`
}

function renderizarCatalogo(contenedor, productos) {
    let productosHTML = ""

    productos.forEach((producto) => {
        const presentacion = producto.presentacion
            ? `<li>${producto.presentacion}</li>`
            : ""

        const precios = producto.precios
            .map((precio) => `<li>${formatearPrecio(precio)}</li>`)
            .join("")

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
            <button class="boton boton--primario tarjeta__boton boton-agregar-producto" data-id="${producto.id}">Añadir al carrito</button>
        </article>
        `
    })

    contenedor.innerHTML = productosHTML
}

export { renderizarCatalogo }