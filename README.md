nuxt-oidc
=========

OpenID Connect authentication support for Nuxt.js

## Usage

### Install

```
$ npm install nuxt-oidc
```

### Configuration

```json5
// nuxt.config.js
{
  modules: [
    '@nuxtjs/axios',
    'nuxt-oidc',
  ],
  oidc: {
    issuer: '<Your issuer>',
    clientId: '<Client ID>',
    clientSecret: '<Client Secret>',
    callbackUrl: 'http://localhost:3000/oidc/callback',
    scope: [
      'email',
      'profile',
      'address',
    ],
    // express-session configuration
    session: {
      secret: '<secret>',
      cookie: {},
      resave: false,
      saveUninitialized: false,
    },
  },
}
```

### Use 'oidc' middleware

Use `oidc` middleware for pages that require authentication.

```vue
<script>
export default {
  middleware: ['oidc']
}
</script>
```

See [sample](./sample) directory for more details.


## License

[MIT License](./LICENSE) - Copyright (c) deko2369