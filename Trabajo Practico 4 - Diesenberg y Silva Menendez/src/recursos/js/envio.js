import { etiquetaPrecio } from "./catalogo.js"
import { calcularTotal } from "./carrito.js"

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

export { construirPedido, generarEnlaceWhatsApp }