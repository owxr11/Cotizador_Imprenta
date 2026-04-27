import express from 'express'
import cors from 'cors'
import cotizadorRoutes from './routes/cotizador.js'

// Creacion de app con express
const app = express()
const PORT = 3000

// Usar la ruta creada
app.use(cors())
app.use(express.json())
app.use('/api', cotizadorRoutes)

// Prender el backend
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})