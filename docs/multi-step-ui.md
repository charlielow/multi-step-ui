---
id: multi-step-ui
title: multiStepUi(props)
sidebar_label: multiStepUi()
---


```
import { multiStepUi } from 'multi-step-ui';
```

`multiStepUi()` is a factory function which expects a `props` object

`props` has 2 required properties, [config](#config) and [render()](#render) everything else below is optional

```
const instanceOfTree = multiStepUi({
  config: {
    // ...
  },

  render: function () {

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

## deepLinkStepId

## deepLinkStepUniqueId

## plugins

## onStep()

## onComplete()


