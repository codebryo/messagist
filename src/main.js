import MessagistWrapper from './MessagistWrapper.vue'

export default {
  install(Vue, options) {
    Vue.component('messagist', MessagistWrapper)
  }
}
