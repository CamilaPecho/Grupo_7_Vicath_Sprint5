const jsonDB = require('../model/jsonDatabase');
const {validationResult} = require('express-validator');
const users = jsonDB('users');
const bcript = require('bcryptjs');

const userController = {
    viewLogin: (req,res) =>{
        res.render('./users/login')
    },

    login: (req,res) =>{
    const resultadosValidaciones = validationResult(req);
    
    if(!resultadosValidaciones.isEmpty())
    {
        return res.render('./users/login', {errors: resultadosValidaciones.mapped()})
    }
    
    //Ahora voy a validar si existe en la BD y tirar su respectivo error a la vista en caso de acierto
    let usuarioEncontrado = users.buscardorPorCategoriaIndividual('mail', req.body.usuario)

    if(usuarioEncontrado)
    {
    //Ahora valido contraseñas, en caso de exito lo guardo en session
   
        if(usuarioEncontrado.contrasenia == req.body.contrasenia)
        {
            console.log("entre pa");
            delete usuarioEncontrado.contrasenia;
            req.session.usuarioLogeado = usuarioEncontrado;
            
            //aca vemos si esta activo el checkbox de recordame, y si lo esta despierto mi cookie
            if(req.body.recordarme)
            {
                res.cookie("mailCookie", req.body.usuario, { maxAge: (1000 * 60) * 60 }) //guardamos sólo el mail porque con eso es suficiente pa buscar en la BD, además la cookie de este estilo tiene un limite de 4kb y hay q ser los más optimos posibles
            }
            return res.redirect('/profile')
        }
        else
        {
            return res.render('./users/login', {errors: {
                usuario: {
                    msg: "Credenciales invalidas!"
                }
            }, oldData: req.body})
        }
    }

    return res.render('./users/login', {errors: {
        usuario: {
            msg: "No se encontró este usuario en nuestro sistema!"
        }
    }})
    },
    
    logout: (req, res) =>{
        res.clearCookie('mailCookie');
        req.session.destroy();
        return res.redirect('/')
    },

    viewRegister:(req,res)=>{
        res.render('./users/register')
    },

    register:(req,res)=>{
        if(req.body.contrasenia == req.body.contrasenia2){
           let contraseñaEncriptada = bcript.hashSync(req.body.contraseña,12) 
        }else{
            return res.render('./users/register',{errors:{contrasenia:{msg:"Las contraseñas no coinciden"}}})
        }
        
        let usuario = {
            id:0,
            nombre:req.body.nombre,
            apellido:req.body.apellido,
            imagen:req.file.filename,
            contraseña: contraseñaEncriptada, //aca deberia estar encriptado
            mail:req.body.email,
            telefono:req.body.telefono,
            //categoria:"cliente"
        }
        users.create(usuario)
        res.redirect("/")
    },

    verPerfil:(req,res)=>{
       
        res.render('./users/perfil', {usuarioDatos: req.session.usuarioLogeado});  
    },

    homeAdmin: (req, res) => {
        res.render('./users/homeAdmin')
    }
}

module.exports = userController;