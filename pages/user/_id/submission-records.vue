<template>
  <div class="container">
    <div class="header">
      <div id="logo" />
      <h1>{{ $t('header') }}</h1>
    </div>
    <b-field :label="$t('display.view')" class="select-field" data-v-step="3">
      <b-select v-model="view" placeholder="Select a name">
        <option v-for="option in viewOptions" :key="option" :value="option">
          {{ $t(`display.${option}`) }}
        </option>
      </b-select>
    </b-field>

    <div v-if="view === 'table'" class="table container">
      <b-field :label="$t('display.filter')">
        <b-select v-model="filterOption">
          <option v-for="option in filterOptions" :key="option" :value="option">
            {{ $t(`display.${option}`) }}
          </option>
        </b-select>
      </b-field>
      <b-field :label="$t('display.option')">
        <b-select v-model="subFilterOption">
          <option
            v-for="option in subFilterOptions"
            :key="option"
            :value="option"
          >
            <div v-if="filterOption === 'typeOfPT'">
              {{ $t(`typeOfPT.${option}`) }}
            </div>
            <div v-else>
              {{ option }}
            </div>
          </option>
        </b-select>
      </b-field>
      <RecordsTable :data="filteredData" :on-edit-bt-click="onEditBtClick" />
    </div>

    <Calendar
      v-else
      id="record-calendar"
      :data="data"
      :modal-redirect="modalRedirect"
      :on-edit-bt-click="onEditBtClick"
      data-v-step="2"
    />
    <!-- <button id="tour-bt" @click="goTour">?</button> -->
    <div id="func-bt" data-v-step="1" @click="onPlusClick">
      <PlusSVG />
    </div>
    <Tour :go-tour="goTour" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { createRecord } from '../../../config/routes'

export default {
  name: 'SubmissionRecords',
  layout: 'center',

  components: {
    Calendar: () => import('../../../components/calendar'),
    RecordsTable: () => import('../../../components/recordsTable'),
    PlusSVG: () => import('../../../assets/svg/plus.svg?inline'),
    Tour: () => import('../../../components/tour'),
  },

  data() {
    return {
      modalRedirect: createRecord.route,
      view: 'calendar',
      viewOptions: ['calendar', 'table'],

      // val = key in data obj
      filterOptions: ['typeOfPT', 'month', 'status'],
      filterOption: undefined,
      subFilterOption: undefined,
    }
  },
  computed: {
    ...mapState({
      data: (state) => state.records.data,
      goTour: (state) => state.user.goTour,
    }),
    subFilterOptions() {
      if (this.filterOption === 'typeOfPT')
        return this.$store.state['submit-record'].tabs

      const set = new Set()
      this.data.forEach((record) => {
        let option

        if (this.filterOption === 'month') option = record.date.getMonth() + 1
        if (this.filterOption === 'status')
          option = record.approved || record.status // old record use approved as key
        set.add(option)
      })

      return Array.from(set)
    },
    filteredData() {
      if (!this.filterOption || !this.subFilterOption) return this.data

      return this.data.filter((item) => {
        if (this.filterOption === 'typeOfPT') {
          return item.typeOfPT === this.subFilterOption
        }
        if (this.filterOption === 'month') {
          return item.date.getMonth() + 1 === this.subFilterOption
        }
        if (this.filterOption === 'status') {
          return (
            item.status === this.subFilterOption ||
            item.approved === this.subFilterOption
          )
        }
      })
    },
  },
  mounted() {
    this.$store.dispatch('records/getRecords')
    this.$store.dispatch('submit-record/getTabs')
  },
  methods: {
    onPlusClick() {
      this.$router.push(createRecord.route)
    },
    onEditBtClick(id) {
      return this.$router.push({
        path: `${createRecord.route}?id=${id}`,
      })
    },
    // goTour() {
    //   this.$tours.myTour.start()
    // },
  },
}
</script>

<style scoped lang="scss">
#logo {
  width: 100%;
  height: 70px;
  background: center/ contain no-repeat url('~assets/SARDA_logo_B.png');
}

#tour-bt {
  position: fixed;
  right: -99px;
  bottom: min(160px, 42vw);
  border: #ffbc57 2px solid;
  background: none;
  outline: none;
  padding: 5px 10px;
  border-radius: 20px;
  width: 170px;
  color: #ffbc57;
  font-weight: 800;
  text-align: left;
  font-size: 1.2rem;
}

.header h1 {
  text-align: center;
  font-weight: 800;
  font-size: 1.2rem;
  margin: 15px;
}

.select-field {
  display: flex;
  align-items: center;
  grid-gap: min(2vw, 20px);

  label {
    margin-left: auto;
  }
}

#func-bt {
  border-width: 4px;
  position: fixed;
  right: $shortcutBtRight;
  bottom: $shortcutBtBottom;
  width: min(13vw, 55px);
  height: min(13vw, 55px);
  border-radius: 50%;
  -webkit-box-shadow: 0px 0px 20px 0px rgba(179, 179, 179, 0.5);
  -moz-box-shadow: 0px 0px 20px 0px rgba(179, 179, 179, 0.5);
  box-shadow: 0px 0px 20px 0px rgba(179, 179, 179, 0.5);
  display: flex;
  justify-content: center;
  background: $primary;

  &.inverted {
    background: #ffffff;
  }

  svg {
    width: 70%;
    height: 100%;
  }
}
</style>
