Messagist
=========
**Configurable conversation flow for great user engagement**


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
