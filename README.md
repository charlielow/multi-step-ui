# Multi-Step UI

___WARNING__  this project is currently in pre-release beta, under development and subject to change_

[![Build Status](https://travis-ci.com/charlielow/multi-step-ui.svg?branch=master)](https://travis-ci.com/charlielow/multi-step-ui) [![npm](https://img.shields.io/npm/v/multi-step-ui.svg)](https://github.com/charlielow/multi-step-ui)

### What it is

A lightweight framework for __managing a multi-step user flow__ providing step mapping and navigation through nested branches and a simple, extensible interface for Steps and Forks

* __Enrollment, onboarding or sign-up flow__
* Help / FAQ triage flow
* Troubleshooting guide
* Choose Your Own Adventure

__Example pages__

[https://charlielow.github.io/multi-step-ui/docs](https://charlielow.github.io/multi-step-ui/docs)

### What it's not

It's not a view library, you can integrate with React, Handlebars or any other templating engine or view library

## Install

__npm__

```sh
$ npm i multi-step-ui
```

__yarn__

```sj
$ yarn add multi-step-ui
```

## How it works

A simple example without much functionality

```javascript
// Import multiStepUi

import { multiStepUi } from 'multi-step-ui';

// Configure your flow using JSON

const config = [
  {
    "id": "stepOne"
  },
  {
    "id": "stepTwo"
  },
  {
    "type": "fork",
    "id": "forkOne",
    "branches": {
      "branchA": [
        {
          "id": "congratsBranchA"
        }
      ],
      "branchB": [
        {
          "id": "congratsSranchB"
        }
      ]
    }
  }
];

// Create your flow

let flow = multiStepUi({
  config,

  // Map your Steps to step controllers by step.id (details later)

  steps: {},

  // Map your Forks to fork controllers by fork.id

  forks: {
    forkOne: {
      
      // Forks manage branching logic, for now just choose a branch at random

      getNextBranch: function() {
        let keys = Object.keys(this.branches);
        let len = keys.length;
        return keys[Math.floor(Math.random() * len)];
      }
    }
  },

  // Define a Tree render method

  render: function () {
    document.getElementById('debug-tree-state').innerHTML = JSON.stringify(this._treeState, null, 2);
  }
});
```

## API documentation (in-progress)

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

