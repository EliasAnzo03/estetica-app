const express = require('express');
const cors = require('cors');
const pg = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

console.log("---- INTENTANDO CONECTAR A LA BASE DE DATOS ----");
console.log(process.env.DATABASE_URL); 

// CONFIGURACIÓN DE BASE DE DATOS BLINDADA 🛡️
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // <--- ESTA ES LA LÍNEA MÁGICA
  }
});

// --- RUTA 1: OBTENER TODOS LOS PRODUCTOS (GET) ---
// (Esta es la que probablemente se rompió)
app.get('/api/productos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM productos');
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos');
    }
});

// --- RUTA 2: CREAR PRODUCTO NUEVO (POST) ---
app.post('/api/productos', async (req, res) => {
    const { nombre, precio, stock, imagen_url } = req.body;
    
    try {
        const nuevoProducto = await pool.query(
            'INSERT INTO productos (nombre, precio, stock, imagen_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, precio, stock, imagen_url]
        );
        res.json(nuevoProducto.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear producto" });
    }
});

// --- RUTA 3: RESERVAR TURNO (POST) ---
app.post('/api/turnos', async (req, res) => {
    const { cliente, fecha, servicio } = req.body;
    
    try {
        const nuevoTurno = await pool.query(
            'INSERT INTO turnos (cliente_nombre, fecha_hora, servicio) VALUES ($1, $2, $3) RETURNING *',
            [cliente, fecha, servicio]
        );
        res.json(nuevoTurno.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo reservar el turno" });
    }
});

// RUTA 4: BORRAR PRODUCTO (DELETE)
app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM productos WHERE id = $1', [id]);
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("--> ERROR AL BORRAR:", error); // Esto nos dirá si la base de datos se queja
        res.status(500).json({ error: "No se pudo eliminar" });
    }
});

// RUTA 5: ACTUALIZAR PRODUCTO (PUT)
app.put('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, stock, imagen_url } = req.body;
    
    try {
        const resultado = await pool.query(
            'UPDATE productos SET nombre = $1, precio = $2, stock = $3, imagen_url = $4 WHERE id = $5 RETURNING *',
            [nombre, precio, stock, imagen_url, id]
        );
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "No se pudo actualizar" });
    }
});

// OBTENER SERVICIOS (GET)
app.get('/api/servicios', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM servicios');
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener servicios');
    }
});

// --- RUTAS PARA SERVICIOS (Agregalas en index.js) ---

// 1. CREAR SERVICIO (POST)
app.post('/api/servicios', async (req, res) => {
    const { nombre, precio, descripcion, imagen_url } = req.body;
    try {
        const nuevo = await pool.query(
            'INSERT INTO servicios (nombre, precio, descripcion, imagen_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, precio, descripcion, imagen_url]
        );
        res.json(nuevo.rows[0]);
    } catch (err) { console.error(err); res.status(500).json({ error: "Error al crear servicio" }); }
});

// 2. BORRAR SERVICIO (DELETE)
app.delete('/api/servicios/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM servicios WHERE id = $1', [req.params.id]);
        res.json({ message: "Servicio eliminado" });
    } catch (err) { console.error(err); res.status(500).json({ error: "Error al borrar" }); }
});

// 3. EDITAR SERVICIO (PUT)
app.put('/api/servicios/:id', async (req, res) => {
    const { nombre, precio, descripcion, imagen_url } = req.body;
    try {
        await pool.query(
            'UPDATE servicios SET nombre=$1, precio=$2, descripcion=$3, imagen_url=$4 WHERE id=$5',
            [nombre, precio, descripcion, imagen_url, req.params.id]
        );
        res.json({ message: "Actualizado" });
    } catch (err) { console.error(err); res.status(500).json({ error: "Error al actualizar" }); }
});



app.listen(PORT, () => { // <--- Usá la variable PORT, no el número 3000 fijo
  console.log(`Servidor corriendo en puerto ${PORT}`);
});