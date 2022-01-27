function adminMiddleware(req, res, next){
    
    if (req.session.usuarioLogeado){
        
       if(req.session.usuarioLogeado.rol != "admin")
       {
           return res.redirect('/');
       } 
}
    next()
}
module.exports = adminMiddleware;