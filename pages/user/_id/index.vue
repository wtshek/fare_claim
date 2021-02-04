<template>
  <section>
    <b-tabs v-model="currentTab" type="is-toggle" expanded class="setting-tabs">
      <b-tab-item
        :label="$t('settingTabs.savedRoutes')"
        icon="star"
        value="savedRoutes"
        class="tab"
      >
        <SavedRoutesTable :data="savedRoutes" :on-del-route="onDelRoute" />
      </b-tab-item>
      <b-tab-item
        :label="$t('settingTabs.setting')"
        icon="cog"
        value="settings"
        class="tab"
      >
        <settings />
      </b-tab-item>
      <b-tab-item
        :label="$t('settingTabs.profile')"
        icon="account"
        value="profile"
        class="tab"
      >
        <Profile :data="userInfo" :on-logout="onLogout" />
      </b-tab-item>
    </b-tabs>
  </section>
</template>
<script>
export default {
  components: {
    Profile: () => import('../../../components/profile'),
    SavedRoutesTable: () => import('../../../components/savedRoutesTable'),
    Settings: () => import('../../../components/settings'),
  },
  data() {
    return {
      currentTab: 'savedRoutes',
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.baseInfo
    },
    savedRoutes() {
      return this.$store.state.user.favRoutes
    },
  },
  mounted() {
    this.$store.dispatch('user/getUserInfo')
    this.$store.dispatch('user/getFavRoutes')
  },

  methods: {
    onDelRoute(id) {
      this.$store.dispatch('user/delFavRoute', id)
    },
    onLogout() {
      this.$store.dispatch('user/logout')
    },
  },
}
</script>
<style lang="scss">
.tabs {
  font-size: 0.7rem;
}
</style>
