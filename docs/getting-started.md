---
id: getting-started
title: Multi-Step UI
sidebar_label: Getting Started
---

___WARNING__  this project is currently in pre-release beta, under development and subject to change_

[![Build Status](https://travis-ci.com/charlielow/multi-step-ui.svg?branch=master)](https://travis-ci.com/charlielow/multi-step-ui) [![npm](https://img.shields.io/npm/v/multi-step-ui.svg)](https://github.com/charlielow/multi-step-ui)

A lightweight framework for __managing multi-step user flows__ 

Provides step mapping and navigation through nested branches and a simple, extensible interface for steps and forks

* __Enrollment, onboarding or sign-up flows__
* Help / FAQ triage flows
* Troubleshooting guides


> Multi-Step UI is __not__ a view library, integrate with React or any other templating engine or view library

## Install


```sh
$ npm i multi-step-ui
```

or

```sj
$ yarn add multi-step-ui
```

## How it works

> Note: this example illustrates basic usage but does not implement views for each step, check out [the examples](https://charlielow.github.io/multi-step-ui/docs/simple-flow-with-react) for more details

Import multiStepUi

```
import { multiStepUi } from 'multi-step-ui';
```

Configure your flow, ideally in an external JSON file

[Config](multi-step-ui.md#config) is just a list of steps and forks, forks contain branches which in turn contain more steps, steps and forks are mapped by id to controlers

```
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
```

Create your flow, `multiStepUi` is a factory function expecting a props object, see [multiStepUi()](multi-step-ui.md)

```
const flow = multiStepUi({
  config,

  // Map your Steps to step controllers by step.id (details later)

  steps: {},

  // Map your Forks to fork controllers by fork.id

  forks: {
    forkOne: {

      // Forks manage branching logic, for now just choose a branch at random

      getNextBranch: function () {
        const keys = Object.keys(this.branches);
        const len = keys.length;
        return keys[Math.floor(Math.random() * len)];
      }
    }
  },

  // Define a Tree render method

  render: function () {
    document.getElementById('debug-tree-state')
      .innerHTML = JSON.stringify(this._treeState, null, 2);
  }
});
```

Now check out the [API Refernce](multi-step-ui.md) and [Examples](https://charlielow.github.io/multi-step-ui/docs/simple-flow-with-react) for more details

