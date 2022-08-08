const express = require("express");
const { Router } = express;
const router = Router();
const Contenededor = require('./contenedor');



class Producto {
    constructor(nombre, descripcion, codigo, foto, precio, stock, timestamp, id) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.foto = foto;
        this.precio = precio;
        this.stock = stock;
        this.timestamp = timestamp || Date.now();
        this.id = id || 0;
    }
};

class Carrito {
    constructor(id) {
        this.productos = [];
        this.timestamp = Date.now();
        this.id = id || 0;
    }
}

const archivo = new Contenededor('./docs/carrito.txt');
const archivoProductos = new Contenededor('./docs/productos.txt');

// const cargaCarrito
const cargaCarrito = async (carrito, producto) => {
    const listaProductos = carrito.productos;
    if (listaProductos != undefined) {
        const encontrado = listaProductos.find(prod => prod.id == producto.id);
        if (!encontrado) {
            listaProductos.push(producto)
            const id = await archivo.update(carrito);
        } else {
            console.log("El producto ya existe en el carrito");
        }
    }
}

const eliminarProducto = async (carrito, idProd) => {
    const listaProductos = carrito.productos;
    let encontrado = false;
    for (let i = 0; i < listaProductos.length; i++) {
        if (listaProductos[i].id == idProd) {
            encontrado = true;
            listaProductos.splice(i, 1);
        }
    }
    if (!encontrado) {
        console.log("El producto no está dentro del carrito");
    }
    const id = await archivo.update(carrito);
}


router.get('/', async (req, res) => {
    const arr = await archivo.getAll();
    res.status(201).send(arr);
});

router.get('/:id/productos', async (req, res) => {
    const el = await archivo.getById(req.params.id);
    const listaProductos = el.productos;
    if (listaProductos == undefined) {        
        res.status(501).send(el);
    } else {
        res.status(201).send(listaProductos);
    }

});


router.post('/', async (req, res) => {
    const nuevo = req.body;
    const id = await archivo.save(new Carrito());
    res.status(201).send({ 'status': 'Ok', 'nuevo id': id });
});

// Carga Producto en el carrito
router.post('/:id/productos', async (req, res) => {
    const nuevo = req.body;
    const el = await archivo.getById(req.params.id);
    const prod = await archivoProductos.getById(nuevo.id);    
    if (prod.id == undefined) {
        res.status(501).send({ 'error': `El carrito ${req.params.id} no existe` });
    } else {
        // await cargaCarrito(el, new Producto(prod.nombre, prod.descripcion, prod.codigo, prod.foto, prod.precio, prod.stock, prod.timestamp, prod.id));
        await cargaCarrito(el, prod);
        res.status(201).send({ 'status': 'Ok', 'carrito actualizado': el });
    }
});

router.delete('/:id', async (req, res) => {
    const el = await archivo.deleteById(req.params.id);
    res.status(201).send({ 'status': 'Ok', 'registro eliminado': el })
});

router.delete('/:id/productos/:id_prod', async (req, res) => {
    const el = await archivo.getById(req.params.id);
    const id_prod = req.params.id_prod;
    await eliminarProducto(el, id_prod);
    res.status(201).send({ 'status': 'Ok', 'registro eliminado del carrito': el })
});

module.exports = router;



