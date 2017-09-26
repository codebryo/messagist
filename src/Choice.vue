<template lang="html">
  <a
    class="messagist__choices-list-item"
    :href="primaryKey"
    @click.prevent="selected"
  >
    {{ text }}
  </a>
</template>

<script>
export default {
  name: 'Choice',

  props: {
    primaryKey: String,
    choice: [Object, String]
  },

  computed: {
    isObject() {
      return typeof this.choice === 'object'
    },

    text() {
      return (this.isObject ? this.choice.text : this.choice)
    }
  },

  methods: {
    trigger(key) {
      this.$parent.awaitingUserInput = true
      this.$parent.$emit(key, (options) => { this.continue(options) })
    },

    continue(options) {
      // TODD: Extend options, currently it supports a string only
      this.$emit('selected', { key: this.primaryKey, custom: options })
    },

    selected() {
      if(this.isObject && this.choice.action) {

        const cb = this.choice.action.bind(this)
        return cb()
      }
      this.$emit('selected', { key: this.primaryKey })
    }
  }
}
</script>

<style lang="stylus">
  .messagist__choices-list-item
    margin-right 40px
    display block
    text-align right
    color #b3e6a6
</style>
