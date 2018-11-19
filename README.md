# Multi-Step UI

___WARNING__  this project is currently in pre-release beta, under development and subject to change_

### What it is

A lightweight framework for managing a multi-step user flow, for example...

* __Enrollment or sign-up flow__ - _ask questions, collect user input_
* Help / FAQ triage flow - _virtual call center "how may I direct your call?"_
* Troubleshooting guide - _won't turn on? is it plugged in?_
* Choose Your Own Adventure - _stay and fight or run away?_

Providing step mapping and navigation through nested branches, and a simple yet extensible interface for Steps and Forks

__Example pages__

[https://charlielow.github.io/multi-step-ui/docs](https://charlielow.github.io/multi-step-ui/docs)

### What it's not

It's not a view library, you can integrate with React, Handlebars or any other templating engine or view library

## Install

__npm__

```
$ npm i multi-step-ui
```

__yarn__

```
$ yarn add multi-step-ui
```

### How it works

Configure your flow using JSON

```
[
  {
    "type": "step",
    "id": "stepOne"
  },
  {
    "type": "step",
    "id": "stepTwo"
  },
  {
    "type": "fork",
    "id": "forkOne",
    "branches": {
      "branchA": [
        {
          "type": "step",
          "id": "congratsBranchA"
        }
      ],
      "branchB": [
        {
          "type": "step",
          "id": "congratsSranchB"
        }
      ]
    }
  }

]

```

Define a Tree render method

Map your Steps to step controllers

Map your Forks to fork controllers

Create your flow

```
import { multiStepUi } from 'multi-step-ui';

let flow = multiStepUi({
  config,
  steps,
  forks,
  render: function () {
    document.getElementById('debug-tree-state').innerHTML = JSON.stringify(this._treeState, null, 2);
  }
});
```

...




__Tree__

`config`

`steps`

`forks`

`render()`

Define a render method for the entire Tree [, which internally calls `renderStep()` for the current step, optionally using whatever view library you want]

__Step__

`id`

`renderStep()` (get props from tree)

`isValid()`

__Fork__

`id`

`branches`

`getNextBranch()`

## Notes

ID + Node index = `uniqueId`
Tree state tracks `uniqueId` and `history`
Node `getNextNode()` (even leaves) - actually tree needs to do this
Back = history back
Forward always gets next node
Prepop + validate, usually


Tree is static
    shape of the tree doesn't change
Multi-step config seeds multi-step state
