Messagist
=========
**Configurable conversation flow for great user engagement**

![Messagist in action](assets/messagist.gif)

## Getting Started


### Using Messagist

It's quite simple. As a usual plugin just let Vue know about it's existance:

```js
import Messagist from 'vue-messagist'

Vue.use(Messagist)
```

This makes a `messagist` component available, which has one mandatory `messages` property.
That brings us to the important part of messagist. It's fully customizeable based on the passed in object. So let's check out an example configuration.

### Structure of a Messages Objects

```js
// Basic Structure

{
  key: {
    content: [
      'Message a',
      'Message b'
    ],
    choices: {
      new_key: 'Answer selects new_key'
    }
  }
}
```

That should be quite simple to follow I hope.
Let's break this down a little.

- `key` -- The main key identifieng the messages to be printed and the possible choices
- `content` -- Those are the messages that will be printed automatically once this key is active. You can pass in a simple string if there is only one message to print.
- `choices` -- The choices allow moving the conversation forward to the next pieces of content. Each choices key value will be the main identifier.

Too answer your next question upfront, how to tell Messagist about your entry point. Just call the initial part `init`.

```js
{
  init: {
    content: [
      'Hello',
      'I am Messagist, and will be your new best friend!'
    ],
    choices: {
      accept: 'Okay Messagist, I accept that ♥️'
    }
  },
  accept: {
    content: '🎉🎉🎉 That makes me happy'
  }
}
```

### Putting it together

Okay, so lets put that piece of code to good use.
Let's create the markup first:

```html
<div id="app">
  <messagist :messages="messages"></div>
</div>
```

and the JS on the page could look like this.

```js
import Messagist from 'vue-messagist'

Vue.use(Messagist)

const messages = {...} // the message example from above

new Vue({
  el: '#app',

  data: {
    messages
  }
})
```

### Communicate to the outside

Sometimes a basic message flow is not enough. It may be relevant to trigger some user input or whatever you come up with. The important part is, that you may want to break out of the flow of the messages and continue at a custom point in time.

So Messagist allows you to hook into custom events and trigger events when needed.
That sounds pretty cool and I think it also is a cool feature :)
So lets check out how this is done.

The important piece here is the `action` key.
It can be put into an choice response like this:

```js
{
  init: {
    content: 'Please share me your favorite cat picture.',
    choices: {
      cat: {
        text: 'Whats your favorite cat',
        action() { this.trigger('favorite-cat') }
      }
    }
  },
  cat: {
    content: 'Thank you'
  }
}
```

So far so good. Inside the `action` method we call `this.trigger`. The `trigger` method is a little secret method Messagist provides to send out an event, but also pass over a callback function that allows to continue the flow of Messagist at any point.

I know that sounds quite complicated, but let's start with a easy example to take the mystery out of this function.

```html
<div id="app">
  <messagist
    :messages="messages"
    @favorite-cat="customCat"
  ></div>
</div>
```

```js
new Vue({
  el: '#app',

  data: {
    messages: {...} // The example from above
  },

  methods: {
    customCat(done) {
      done('I like brown cats.')
    }
  }
})
```

Okay, so what's going on. On the `messagist` element we can then listen for the `favorite-cat` event whenever it gets triggered and we pass in a local method in classic Vue mannor. Under the hood it's just a `$emit` event we listen for so that should make things clearer.
The important piece is then the `customCat` method we reference. A continue function gets passed in as first parameter. That continue function will then take a string, that will be printed as response, and Messagsit will continue in the flow like before.
In our code example it would then try to continue with the `cat` key and print 'Thank you' on the screen.

You could also pass in an action directly to a Messagist section. That's helpful if you do not want to continue afterwards or do not want to trigger an action to a choice.

```js
{
  init: {
    content: 'I will trigger one action after this message.',
    action() { this.trigger('finished') }
  }
}
```

```html
<messagist
  :messages="messages"
  @finished="finished"
></div>
```

### Complex continue

If a direct usage of the passed in `done` function isn't cutting it (what's very likely), just try to store that callback function and use it when ready.

I prepared a example in the `examples` folder. [Check it out](/examples/breaking.html)

The gist of it is to store the `done` function in your app and call it when ready.

```js
new Vue({
  el: '#app',

  data: {
    messages,
    continue: null,
    showMyCustomComponent: false
  },

  methods: {
    first(done) {
      // this function gets called by a Messagist event
      this.continue = done
      this.showMyComponent = true
    },

    second() {
      // This callback gets called from the custom local component
      this.continue('I am all done now!')
    }
  }
})
```

## TBU

There are a lot of things I think about adding to Messagist,
but it's a fun tool to work with already, so I though about sharing it right away.

Some examples:
- Options for custom styling (colors etc)
- Options for delays
- Avatars
- ...

Please let me know about ideas you have for this project by leaving an issue on th repo, or reach out to me on [Twitter](https://twitter.com/codebryo)

