<template>
  <sign-up-login :on-submit="login" form-function="login" />
</template>

<script>
// import SignUpLogin from '../components/signUpLogIn'
import { defaultLanding } from '../config/routes'
export default {
  name: 'SignUp',
  layout: 'center',
  components: {
    SignUpLogin: () => import('../components/signUpLogIn'),
  },

  methods: {
    login(info) {
      this.$store.dispatch('user/login', info).then(() => {
        this.$router.push(defaultLanding.route)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.background {
  background: $primary;
}
.custom-box {
  max-width: $box-max-width;
  position: relative;
}

.switch {
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: underline;
  color: #167df0;
  margin-left: 10px;
  vertical-align: bottom;
}

.m-top {
  margin-top: 20px;
}
</style>
