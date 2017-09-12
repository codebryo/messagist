<template lang="html">
  <li :class="message.author">
    <span v-html="message.text" />
  </li>
</template>


<script>
export default {
  name: 'Message',

  props: {
    message: Object
  }
}
</script>

<style lang="stylus">
color-system = aliceblue
color-user = #b3e6a6

transparent-body()
  content ''
  display block
  position absolute
  border 8px solid transparent

.message-list-item
  list-style none
  margin-bottom 5px

  span
    padding 10px
    display inline-block
    background color-system
    position relative
    border-radius .5rem
    max-width 80%

  &.system
    text-align left

    span::before
      transparent-body()
      border-right-color color-system
      left -16px
      bottom 8px

    + .user
      margin-top 10px


  &.user
    text-align right

    span
      background color-user

      &::after
        transparent-body()
        border-left-color color-user
        right -16px
        bottom 8px

      + .system
        margin-top 10px
</style>

