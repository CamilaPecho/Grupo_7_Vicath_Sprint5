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
    
    let contraseniaOk = bcript.compareSync(req.body.contrasenia, usuarioEncontrado.contrasenia);
        if(contraseniaOk)
        {
            console.log("entre pa");
            delete usuarioEncontrado.contrasenia;
            req.session.usuarioLogeado = usuarioEncontrado;
            
            //aca vemos si esta activo el checkbox de recordame, y si lo esta despierto mi cookie
            if(req.body.recordarme)
            {
                res.cookie("mailCookie", req.body.usuario, { maxAge: (1000 * 60) * 60 }) 
                //guardamos sólo el mail porque con eso es suficiente pa buscar en la BD, 
                //además la cookie de este estilo tiene un limite de 4kb y hay q ser los más optimos posibles
            }
            console.log("entrando a perfil")
            
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

        const resultadosValidaciones = validationResult(req);
                
            if(!resultadosValidaciones.isEmpty())
            {
                return res.render('./users/register', {errors: resultadosValidaciones.mapped(), datosViejos: req.body})
            }


        let usuarioEncontrado = users.buscardorPorCategoriaIndividual('mail', req.body.email)

        if(usuarioEncontrado){
            console.log("test")
            console.log(req.body)
            return res.render('./users/register',{errors: {
                email: { msg:"Este mail ya esta registrado" }}, datosViejos: req.body
            })
        }

       
        let contraseniaEncriptada;

        if(req.body.contrasenia == req.body.contrasenia2 ){
            contraseniaEncriptada = bcript.hashSync(req.body.contrasenia,12) 
        }else{
            return res.render('./users/register',{errors: {
                contrasenia: {
                    msg:"Las contraseñas no coinciden"
                }
            }, datosViejos: req.body})
        }
        
        let usuario = {
            id: 0,
            nombre:req.body.nombre,
            apellido:req.body.apellido,
            imagen:req.file? req.file.filename: "default.jpg",
            contrasenia: contraseniaEncriptada, //aca deberia estar encriptado
            mail:req.body.email,
            telefono:req.body.telefono,
            //categoria:"cliente"
        }
        console.log(usuario);
        users.create(usuario)

        /*
        //A pedido de camila---
        let usuarioRegisterSession = users.buscardorPorCategoriaIndividual('mail', usuario.mail)
        //delete usuarioRegisterSession.contrasenia; //por temas de seguridad xd
        req.session.usuarioLogeado = usuarioRegisterSession;
        console.log("testing")
        console.log(req.session.usuarioLogeado);
        */
        res.redirect("/login")
    },

    verPerfil:(req,res)=>{
        
        res.render('./users/perfil', {usuarioDatos: req.session.usuarioLogeado});  
    },

    homeAdmin: (req, res) => {
        res.render('./users/homeAdmin')
    }
}

module.exports = userController;