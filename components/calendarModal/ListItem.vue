<template>
  <div ref="container">
    <div class="data">
      <DoneSVG v-if="item.customData.approved === true" class="status" />
      <CloseSVG v-else-if="item.customData.approved === false" class="status" />
      <PendingSVG v-else class="status" />
      <div class="unselectable">{{ item.title }}</div>
      <div class="fare unselectable">{{ item.customData.fare }}</div>
      <b-dropdown
        id="dropdown-menu"
        ref="editMenu"
        aria-role="list"
        :mobile-modal="false"
        class="dropdown-container"
        @active-change="scrollToEditMenu()"
      >
        <MenuSVG slot="trigger" class="menu" />
        <b-dropdown-item aria-role="listitem" @click="editRecord()">{{
          $t('editMenu.edit')
        }}</b-dropdown-item>
        <b-dropdown-item ref="last-item" aria-role="listitem">{{
          $t('editMenu.delete')
        }}</b-dropdown-item>
      </b-dropdown>
    </div>
    <hr />
  </div>
</template>

<script>
import MenuSVG from '../../assets/svg/menu.svg?inline'
import DoneSVG from '../../assets/svg/done.svg?inline'
import PendingSVG from '../../assets/svg/pending.svg?inline'
import CloseSVG from '../../assets/svg/close.svg?inline'

export default {
  name: 'ListItem',
  components: { DoneSVG, PendingSVG, CloseSVG, MenuSVG },
  props: {
    item: Object,
    closeModal: Function,
    containerRef: null,
    scrollToEditMenu: Function,
    onEditBtClick: Function,
  },
  data() {
    return {
      isShowToolbar: false,
      dropdownRef: '',
    }
  },

  methods: {
    toggleToolbar() {
      this.isShowToolbar = !this.isShowToolbar
    },
    editRecord() {
      this.closeModal()
      this.onEditBtClick(this.item.customData.id)
    },
  },
}
</script>
<style lang="scss" scoped>
.editTools {
  display: flex;
  background: #cccccc63;
  border-top: 1px solid #00000040;
  margin-top: 5px;
  padding: 2px 10px;

  & > div:nth-child(1) {
    margin-right: 10px;
  }
}

.data {
  display: flex;
  flex-direction: row;
  align-items: center;
  grid-gap: 3vw;
  font-size: 1rem;

  svg {
    fill: $primary;
  }

  svg.status {
    min-width: 28px;
  }

  svg.menu {
    min-width: 28px;
    margin-bottom: 5px;
  }
}

.fare {
  margin-left: auto;
}
hr {
  margin: 0 0 1rem 0;
}

.unselectable {
  user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -o-user-select: none;
}
</style>
<style>
.dropdown-menu {
  left: unset;
  right: 0;
}
</style>
