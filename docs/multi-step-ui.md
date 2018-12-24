---
id: multi-step-ui
title: multiStepUi(props)
sidebar_label: multiStepUi()
---


```
import { multiStepUi } from 'multi-step-ui';
```

`multiStepUi()` is a factory function which expects a `props` object and returns an instance of [Tree](tree.md)

`props` has 2 required properties, [config](#config) and [render()](#render)  

[steps](#steps) and [forks](#forks) are also required for functionality, but won't throw an error if missing

Everything else is optional

> Note, it's recommended you make your instance of [Tree](tree.md) the cental hub for everything in your app, in addition to the properties mentioned here you may also want to store application state on this object

```
const instanceOfTree = multiStepUi({
  
  // Required
  config: {
    // ...
  },
  render: function () {}
  
  // Mappings
  steps: {},
  forks: {},

  // Optional
  deepLinkStepId: '',
  deepLinkStepUniqueId: '',
  plugins: {},
  onStep(stepUniqueId) {},
  onComplete() {},

  // Optionally set custom props like this
  store: {
    name: ''
  }

});
```

`multiStepUi()` returns an instance of [Tree](tree.md)

> Note, the bare class `Tree` is also exported but using the factory function is recommended

## config

`config` is the static JSON mapping for your multi-step flow and can be described as

* An array of objects, each with a required `id` that we'll map to a [Step](step.md) or a [Fork](fork.md) object later
* The order of items represents the order of steps in the flow, _createAccount -> stepTwo_ below
* Forks also require `"type": "fork"` and a `branches` object with named branches
* Each of these branches is again a nested version of the top level `config` array
* Any other properties, such as `heading` below, will be set on the [Step](step.md) object


```
[
  {
    "id": "createAccount",
    "heading": "Create your account."
  },
  {
    "id": "stepTwo",
    "heading": "What would you like to do?"
  },
  {
    "type": "fork",
    "id": "forkOne",
    "branches": {
      "buyer": [
        {
          "id": "congratsBuyer"
        }
      ],
      "seller": [
        {
          "id": "congratsSeller"
        }
      ]
    }
  }

]
```


## render()

The `render()` method is always called after changing steps and is responsible for rendering your UI

> Note, `render()`, like other methods, is called in the context of your [Tree](tree.md)
> <br>so __don't use an arrow function__ which won't have `this`

This is your top-level render method which should also take care of rendering the current step by calling `renderStep()` on the current [Step](step.md)

You can render a React component [as in this example](https://github.com/charlielow/multi-step-ui/blob/master/website/static/js/src/import/complex-branching-flow/render.js)

```
const render = function () {
  ReactDOM.render(<Tree tree={this} />, document.getElementById('tree'));
  ReactDOM.render(<Debug tree={this} />, document.getElementById('debug'));
};
```

Or you could do something as simple as

```
const render = function () {
  document.getElementById('app').innerHTML = JSON.stringify(this._treeState, null, 2);
}
```

`render()` is only called on the last step while fast-forwarding or rewinding

## steps

`steps` is an object which maps step `id` (see [config](#config)) to an actual [Step](step.md), as in [this example](https://github.com/charlielow/multi-step-ui/blob/master/website/static/js/src/import/sign-up-flow-react/steps.js)

See [Step](step.md) documentation for more info

Example:

```
const steps = {
  createAccount: {
    renderStep: function(props) {
      let tree = props.tree;
      // ..
      return ''; // return a string or a React component to render
    },
    isValid: function(props) {
      let tree = props.tree;
      if (tree.store.email && tree.store.email.length) {
        return true;
      }
      return false;
    }
  }
};
```

## forks

`forks` is an object which maps fork `id` (see [config](#config)) to an actual [Fork](fork.md), as in [this example](https://github.com/charlielow/multi-step-ui/blob/master/website/static/js/src/import/simple-flow-react/forks.js)

See [Fork](fork.md) documentation for more info

Example:


```
const forks = {
  forkOne: {
    getNextBranch: function(props) {
      let tree = props.tree;
      return tree.store.memberType;
    }
  }
};
```


## deepLinkStepId

`deepLinkStepId` is a the string `id` for a [Step](step.md) which can be used to deep link to or seed an initial step

If provided, the [Tree](tree.md) will attempt to fast-forward to the first [Step](step.md) with this id, but will also stop if an invalid [Step](step.md) is encountered

## deepLinkStepUniqueId

`deepLinkStepUniqueId` is a the string `uniqueId` (auto-generated and different from `id`) for a [Step](step.md), used to deep link to or seed initial step, internally used to find `deepLinkStepId`

`deepLinkStepUniqueId` is mostly used to fastForward back to a step on page reload

## plugins

Use plugins to add additional functionality such as routing or logging

Plugins are objects which implement any or all of the following methods

`init()` 
`render()` 
`onStep()` 
`onComplete()` 

> Note, methods are called in the context of your [Tree](tree.md)
> <br>so __don't use an arrow function__ which won't have `this`


Example:

```
const plugins = {
  aPlugin: {
    init: function() {
      console.log(this); // > Tree
    }
  }
}
```

## onStep()

`onStep()` is passed the current [Step](step.md) `stepUniqueId` and called on step change, called when moving forward and back

Example:

```
const onStep = function (stepUniqueId) {
  console.log(stepUniqueId === this.getTreeState().currentStepUniqueId);
}
```


## onComplete()

Optionally provive an `onComplete()` handler which will be called when the final [Step](step.md) is validated
