<template>
  <div scroll="keep">
    <div ref="container" class="card">
      <div class="date">{{ date }}</div>
      <hr />
      <ul ref="listContainer">
        <li v-for="(item, i) in processedData" :key="item.key">
          <ListItem
            :container-ref="$refs.container"
            :item="item"
            :close-modal="closeModal"
            :scroll-to-edit-menu="scrollToEditMenu(i)"
            :on-edit-bt-click="onEditBtClick"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { generateRouteNames } from '../../utils/utils'
import ListItem from './ListItem.vue'

export default {
  names: 'CalendarModal',
  components: {
    ListItem,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    redirectLink: {
      type: String,
      default: () => '/',
    },
    onEditBtClick: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    date() {
      if (
        this.data[0] &&
        Object.keys(this.data[0]).length >= 1 &&
        this.data[0].constructor === Object
      ) {
        const d = new Date(this.data[0].dates[0].date)
        return d.toLocaleDateString('en-GB')
      }
      return ''
    },
    lang() {
      return this.$store.state.user.lang
    },
    processedData() {
      // const { stops, routes } = this.$store.state.db.PTData
      return this.data.map((item) => {
        const to = this.$t('to')

        return {
          ...item,
          title: generateRouteNames(this.$store, item.customData, to),
        }
      })
    },
  },
  methods: {
    closeModal() {
      this.$parent.close()
    },
    scrollToEditMenu(i) {
      // returned function not getting this context
      // need to store the context in this function first
      const length = this.processedData.length
      const refs = this.$refs
      return function () {
        if (i !== length - 1) return
        this.$nextTick(() => {
          const el = refs.listContainer
          el.scrollTo({ top: el.clientHeight, behavior: 'smooth' })
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
.card {
  width: 90%;
  margin: 50vh auto;
  transform: translateY(-50%);
  padding: 5px 0 0 10px;
  max-height: 70vh;
  overflow: hidden;
  ul {
    list-style: none;
    overflow: scroll;
    max-height: 52vh; // minus other element in the card element
  }
}

.date {
  text-align: center;
  font-size: 1.5rem;
}

button {
  outline: none;
  background: none;
  border: none;
  margin-right: 0;
  margin-left: auto;
  display: flex;
}

.add-icon {
  background: $primary;
  border-radius: 20px;
}

@media screen and (min-width: 1024px) {
  .card {
    width: 35%;
  }
}
</style>
