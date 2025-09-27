const express = require('express');
const cors = require('cors');
const setupSwagger = require('./swagger'); // Using require

// Route Imports
const usersRouter = require('./routes/users');
const contentsRouter = require('./routes/contents');
const tagsRouter = require('./routes/tags');

const app = express();
app.use(cors());
app.use(express.json());

// --- Setup Swagger ---
setupSwagger(app);

// --- API Routes ---
// This wires up all the Sequelize routes you created
app.use('/api/users', usersRouter);
app.use('/api/contents', contentsRouter);
app.use('/api/tags', tagsRouter);

// Set the port to 3001 to match your docker-compose file
const PORT = process.env.PORT || 3001; 

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});