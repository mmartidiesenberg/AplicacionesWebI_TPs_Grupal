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

export { obtenerCarrito, guardarCarrito, contarProductos, agregarAlCarrito, calcularTotal }