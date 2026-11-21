const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})

// POST - Crear un nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body

    // Si falta alguno, respondemos con 400 (Peticion erronea)
    if (!nombre || !descripcion || !precio) {
        return res.status(400).json({mensaje: 'Los campos nombre, descripcion y precio son obligatorios'})
    }

    // Generamos un id nuevo: el id mas grande + 1
    let nuevoId = 1
    if (productos.length > 0) {
        nuevoId = Math.max(...productos.map(p => p.id)) +1
    }

    // Armamos el producto nuevo (el precio se convertira en numero)
    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        descripcion:  descripcion,
        precio: parseFloat(precio)
    }

    productos.push(nuevoProducto)
    res.status(201).json(nuevoProducto)
})

    // PUT - Actualizar un producto existente
    app.put('/productos/:id', (req, res) => {
        // Obtenemos el id de la URL y lo convertimos a numero
        const id = parseInt(req.params.id)

        // Buscamos la posicion del producto en el arreglo
        const indice = productos.findIndex(p => p.id === id)

        // Si no existe, findIndex devuelve -1, respondemos con 404
        if (indice === -1) {
            return res.status(404).json({mensaje: 'Producto no encontrado'})
        }

        const { nombre, descripcion, precio } = req.body
    
        // Si falta alguno, respondemos con 400 (Peticion erronea)
        if (!nombre || !descripcion || !precio) {
            return res.status(400).json({mensaje: 'Los campos nombre, descripcion y precio son obligatorios'})
        }

        // Remplazamos los datos conservados en el mismo id
        productos[indice] = {
            id: id,
            nombre: nombre,
            descripcion: descripcion,
            precio: parseFloat(precio)
        }

        // Respondemos 200 con el producto actualizado
        res.status(200).json(productos[indice])

        // DELETE - Eliminar un producto
        app.delete('/productos/:id', (req, res) => {
            const id = parseInt(req.params.id)
            const indice = productos.findIndex(p => p.id === id)

            // Si no existe, respondemos con 404
            if(indice === -1) {
                return res.status(404).json({mensaje: 'producto no encontrado'})
            }

            // splice elimina 1 elemento en esaa posicion y lo devuelve dentro de un arreglo
            const productoEliminado = productos.splice(indice, 1)

            // Respondemos con un mensaje y los datos del producto eliminado
            res.json({
                mensaje: 'Producto eliminado',
                producto: productoEliminado
            })
        })

    })


app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
