export default {
  modules: [
    '@nuxtjs/axios',
    '../lib/module',
  ],
  oidc: {
    issuer: process.env.OIDC_ISSUER,
    clientId: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    callbackUrl: 'http://localhost:3000/oidc/callback',
    scope: [
      'email',
      'profile',
      'address',
    ],
    // express-session configuration
    session: {
      secret: process.env.OIDC_SESSION_SECRET,
      cookie: {},
      resave: false,
      saveUninitialized: false,
    },
  },
}
