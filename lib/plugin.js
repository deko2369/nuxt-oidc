const Middleware = require('./middleware')

Middleware.default.oidc = ({ req, redirect }) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        return redirect('/oidc/login')
    }
}
