const express = require("express");
const { Router } = express;
const router = Router();
const Contenededor = require('./contenedor');

const admin = true;

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

const archivo = new Contenededor('./docs/productos.txt');

router.get('/', async (req, res) => {
    const arr = await archivo.getAll();
    res.status(201).send(arr);
});

router.get('/:id', async (req, res) => {
    const el = await archivo.getById(req.params.id);
    res.status(201).send(el);
});

router.post('/', async (req, res) => {
    const nuevo = req.body;
    if (admin) {
        const id = await archivo.save(new Producto(nuevo.nombre, nuevo.descripcion, nuevo.codigo, nuevo.foto, parseFloat(nuevo.precio), parseFloat(nuevo.stock)));
        res.status(201).send({ 'status': 'Ok', 'nuevo id': id });
    } else {
        res.status(501).send({ 'error': '-1', 'descripcion': `la ruta ${req.path} metodo ${req.method} no se encuentra autorizada` });
    }
});

router.put('/:id', async (req, res) => {
    const nuevo = req.body;
    if (admin) {
        const id = await archivo.update(new Producto(nuevo.nombre, nuevo.descripcion, nuevo.codigo, nuevo.foto, parseFloat(nuevo.precio), parseFloat(nuevo.stock), nuevo.timestamp, nuevo.id));
        res.status(201).send({ 'status': 'Ok', 'id actualizado': id })
    } else {
        res.status(501).send({ 'error': '-1', 'descripcion': `la ruta ${req.path} metodo ${req.method} no se encuentra autorizada` });
    }

});

router.delete('/:id', async (req, res) => {
    console.log(req.params.id);
    if (admin) {
        const el = await archivo.deleteById(req.params.id);
        res.status(201).send({ 'status': 'Ok', 'registro eliminado': el })
    } else {
        res.status(501).send({ 'error': '-1', 'descripcion': `la ruta ${req.path} metodo ${req.method} no se encuentra autorizada` });
    }
});

module.exports = router;



