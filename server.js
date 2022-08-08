require('dotenv').config()

const express = require("express");
const productos = require("./modulos/productos");
const carrito = require("./modulos/carrito");

const app = express();
const PORT = process.env.PORT;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', express.static('public'));
app.get('/productos', function (req, res) {
    res.status(201).render('./productos.html');
});
app.get('/carrito', function (req, res) {
    res.status(201).render('./carrito.html');
});

app.use('/api/productos', productos);
app.use('/api/carrito', carrito);
app.get('*', function (req, res) {
    res.status(501).send({ 'error': '-2', 'descripcion': `la ruta ${req.path} metodo ${req.method} no implementada` });
});



const server = app.listen(PORT, (req, res) => {
    console.log(` - El servidor se encuentra activo. Escucha en el puerto ${PORT} - `);
})

server.on("error", e => console.log(`Error en el servidor ${e}`));

