import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();

let DB = process.env.DB;

const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Definir el Schema y el modelo
const productoSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    descripcion: String,
});

const Producto = mongoose.model('Producto', productoSchema);

// Rutas CRUD

// Operacion GET para obtener todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

// Operación POST para agregar un nuevo producto
app.post('/productos', async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const nuevoProducto = new Producto({ nombre, precio, descripcion });
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (error) {
            console.error('Error al agregar producto:', error);
        res.status(500).send('Error al agregar producto');
    }
});

// Operación PUT para actualizar un producto por ID
app.put('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, descripcion } = req.body;

        // Actualizar el producto
        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            { nombre, precio, descripcion },
            { new: true, runValidators: true } // Retorna el documento actualizado
        );
        res.json(productoActualizado);
    } catch (error) {
            console.error("Error al actualizar producto:", error);
        res.status(500).send("Error al actualizar producto");
    }
});

// Operación DELETE para eliminar un producto por ID
app.delete('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminar el producto
        const productoEliminado = await Producto.findByIdAndDelete(id);
        res.send("Producto eliminado exitosamente");
        
        if (!productoEliminado) {
            return res.status(505).send("Producto no encontrado");
        }

    } catch (error) {
            console.error("Error al eliminar producto:", error);
        res.status(500).send("Error al eliminar producto");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});