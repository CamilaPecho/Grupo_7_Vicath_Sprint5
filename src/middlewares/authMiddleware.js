function authMiddleware(req, res, next){
    console.log("zzzzz")
    console.log(req.session.usuarioLogeado)
    if (!req.session.usuarioLogeado){
        return res.redirect('/login')
    }
    next();
}

module.exports = authMiddleware;