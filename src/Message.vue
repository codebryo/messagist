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

</style>

