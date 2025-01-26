const { login,home,map } = require('../src/controller/controller');
const express = require('express');
const router = express.Router();
require('dotenv/config');

// POST route for login
router.post('/login',login);

// GET route for home
router.get('/home',home);

// GET route for map
router.get('/map', map);


// Export the router
module.exports = router;
