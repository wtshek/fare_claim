<template>
  <b-loading v-model="isLoading" :is-full-page="true"></b-loading>
</template>

<script>
export default {
  name: 'HomePage',
  middleware({ store, redirect }) {
    return redirect('/user/:id/submission-records')
  },

  data() {
    return {
      isLoading: true,
    }
  },

  mounted() {},
}
</script>
