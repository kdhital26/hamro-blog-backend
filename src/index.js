require("dotenv").config();
const express = require('express');
const app = express();
require('./db/db.connection');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./router/router');
const cors = require('cors')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())
const dir = path.resolve(path.join((__dirname), '/uploads'));

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
//to access file publicly
app.use('/src/uploads', express.static('src/uploads'));

//calling all routes here
app.use('/api', routes);

app.listen(2000, () => {
// console.log(path.resolve(path.join((__dirname))), ' => dir name here');
}); 
