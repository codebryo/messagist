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
      messagesToPrint: [
        new MessageObject('Hello'),
        new MessageObject('I am Messagist')
      ],
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
      return {
        messages: this.messages[this.currentKey].content,
        choices: this.messages[this.currentKey].choices
      }
    },

    choicesVisible() {
      return (!this.printing && !this.loading && !this.awaitingUserInput)
    }
  },

  methods: {
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

  },

  mounted() {
    this.printLoop()
  }
}
</script>


<style lang="stylus">

</style>

