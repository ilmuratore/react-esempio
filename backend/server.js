const express = require('express');
const cors = require('cors');
const todosRoutes = require('./todos')
require('dotenv').config();


const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173'}))
app.use(express.json());
app.use('/todos', todosRoutes)

app.get('/health', (req, res) => res.json({ status : 'ok'}));

app.listen(PORT, () => console.log(`SERVER IN ASCOLTO SU http://localhost:${PORT}`));