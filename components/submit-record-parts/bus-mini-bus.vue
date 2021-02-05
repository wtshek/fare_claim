<template>
  <div>
    <ValidationProvider v-slot="{ errors }">
      <b-field :label="$t('inputLabel.route')">
        <b-autocomplete
          v-model="computedRouteName"
          :data="
            filterAutoComplete(routeNames, bus.routeName, sortWithBusNumber)
          "
          :clearable="true"
          required
          field="name"
          :open-on-focus="true"
          @select="(option) => onRouteNameSelect(option)"
        >
          <template slot="empty">No results found</template>
        </b-autocomplete>
      </b-field>
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
    <div v-if="needToSelectStops">
      <ValidationProvider v-slot="{ errors }">
        <b-field :label="$t('inputLabel.boarding')">
          <b-select
            v-model="computedOnboard"
            required
            field="name"
            @input="(option) => onOnboardStopSelect(option)"
          >
            <option v-for="stop in onboardStops" :key="stop.id" :value="stop">
              {{ stop.name }}
            </option>
          </b-select>
        </b-field>
        <span>{{ errors[0] }}</span>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }">
        <b-field :label="$t('inputLabel.alighting')">
          <b-select
            v-model="computedAlight"
            required
            field="name"
            @input="(option) => onAbortStopSelect(option)"
          >
            <option v-for="stop in alightStops" :key="stop.id" :value="stop">
              {{ stop.name }}
            </option>
          </b-select>
        </b-field>
        <span>{{ errors[0] }}</span>
      </ValidationProvider>
    </div>
  </div>
</template>
<script>
import { ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import { filterAutoComplete, sortWithBusNumber } from '../../utils/sumbitRecord'
export default {
  name: 'BusMiniBus',
  components: { ValidationProvider },
  props: {
    isRecordEdit: Boolean,
    type: String,
  },
  data() {
    return {
      routeName: '',
      sortWithBusNumber,
    }
  },

  computed: {
    ...mapState({
      bus: (state) => state.bus,
      record: (state) => state.pt.record,
      submitRecord: (state) => state['submit-record'],
      PTData: (state) => state.db.PTData,
      lang: (state) => state.user.lang,
    }),
    routeNames() {
      const routeNames = this.bus.routeNames

      if (!routeNames) return []
      return Array.from(this.bus.routeNames)
    },
    computedRouteName: {
      set(val) {
        if (this.bus.routeName !== val)
          this.$store.commit('bus/setRouteName', val)
      },
      get() {
        return this.bus.routeName
      },
    },
    computedAlight: {
      set(val) {
        return ''
      },
      get() {
        const { alightStopId } = this.submitRecord.record
        const { stops } = this.$store.state.db.PTData
        const { lang } = this.$store.state.user
        if (stops && lang && alightStopId) {
          const alightStop = JSON.parse(JSON.stringify(stops[alightStopId]))
          alightStop.name = alightStop.locales[lang].name + ' or after'
          return alightStop
        } else {
          return {}
        }
      },
    },
    computedOnboard: {
      set(val) {
        return ''
      },
      get() {
        const { onboardStopId } = this.submitRecord.record
        const { stops } = this.PTData
        if (stops && this.lang && onboardStopId) {
          const onboardStop = JSON.parse(JSON.stringify(stops[onboardStopId]))
          onboardStop.name = onboardStop.locales[this.lang].name + ' or before'
          return onboardStop
        } else {
          return {}
        }
      },
    },
    needToSelectStops() {
      if (this.alightStops.length <= 1 && this.onboardStops.length <= 1)
        return false
      return true
    },
    alightStops() {
      const stops = this.bus.alightStops
      if (stops.length === 1) {
        this.$store.commit('submit-record/setRecord', {
          alightStopId: stops[0].key,
        })
        this.$store.dispatch('bus/getFare')
      }
      return this.bus.alightStops || []
    },
    onboardStops() {
      return this.bus.onboardStops || []
    },
  },
  watch: {
    type() {
      this.$store.dispatch('bus/onCreated', this.type)

      // if type change
      this.computedRouteName = ''
    },
    isRecordEdit(newVal) {
      if (newVal === true) {
        this.$store.dispatch('bus/getRouteName')
        this.$store.dispatch('bus/getOnboardStops')
        this.$store.dispatch('bus/getAlightStops')
      }
    },
  },
  mounted() {
    // this.$store.dispatch('bus/resetRoute')
    // get route name and lang
    this.$store.dispatch('bus/onCreated', this.type)
  },
  updated() {
    if (this.inRecordEdit) {
    }
    console.log(this.isRecordEdit)
  },
  methods: {
    onRouteNameSelect(option) {
      // deal with bus, tram, ferry and minibus only
      this.$store.commit('submit-record/resetRecord')

      if (option !== null) {
        // get all the info about the selected route
        // get the onboard stops
        const { key, inbound } = option
        this.$store.commit('submit-record/setRecord', {
          routeIndex: Number(key),
          bounds: inbound ? 'inbound' : 'outbound',
        })
        this.$store.dispatch('bus/getRouteName')
        this.$store.dispatch('bus/getOnboardStops')
      }
    },
    filterAutoComplete,
    onOnboardStopSelect(val) {
      if (!val) return
      this.$store.commit('submit-record/setRecord', {
        onboardStopId: val.key,
      })
      this.$store.dispatch('bus/getAlightStops')
      this.$store.dispatch('bus/getFare')
    },
    onAbortStopSelect(val) {
      if (!val) return
      this.$store.commit('submit-record/setRecord', {
        alightStopId: val.key,
      })
      this.$store.dispatch('bus/getFare')
    },
  },
}
</script>
