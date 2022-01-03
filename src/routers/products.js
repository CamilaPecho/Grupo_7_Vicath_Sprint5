const express = require("express");
const productController = require("../controllers/productController");
const multer = require('multer');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage(
    {
        destination:function(req,file,cb){
            cb(null,"./public/images")
        },
        filename: function(req,file,cb){
            cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);
        }
    }
)

const upload = multer({storage});

router.get('/all', productController.all);

router.get('/cart', productController.cart);

//Para mostrar un producto 👀
router.get('/productDetail/:id', productController.productDetail)

router.get('/categorias/:categoria',productController.category)

router.get('/busqueda',productController.search)
//Para agregar un producto
router.get('/create', productController.viewProductAdd); //para devolver la vista formulario
router.post('/create', upload.array('image'), productController.productAdd);

router.get("/edit/:id",productController.viewProductEdit);
router.put("/edit/:id",upload.array('image'), productController.productEdit);
//Para listar productos tabla admin 📖
router.get('/viewProducts', productController.viewProducts);

router.delete('/delete/:id', productController.productDelete)

module.exports = router;