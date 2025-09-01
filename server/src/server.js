const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./controllers/authController');
app.use('/api', authRoutes);

const cadetRoutes = require('./controllers/cadetController');
app.use('/api', cadetRoutes);

const busyRoutes = require('./controllers/busyController');
app.use('/api', busyRoutes);

const sickRoutes = require('./controllers/sickController');
app.use('/api', sickRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
