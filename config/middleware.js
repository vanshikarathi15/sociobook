// ye create kia h hm kb, flash messages wale me
//ye middle ware q banaye h jo hmne users_controller me req.flash krke msg kia h once the request is completed just before going to response we have to take out that flash messages and put it tht into response so we have created this middleware

//ab ye krne ke baad index.js main  me or iss middle ware ko jaake requrie kro ye krne ke baad jidhr app.use(flash()) kia ho uske neeche app.use(customWare.setFlas)


module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}


