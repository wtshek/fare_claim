<template>
  <sign-up-login :callback="signIn" />
</template>

<script>
// import SignUpLogin from '../components/signUpLogIn'
export default {
  name: 'SignUp',
  layout: 'center',
  components: {
    SignUpLogin: () => import('../components/signUpLogIn'),
  },

  methods: {
    signIn(info) {
      this.$store.commit('user/sign-up', info).then(() => {
        this.$router.push('/user/:id')
      })
    },
  },
}
</script>
