<template>
  <b-table
    :data="processedData"
    striped
    hoverable
    paginated
    :per-page="10"
    :current-page="1"
  >
    <b-table-column v-slot="props" field="dates" :label="$t('display.date')">
      {{ props.row.date }}
    </b-table-column>
    <b-table-column v-slot="props" field="pt" :label="$t('display.typeOfPT')">
      {{ $t(`typeOfPT.${props.row.typeOfPT}`) }}
    </b-table-column>
    <b-table-column v-slot="props" field="from" :label="$t('display.route')">
      {{ props.row.routeName }}
    </b-table-column>
    <b-table-column v-slot="props" field="fare" :label="$t('display.fare')">
      {{ props.row.fare }}
    </b-table-column>
    <b-table-column
      v-slot="props"
      field="approved"
      :label="$t('display.status')"
    >
      <b-icon
        v-if="props.row.approved === true"
        icon="check-circle"
        size="is-small"
        type="is-success"
      >
      </b-icon>
      <b-icon
        v-else-if="props.row.approved === false"
        icon="close-circle"
        size="is-small"
        type="is-danger"
      >
      </b-icon>
      <b-icon v-else icon="account-clock" size="is-small" type="is-primary">
      </b-icon>
    </b-table-column>
    <b-table-column v-slot="props" cell-class="record_table_func_bts">
      <b-button
        icon-left="pencil-outline"
        class="func-bt"
        @click="onEditBtClick(props.row.id)"
      ></b-button>
      <b-button
        icon-left="delete"
        class="func-bt"
        @click="onDeleteButtonClick(props.row.id)"
      ></b-button>
    </b-table-column>
  </b-table>
</template>
<script>
import { generateRouteNames } from '../utils/utils'

export default {
  name: 'RecordsTable',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    onEditBtClick: {
      type: Function,
      default: () => {},
    },
    onDeleteButtonClick: {
      type: Function,
      default: () => {},
    },
  },
  mounted() {
    console.log(this.data)
  },
  computed: {
    processedData() {
      const to = this.$t('to')
      const data = this.data.map((item) => {
        const date = new Date(item.date)
        const routeName = generateRouteNames(this.$store, item, to)
        return { ...item, date: date.toDateString().substring(4), routeName } // take away days
      })
      return data
    },
  },
}
</script>
<style lang="scss">
.record_table_func_bts {
  justify-content: flex-end !important;
  .func-bt {
    outline: none;
    border: none;
    background: inherit;
  }
}
</style>
