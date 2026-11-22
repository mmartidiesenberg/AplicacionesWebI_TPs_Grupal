function formatearPrecio(precio) {
    const sufijo = precio.sufijo ? ` ${precio.sufijo}` : ""
    return `${precio.texto} $ ${precio.monto}${sufijo}`
}

function etiquetaPrecio(precio) {
    return precio.sufijo ? precio.sufijo : precio.texto
}

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
}

function precioMinimo(producto) {
    return Math.min(...producto.precios.map((precio) => precio.monto))
}

function filtrarProductos(productos, filtros) {
    const texto = normalizar(filtros.texto)

    const resultado = productos.filter((producto) => {
        const coincideTexto = normalizar(producto.nombre).includes(texto)
        const coincideCategoria = filtros.categoria === "" || producto.categoria === filtros.categoria
        return coincideTexto && coincideCategoria
    })

    if (filtros.orden === "precio-asc") {
        resultado.sort((a, b) => precioMinimo(a) - precioMinimo(b))
    }

    if (filtros.orden === "precio-desc") {
        resultado.sort((a, b) => precioMinimo(b) - precioMinimo(a))
    }

    if (filtros.orden === "nombre") {
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    }

    return resultado
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

function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem("carrito")) || []
    } catch (error) {
        console.error("Carrito ilegible, se reinicia:", error)
        return []
    }
}

function guardarCarrito(carrito) {
    try {
        localStorage.setItem("carrito", JSON.stringify(carrito))
    } catch (error) {
        console.error("No se pudo guardar el carrito:", error)
    }
}

function contarProductos(carrito) {
    return carrito.reduce((total, item) => total + item.cantidad, 0)
}

function agregarAlCarrito(carrito, id, variante) {
    const existente = carrito.find((item) => item.id === id && item.variante === variante)

    if (existente) {
        existente.cantidad++
    } else {
        carrito.push({ id: id, variante: variante, cantidad: 1 })
    }
}

function calcularTotal(carrito, productos) {
    return carrito.reduce((total, item) => {
        const producto = productos.find((p) => p.id === item.id)
        return total + producto.precios[item.variante].monto * item.cantidad
    }, 0)
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

function construirPedido(carrito, productos, datos) {
    const items = carrito.map((item) => {
        const producto = productos.find((p) => p.id === item.id)
        const precio = producto.precios[item.variante]

        return {
            id: producto.id,
            nombre: producto.nombre,
            variante: producto.precios.length > 1 ? etiquetaPrecio(precio) : "",
            cantidad: item.cantidad,
            precioUnitario: precio.monto,
            subtotal: precio.monto * item.cantidad
        }
    })

    return {
        fecha: new Date().toLocaleString("es-AR"),
        cliente: { nombre: datos.nombre, telefono: datos.telefono },
        entrega: datos.entrega,
        pago: datos.pago,
        items: items,
        total: calcularTotal(carrito, productos)
    }
}

function armarMensajeWhatsApp(pedido) {
    const lineas = pedido.items.map((item) => {
        const variante = item.variante ? ` (${item.variante})` : ""
        return `- ${item.cantidad} x ${item.nombre}${variante}: $ ${item.subtotal}`
    })

    return [
        "¡Hola Miga! Quiero hacer este pedido:",
        "",
        ...lineas,
        "",
        `Total: $ ${pedido.total}`,
        `Entrega: ${pedido.entrega}`,
        `Forma de pago: ${pedido.pago}`,
        `Nombre: ${pedido.cliente.nombre}`,
        `Teléfono: ${pedido.cliente.telefono}`
    ].join("\n")
}

function generarEnlaceWhatsApp(numero, pedido) {
    return `https://wa.me/${numero}?text=${encodeURIComponent(armarMensajeWhatsApp(pedido))}`
}

async function cargarProductos() {
    const respuesta = await fetch("./recursos/datos/productos.json")
    if (!respuesta.ok) {
        throw new Error(`No se Pudo Cargar el Catálogo (${respuesta.status})`)
    }
    return await respuesta.json()
}

export {
    renderizarCatalogo,
    renderizarCategorias,
    filtrarProductos,
    obtenerCarrito,
    guardarCarrito,
    contarProductos,
    agregarAlCarrito,
    calcularTotal,
    renderizarResumen,
    construirPedido,
    generarEnlaceWhatsApp,
    cargarProductos
}