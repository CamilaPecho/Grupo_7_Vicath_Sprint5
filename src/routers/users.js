const express = require("express");
const userController = require("../controllers/usersController");
const router = express.Router();
const validacionesLogin = require('../middlewares/validateLoginMiddleware.js');
const validacionesRegister = require('../middlewares/validationsRegister.js');
const avatarProfile = require('../middlewares/imageRegister.js');


router.get('/login', userController.viewLogin);
router.post('/login', validacionesLogin, userController.login)

router.get('/register', userController.viewRegister);
router.post('/register',avatarProfile.single('avatar'),validacionesRegister, userController.register);

router.get('/profile', userController.verPerfil)

router.get('/homeAdmin', userController.homeAdmin)

router.get('/logout', userController.logout)


module.exports = router;