const express = require("express");
const userController = require("../controllers/usersController");
const router = express.Router();
const validaciones = require('../middlewares/validateLoginMiddleware.js');

router.get('/login', userController.viewLogin);
router.post('/login', validaciones, userController.login)

router.get('/register', userController.viewRegister);
router.post('/register', userController.register);

router.get('/profile', userController.verPerfil)

router.get('/homeAdmin', userController.homeAdmin)

router.get('/logout', userController.logout)


module.exports = router;