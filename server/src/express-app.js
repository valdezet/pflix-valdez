const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload());
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());
// register all routers on /routes

/**
 * prefix for all the routes on backend
 * use / for no prefix
 */
const ROUTE_PREFIX = "/api";
/**
 * path of routes relative to this file (express-app.js)
 */
const ROUTES_PATH = 'routes';

/**
 * register all route files in the ROUTES_PATH folder
 * all exports on the folder must be a express.Router object
 * this does not support route dir scanning
 */
fs.readdirSync(path.resolve(__dirname, ROUTES_PATH)).forEach(filename => {
  const router = require(`./${ROUTES_PATH}/` + filename);
  app.use(ROUTE_PREFIX, router);
});

module.exports = app;