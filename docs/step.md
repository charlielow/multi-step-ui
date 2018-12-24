---
id: step
title: Step
sidebar_label: Step
---

A Step is an individual stop in your multi-step flow, steps can be reused

It's a custom object with the following required methods

> Note, How you create steps is up to you, see the [Examples](simple-flow-with-react.md) or [some source files](https://github.com/charlielow/multi-step-ui/blob/master/website/static/js/src/import/simple-flow-react/steps.js) for tips

## renderStep(props)

Param Object `props` with a reference to your [Tree](tree.md) via `props.tree`

`renderStep()` should return your rendered Step for use by Tree [render()](multi-step-ui.md#render) 

## isValid(props)

Param Object `props` with a reference to your [Tree](tree.md) via `props.tree`

Is used to validate the step, steps must be valid before the [Tree](tree.md) can `stepForward()`

Return `true` if valid

Return `false`, and handle validation errors, if invalid

