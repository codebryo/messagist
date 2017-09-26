<template>
  <div class="Messagist">
    <transition-group name="messagist__list" tag="ul">
      <message
        v-for="message in messagesToPrint"
        :key="message.id"
        :message="message"
        class="messagist__list-item"
      />
    </transition-group>

    <div
      v-show="choicesVisible"
      class="messagist__choices"
    >
      <choice
        v-for="(value, key) in current.choices"
        :key="key"
        :primaryKey="key"
        :choice="value"
        @selected="selected"
        class="messagist__choices-list-item"
      />
    </div>
  </div>
</template>

<script>
import uuidv4 from 'uuid/v4'
import Message from './Message.vue'
import Choice from './Choice.vue'

class MessageObject {
  constructor(text, author="system") {
    this.text = text
    this.author = author
    this.id = uuidv4()
  }
}

export default {
  name: 'Messagist',

  props: {
    messages: Object
  },

  components: {
    message: Message,
    choice: Choice
  },

  data() {
    return {
      messagesToPrint: [],
      interval: {
        user: 800,
        system: 400
      },
      printing: true,
      currentKey: 'init',
      loading: false,
      awaitingUserInput: false
    }
  },

  computed: {
    current() {
      if(!this.messages[this.currentKey]) {
        console.warn('[Messagist Warn]', `Key "${this.currentKey}" is not defined in your message definitions`)
        return {
          messages: [],
          choices: []
        }
      }

      let contents = this.messages[this.currentKey].content
      if (typeof contents == 'string') contents = [contents]

      return {
        messages: contents,
        choices: this.messages[this.currentKey].choices,
        action: this.messages[this.currentKey].action
      }
    },

    choicesVisible() {
      return (!this.printing && !this.loading && !this.awaitingUserInput)
    }
  },

  methods: {
    trigger(key) {
      this.awaitingUserInput = true
      this.$emit(key, (options) => { this.continue(options) })
    },

    continue(options) {
      // TODD: Extend options, currently it supports a string only
      this.selected({ key: this.primaryKey, custom: options })
    },

    delayPrint() {
      setTimeout(() => {
        this.loading = false
        this.printLoop()
      }, this.interval.user)
    },

    tryCallback() {
      if(typeof this.current.action != 'function') return
      const cb = this.current.action.bind(this)
      return cb()
    },

    printLoop() {
      this.printing = true
      let messages = Array.from(this.current.messages)

      const loop = () => {
        if(messages.length == 0) {
          this.tryCallback()
          return this.printing =false
        }
        setTimeout(
          () => print(messages.shift())
          , this.interval.system
        )
      }

      const print = (m) => {
        this.messagesToPrint.push(new MessageObject(m))
        this.$nextTick(loop)
      }

       print(messages.shift())
    },

    selected({ key, custom }) {
      const message = custom ? custom : this.current.choices[key]
      this.messagesToPrint.push(new MessageObject( message ,'user'))

      this.currentKey = key
      this.loading = true
      this.awaitingUserInput = false

      this.delayPrint()
    },

  },

  mounted() {
    this.printLoop()
  }
}
</script>


<style lang="stylus">
.Messagist
  max-width 640px
  margin 0 auto

  ul
    padding 20px 50px

.messagist__list-item
  transition all 500ms

.messagist__list-item-loading
  text-align left
  margin-left 40p

.messagist__list-enter
  opacity 0
  transform translateY(30px)

.messagist__choices-item
  transition all 1s

.messagist__choice-list-enter,
.messagist__choice-list-leave-to
  opacity 0
  transform translateY(30px)
</style>

