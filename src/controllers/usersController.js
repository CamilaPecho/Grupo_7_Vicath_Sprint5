const jsonDB = require('../model/jsonDatabase');

const users = jsonDB('users');

const userController = {
    viewLogin: (req,res) =>{
        res.render('./users/login')
    },

    login: (req,res) =>{
        res.redirect("/")
    },

    viewRegister:(req,res)=>{
        res.render('./users/register')
    },

    register:(req,res)=>{
        let usuario = {
            id:0,
            nombre:req.body.nombre,
            apellido:req.body.apellido,
            contraseña:req.body.contraseña,
            mail:req.body.email,
            telefono:req.body.telefono,
            categoria:"cliente"
        }
        users.create(usuario)
        res.redirect("/")
    },

    verPerfil:(req,res)=>{
        let usuario = users.find(req.params.id)
        res.render('./users/perfil',{usuario})
    },

    homeAdmin: (req, res) => 
    {
        res.render('./users/homeAdmin')
    }
}

module.exports = userController;