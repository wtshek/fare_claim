<template>
  <div :class="{ show, 'not-show': !show, container: true }">
    <div class="message">{{ message }}</div>
    <b-progress class="progress-bar" type="is-primary"></b-progress>
  </div>
</template>
<script>
export default {
  name: 'SyncNotificationBox',
  props: {
    message: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style lang="scss" scoped>
.container {
  position: fixed;
  right: 15px;
  z-index: 111;
  padding: 20px;
  background: #2b2727d9;
  border-radius: 5px;
  width: 60vw;
  transition: bottom 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) 0s,
    opacity 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) 0s,
    visibility 0s linear 0.5s;

  .message {
    background: unset;
    color: #ffffff;
  }

  .progress-bar {
    height: 3px;
  }

  &.show {
    bottom: 17px;
    transition: bottom 0.5s;
    visibility: visible;
    opacity: 1;
  }

  &.not-show {
    bottom: -100px;
    visibility: hidden;
    opacity: 0;
  }
}
</style>
