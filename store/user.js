// import axios from 'axios'
import axios from 'axios'
import { getLang } from '../utils/utils'
import { user } from '../utils/localForageInstance'

const favRoutes = 'favRoutes'
// const baseInfo = 'baseInfo'
const isOnline = false

export const state = () => ({
  // jwt: undefined,
  baseInfo: {
    _id: '',
    name: '',
    gender: '',
    email: '',
    phoneL: '',
    registered: '',
  },
  favRoutes: [],
  lang: '',
  goTour: false,
})

export const mutations = {
  signUp() {
    // logic goes here
  },

  // ============================
  // User Info Related Mutations
  // =============================

  setUserInfoState(state, data) {
    state.baseInfo = data
  },

  // ============================
  // Route Related Mutation
  // =============================

  setFavRoutesState(state, routes) {
    state.favRoutes = routes
  },
  setLang(state, lang) {
    state.lang = getLang(lang)
  },
  goTour(state) {
    state.goTour = true
  },
}

export const actions = {
  async login({ state, commit }, { email, password }) {
    // TODO: connect to api
    try {
      await user.setItem('jwt-token', '1231234.syfg2343.fwsef333')
      return 'Login successfully'
    } catch (err) {
      return err
    }
  },

  async signUp({ state, commit }, { email, password }) {
    // TODO: connect to api
    try {
      await axios.get('')
    } catch (err) {
      return err
    }
  },

  async logout({ state, commit }) {
    // const res = await axios.post('', { email, password })
    if (!process.browser) return ''
    try {
      await user.removeItem('jwt-token')
      return 'logout successfully'
    } catch (err) {
      return err
    }
  },

  // ============================
  // User Info Related Actions
  // =============================

  async getUserInfo({ commit }) {
    if (isOnline) {
      try {
        const res = await axios.get('')
        commit('setUserInfoState', res)
      } catch (error) {
        // const data = await user.getItem(baseInfo)
        // commit('setUserInfoState', data)
      }
    }
  },
  async editUserProfil({ commit }) {
    try {
      const res = await axios.put('')
      commit('getUserInfo', res)
    } catch (err) {
      console.log(err)
    }
  },

  async onLogout({ commit }) {},

  // ============================
  // Route Related Actions
  // =============================

  async saveFavRoute({ state, commit }, route) {
    try {
      const routes = await user.getItem(favRoutes)
      route._id = routes ? routes.length + 1 : 0
      await user.setItem(favRoutes, routes ? [...routes, route] : [route])
    } catch (err) {
      return new Error(err)
    }
  },

  async getFavRoutes({ commit }) {
    try {
      const routes = await user.getItem(favRoutes)
      commit('setFavRoutesState', routes || [])
    } catch (err) {
      return new Error(err)
    }
  },

  async delFavRoute({ commit }, id) {
    try {
      const routes = await user.getItem(favRoutes)
      const filteredRoutes = routes.filter((route) => route._id !== id)
      await user.setItem(favRoutes, filteredRoutes)
      commit('setFavRoutesState', filteredRoutes)
    } catch (error) {
      console.log(error)
    }
  },

  async changeLang({ commit }, lang) {
    await user.setItem('lang', lang)
    commit('setLang', lang)
  },
  async savedRouteFreqIncrease({ commit }, _id) {
    const routes = await user.getItem(favRoutes)
    const newRoutes = routes.map((route) => {
      if (route._id === _id) route.frequency += 1
      return route
    })

    commit('setFavRoutesState', routes)

    await user.setItem(favRoutes, newRoutes)
  },
}
