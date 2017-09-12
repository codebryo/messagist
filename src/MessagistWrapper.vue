<template>
  <div class="Messagist">
    <transition-group name="message-list" tag="ul">
      <message
        v-for="message in messagesToPrint"
        :key="message.id"
        :message="message"
        class="message-list-item"
      />
    </transition-group>

    <div
      v-show="choicesVisible"
      class="choice-list"
    >
      <choice
        v-for="(value, key) in current.choices"
        :key="key"
        :primaryKey="key"
        :choice="value"
        @selected="selected"
        class="choice-list-item"
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
        choices: this.messages[this.currentKey].choices
      }
    },

    choicesVisible() {
      return (!this.printing && !this.loading && !this.awaitingUserInput)
    }
  },

  methods: {
    delayPrint() {
      setTimeout(() => {
        this.loading = false
        this.printLoop()
      }, this.interval.user)
    },

    printLoop() {
      this.printing = true
      let messages = Array.from(this.current.messages)

      const loop = () => {
        if(messages.length == 0)
          return this.printing =false
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

.message-list-item
  transition all 500ms

.message-list-item-loading
  text-align left
  margin-left 40p

.message-list-enter
  opacity 0
  transform translateY(30px)

.choice-list-item
  transition all 1s

.choice-list-enter,
.choice-list-leave-to
  opacity 0
  transform translateY(30px)
</style>

