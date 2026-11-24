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

function etiquetaPrecio(precio) {
    return precio.sufijo ? precio.sufijo : precio.texto
}

async function cargarProductos() {
    const respuesta = await fetch("./recursos/datos/productos.json")
    if (!respuesta.ok) {
        throw new Error(`No se Pudo Cargar el Catálogo (${respuesta.status})`)
    }
    return await respuesta.json()
}

export { cargarProductos, filtrarProductos, etiquetaPrecio }