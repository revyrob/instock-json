require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const inventoryRoute = require('./routes/api.inventory');
const warehouseRoute = require('./routes/api.warehouses');

app.use(cors());
app.use(express.json());
app.use('/warehouse', warehouseRoute);
app.use('/inventory', inventoryRoute);

app.listen(PORT, () => {
  console.log('app listening on port', PORT);
});
