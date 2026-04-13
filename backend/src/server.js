const express = require('express');
const cors = require('cors');
const subscriptionRoutes = require('./routes/subscriptions');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
