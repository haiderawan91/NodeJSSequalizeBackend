const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const routes = require('./routes');
const cors = require('cors');
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  exposedHeaders: 'Authorization',
}));
app.use(routes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});
