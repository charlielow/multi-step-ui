---
id: fork
title: Fork
sidebar_label: Fork
---

A fork is a point in your multi-step flow where branching is required 

Forks contain logic used to decide which branch to take

It's a custom object with the following required method

> Note, How you create steps is up to you, see the [Examples](simple-flow-with-react.md) or [some source files](https://github.com/charlielow/multi-step-ui/blob/master/website/static/js/src/import/simple-flow-react/forks.js) for tips

## getNextBranch(props)

Param Object `props` with a reference to your [Tree](tree.md) via `props.tree`

Returns the named branch as set in your [config](multi-step-ui.md#config)

