/* Soluciono el tema de las imagenes multiples haciendo uso de un array de imagenes*/
const jsonDB = require('../model/jsonDatabase');

const products = jsonDB('productos');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const productController = {

    all:(req,res)=>{
        let productos = products.all()
        res.render("./products/results",{productos})
    },

    search:(req,res)=>{
        let productos =[]
        let datos = products.readFile()
        if(req.query.busqueda.length == 1){
            productos = datos.filter(dato => {
                return dato.title[0] == req.query.busqueda.toUpperCase()
            })
           
        }else{
            productos = datos.filter(dato => {
                return dato.title.includes(req.query.busqueda.toUpperCase())
            })
        }
        res.render("./products/results",{productos})
    },

    category:(req,res)=>{
        let productos = products.buscardorPorCategoria("type",req.params.categoria)
        res.render("./products/results",{productos})
    },

    cart: (req,res) =>{
        res.render("./products/cart");
    },

    productDetail:(req, res)=>{
        let productoElegido = products.find(req.params.id);
        res.render("./products/productDetail", {detailProd: productoElegido})
    },

    viewProducts:(req,res) =>{
        let productos = products.all();
        res.render("./products/listProducts",{productos})
    },

    viewProductAdd: (req,res) =>{
        res.render("./products/productAdd")
    },

    productAdd: (req,res) =>{
        let imagenes= []

        for(let i = 0 ; i<req.files.length;i++){
            imagenes.push(req.files[i].filename)
        }

        let producto = {
            id:0,
            title:req.body.title.toUpperCase(),
            price:req.body.price,
            category: req.body.category,
            description: req.body.description,
            image:req.files != undefined?imagenes:"default.jpg"
        }
        products.create(producto)
        res.redirect("/products/viewProducts")
    },

    viewProductEdit:(req,res)=>{
        let producto = products.find(req.params.id)
        res.render("./products/productEdit",{producto})
    },
    
    productEdit:(req,res)=>{
        let arrayImagenes = [];
        let productoTest = products.find(req.params.id);
       
        for(let i = 0 ; i<productoTest.image.length;i++){
            arrayImagenes.push(productoTest.image[i])
        }

        let imagenes= [];

        for(let i = 0 ; i<req.files.length;i++){
            imagenes.push(req.files[i].filename)
        }
        
        let producto = {
            id: req.params.id,
            title:req.body.title,
            price:Number(req.body.price),
            category: req.body.category,
            description: req.body.description,
            image:req.files != ''? imagenes: arrayImagenes
        }
        products.update(producto)
        res.redirect("/products/viewProducts")
    },

    productDelete:(req,res)=>{
        products.delete(req.params.id)
        res.redirect("/products/viewProducts")
    }

}

module.exports = productController;
