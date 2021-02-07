const { join, resolve } = require('path')

const express = require('express')
const expressSession = require('express-session')
const passport = require('passport')
const { Issuer, Strategy } = require('openid-client')

async function initOidcClient(options) {
    const issuer = await Issuer.discover(options.issuer)
    return new issuer.Client({
        client_id: options.clientId,
        client_secret: options.clientSecret,
    })
}

const oidcModule = async function (moduleOptions) {
    const options = Object.assign({}, this.options.oidc, moduleOptions)

    const app = express()

    app.use(expressSession(options.session || {}))
    app.use(passport.initialize())
    app.use(passport.session())

    const client = await initOidcClient(options)
    const params = {
        // TODO replace to auto generated callback url
        redirect_uri: options.callbackUrl,
        scope: ['openid'].concat(options.scope).join(' '),
    }
    passport.use(
        'oidc',
        new Strategy({ client, params }, (_tokenset, userinfo, done) => {
            done(null, userinfo)
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((id, done) => {
        done(null, id)
    })

    app.get('/oidc/login', (req, res, next) => {
        req.session.redirectUrl = req.query.redirect || '/'
        passport.authenticate('oidc', (err, user) => {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/oidc/login'); }
        })(req, res, next);
    })
    app.get('/oidc/callback', passport.authenticate('oidc', {}), (req, res) => {
        if (!req.user) {
            res.redirect('/')
        }

        const redirectUrl = req.session.redirectUrl
        delete req.session.redirectUrl
        res.redirect(redirectUrl || '/')
    })
    app.get('/oidc/logout', (req, res) => {
        req.logout()
        res.redirect('/')
    })
    app.get('/oidc/user', (req, res) => {
        res.json(req.isAuthenticated() ? req.user : {})
    })
    this.addServerMiddleware(app)

    const { dst } = this.addTemplate({
        src: resolve(__dirname, './plugin.js'),
        fileName: join('oidc.js'),
    })
    this.options.plugins.push(resolve(this.options.buildDir, dst))
}

module.exports = oidcModule
module.exports.meta = require('../package.json')