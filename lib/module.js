const path = require('path')

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

export default async function (moduleOptions) {
    const options = Object.assign({}, this.options.oidc, moduleOptions)

    const app = express()

    app.use(expressSession(options.session || {}))
    app.use(passport.initialize())
    app.use(passport.session())

    const client = await initOidcClient(options)
    const params = {
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

    app.get('/oidc/login', passport.authenticate('oidc'))
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
    this.addServerMiddleware(app)

    this.addPlugin(path.resolve(__dirname, 'plugin.js'))
}