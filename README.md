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
  oidc: {
    issuer: '<Your issuer>',
    clientId: '<Client ID>',
    clientSecret: '<Client Secret>',
    callbackUrl: 'http://localhost:3000/oidc/callback',
    scope: [
      'email',
      'profile',
      'address'
    ],
    // express-session configuration
    session: {
      secret: '<secret>',
      cookie: {},
      resave: false,
      saveUninitialized: false
    }
  },
  ...
}
```

### Use 'oidc' middleware

Use `oidc` middleware for pages that require authentication.
When the middleware is enabled and user is not logged in, user will be redirected to login page (`/oidc/login`).

```vue
<script>
export default {
  middleware: ['oidc']
}
</script>
```


## License

[MIT License](./LICENSE) - Copyright (c) deko2369