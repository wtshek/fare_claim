import localforage from 'localforage'
import { flattenObject } from '../utils/utils'
import { getEffectiveChart } from '../utils/sumbitRecord'
/**
 * record structure for bus
 * {
 * routeIndex
 * onboardStopId
 * alightStopId
 * fare
 * }
 */

const stopIDsRegex = /(?<=\d+:).*/

const getDefaultState = () => ({
  routeNames: [],
  alightStops: [],
  onboardStops: [],
  routeName: '',
  lang: '',
})

export const state = () => getDefaultState()

export const mutations = {
  setRouteNames(state, val) {
    state.routeNames = val
  },
  setLang(state, lang) {
    state.lang = lang
  },
  resetAlightStops(state) {
    state.alightStops = []
  },
  resetOnboardStops(state) {
    state.onboardStops = []
  },
  setOnboardStops(state, { charts, stops, lang }) {
    const onBoardStopsIndex = Object.keys(charts).map((key) =>
      key.match(stopIDsRegex)
    )

    const onBoardStops = onBoardStopsIndex.map((index) =>
      // id start with one, but array index start with 0
      JSON.parse(JSON.stringify(stops[index[0]]))
    )
    const editedStops = onBoardStops.map((stop) => {
      const name = stop.locales[lang].name + ' or before'
      return { ...stop, name }
    })
    state.onboardStops = editedStops
  },

  setAlightStops(state, { charts, stops, lang }) {
    const alightStops = Object.keys(charts).map((key) => {
      const id = key.match(stopIDsRegex)
      const clonedStop = JSON.parse(JSON.stringify(stops[id]))
      const name = clonedStop.locales[lang].name + ' or after'
      return { ...clonedStop, name }
    })
    state.alightStops = alightStops
  },
  setRouteName(state, val) {
    state.routeName = val
  },
  resetState(state) {
    state.routeName = ''
    state.alightStops = []
    state.onboardStops = []
  },
}

export const actions = {
  async onCreated({ commit, rootState }, type) {
    const lang = rootState.user.lang
    const routeNames = await localforage.getItem(lang)
    commit('setRouteNames', routeNames['routes-locale'][type])

    commit('setLang', rootState.user.lang)
  },

  getRouteInfo({ commit, rootState, dispatch }) {
    const { routeIndex, bounds } = rootState['submit-record'].record
    const { lang } = rootState.user

    if (!routeIndex) return ''
    // just in case route doesn't exist
    const routeInfo = rootState.db.PTData.routes[routeIndex]

    const {
      name,
      origin_name: originName,
      destination_name: destinationName,
    } = routeInfo.locales[lang]

    const routeName = `${name} to ${
      bounds === 'inbound' ? destinationName : originName
    }`

    commit('setRouteName', routeName)
  },

  getOnboardStops({ commit, rootState, state }) {
    const { stops, routes } = rootState.db.PTData
    const { lang } = rootState.user
    const { bounds, routeIndex } = rootState['submit-record'].record
    const routeInfo = routes[routeIndex]
    const charts = Object.values(routeInfo.charts)[0].bounds[bounds]
    const x = Object.values(charts) // first layer
    const y = Object.values(x) // second layer

    if (x.length === 1 && y.length === 1) {
      commit(
        'submit-record/setRecord',
        { fare: Object.values(y[0])[0] },
        {
          root: true,
        }
      )
    }
    commit('setOnboardStops', { charts, stops, lang })
  },

  getAlightStops({ commit, state, rootState }) {
    const { routeIndex, bounds } = rootState['submit-record'].record
    const { stops, routes } = rootState.db.PTData
    const routeInfo = routes[routeIndex]

    const charts = Object.values(routeInfo.charts)[0].bounds[bounds]

    const onboardStopKey = Object.keys(charts).find((key) => {
      return key.includes(String(key))
    })
    return commit('setAlightStops', {
      charts: charts[onboardStopKey],
      stops,
      lang: rootState.user.lang,
    })
  },

  getFare({ commit, rootState }) {
    const { routeIndex, onboardStopId, bounds, alightStopId, date } = rootState[
      'submit-record'
    ].record
    const { routes } = rootState.db.PTData
    const routeInfo = routes[routeIndex]

    if (!routeIndex || !alightStopId || !onboardStopId) return

    const effectiveChart = getEffectiveChart(
      Object.values(routeInfo.charts),
      date
    )

    const charts = flattenObject(effectiveChart)
    console.log(charts)

    const regex =
      `bounds.` + bounds + `.\\w+:` + onboardStopId + '.\\w+:' + alightStopId

    console.log(regex)

    const chartKey = Object.keys(charts).filter((key) => {
      return key.match(new RegExp(regex))
    })

    const mappedFare = charts[chartKey[0]]
    commit('submit-record/setRecord', { fare: mappedFare }, { root: true })
  },
  resetRoute({ commit, rootState }) {
    // unknown bug, need to reset them separately
    commit('resetAlightStops')
    commit('resetOnboardStops', {})
    commit('resetState')
    commit(
      'submit-record/setRecord',
      {
        fare: '',
        alightStopId: '',
        onboardStopId: '',
        routeInfo: {},
        routeIndex: '',
      },
      { root: true }
    )
  },
}
