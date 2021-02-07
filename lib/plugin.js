import Vue from 'vue'
import Middleware from './middleware'

Middleware.oidc = async ({ $oidc, req }) => {
    $oidc.setUser(req.isAuthenticated() ? req.user : {})
}

class Oidc {
    constructor(ctx) {
        this.ctx = ctx

        Vue.set(this, 'state', {})
        this.setUser({})
    }

    get user() {
        return this.state.user
    }

    get isLoggedIn() {
        return this.state.isLoggedIn
    }

    setUser(user) {
        Vue.set(this.state, 'user', user)
        Vue.set(this.state, 'isLoggedIn', Object.keys(user).length > 0)
    }

    async fetchUser() {
        if (!this.ctx.$axios) {
            console.error('[nuxt-oidc] add the @nuxtjs/axios module to nuxt.config file')
            return
        }

        try {
            this.setUser(await this.ctx.$axios.$get('/oidc/user'))
        } catch (err) {
            console.error(`[nuxt-oidc] failed to fetch user data: ${err.message}`)
            this.setUser({})
        }
    }

    login(redirect='/') {
        if (process.client) {
            const params = new URLSearchParams({ redirect });
            window.location.replace('/oidc/login?' + params.toString())
        }
    }

    logout() {
        if (process.client) {
            window.location.replace('/oidc/logout')
        }
    }
}

export default async function (ctx, inject) {
    const $oidc = new Oidc(ctx)

    inject('oidc', $oidc)
    ctx.$oidc = $oidc

    if (process.client) {
        await $oidc.fetchUser()
    }
}
