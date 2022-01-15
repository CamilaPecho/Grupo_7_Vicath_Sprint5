//Importación del controlador universal 🌍
const jsonDB = require('../model/jsonDatabase');
const productModel = jsonDB('productos'); //le mandamos la referencia a nuestro archivo JSON

const mainController = {
    home: (req,res) =>{
        const destacados = productModel.buscardorPorCategoria("category", "destacados");
        const ofertas = productModel.buscardorPorCategoria("category", "ofertas");
        const novedades = productModel.buscardorPorCategoria("category", "novedades");
        
        res.render("home", {destacados, ofertas, novedades})
    },
}



module.exports = mainController;