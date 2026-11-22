const categoriasMiga = [
    { id: "cafeteria", nombre: "Cafetería" },
    { id: "pasteleria", nombre: "Pastelería" },
    { id: "desayunos", nombre: "Desayunos" },
    { id: "meriendas", nombre: "Meriendas" }
]

const contactoMiga = {
    whatsapp: "5493515123456"
}

const productosMiga = [
    {
        id: 1,
        nombre: "Medialuna",
        categoria: "desayunos",
        descripcion: "Medialuna de manteca",
        imagen: "./recursos/imagenes/medialuna.jpg",
        alt: "Medialuna o Croissant",
        presentacion: "Unidad o docena",
        precios: [
            { texto: "Precio", monto: 1500, sufijo: "x unidad" },
            { texto: "Precio", monto: 15000, sufijo: "x docena" }
        ]
    },
    {
        id: 2,
        nombre: "Muffin",
        categoria: "pasteleria",
        descripcion: "Muffin de chip de chocolate",
        imagen: "./recursos/imagenes/muffin.jpg",
        alt: "Foto del artículo Muffin",
        presentacion: "Unidad",
        precios: [
            { texto: "Precio", monto: 1800 }
        ]
    },
    {
        id: 3,
        nombre: "Torta",
        categoria: "pasteleria",
        descripcion: "Porción de torta casera",
        imagen: "./recursos/imagenes/torta.jpg",
        alt: "Porción de torta",
        presentacion: "Porción",
        precios: [
            { texto: "Precio", monto: 3000 }
        ]
    },
    {
        id: 4,
        nombre: "Chipa",
        categoria: "meriendas",
        descripcion: "Chipa recién horneada",
        imagen: "./recursos/imagenes/chipa.jpg",
        alt: "Chipa o pan de queso",
        presentacion: "Unidad o docena",
        precios: [
            { texto: "Precio", monto: 1200, sufijo: "x unidad" },
            { texto: "Precio", monto: 13000, sufijo: "x docena" }
        ]
    },
    {
        id: 5,
        nombre: "Café",
        categoria: "cafeteria",
        descripcion: "Café a elección",
        imagen: "./recursos/imagenes/cafe.jpg",
        alt: "Taza de café",
        presentacion: "",
        precios: [
            { texto: "Chico", monto: 1500 },
            { texto: "Mediano", monto: 2000 },
            { texto: "Grande", monto: 3000 }
        ]
    },
    {
        id: 6,
        nombre: "Limonada",
        categoria: "meriendas",
        descripcion: "Limonada natural",
        imagen: "./recursos/imagenes/limonada.jpg",
        alt: "Vaso de limonada",
        presentacion: "Vaso",
        precios: [
            { texto: "Precio", monto: 1800 }
        ]
    },
    {
        id: 7,
        nombre: "Jugo",
        categoria: "desayunos",
        descripcion: "Jugo exprimido",
        imagen: "./recursos/imagenes/jugo.jpg",
        alt: "Vaso de jugo",
        presentacion: "Vaso",
        precios: [
            { texto: "Precio", monto: 1800 }
        ]
    }
]

export { productosMiga, categoriasMiga, contactoMiga }