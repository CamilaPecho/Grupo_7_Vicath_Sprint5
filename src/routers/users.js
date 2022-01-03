const express = require("express");
const userController = require("../controllers/usersController");
const router = express.Router();

router.get('/login', userController.viewLogin);
router.post('/login',userController.login)

router.get('/register', userController.viewRegister);
router.post('/register', userController.register);

router.get('/profile', userController.verPerfil)

router.get('/homeAdmin', userController.homeAdmin)

module.exports = router;