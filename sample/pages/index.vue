<template>
  <div>
    <p>isLoggedIn: {{ $oidc.isLoggedIn }}</p>
    <p>user: {{ $oidc.user }}</p>
    <button v-if="!$oidc.isLoggedIn" @click="$oidc.login()">
      Login
    </button>
    <button v-else @click="$oidc.logout()">
      Logout
    </button>
  </div>
</template>

<script>
export default {
  middleware: ['oidc']
}
</script>
