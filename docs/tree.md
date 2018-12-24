---
id: tree
title: Tree
sidebar_label: Tree
---

Your Tree is the central hub for your multi-step flow

An instance of Tree is returned from the [multiStepUi()](multi-step-ui.md) factory function and has the following public methods

## stepForward()

Navigate forward by one [Step](step.md)

Returns String next step `uniqueId`

## stepBack()

Navigate forward by one [Step](step.md)

Returns String last histroy item

## fastForward()

Navigate forward until you can't anymore

Param optional String `toStepId` Step ID to stop on, if omitted keep going as far as possible

> Note, `toStepId` should be step.id NOT step.uniqueId

## rewind()

Param optional String `toStepId` Step ID to stop on, if omitted go to first step

> Note, `toStepId` should be step.id NOT step.uniqueId

## getStepByUniqueId()

Param String `uniqueId` of step to get

Returns Object first [Step](step.md) with matching `uniqueId`

## getNextStepUniqueId()

Param required String `currentStepUniqueId`, uniqueId of the current [Step](step.md)

Returns String `nextStepUniqueId`, uniqueId of the next [Step](step.md) or `''` if there is no next [Step](step.md)

## getTreeState()

Returns `this._treeState`

## resetTreeState()

Resets `this._treeState`, clears `history` and sets `currentStepUniqueId` to the first [Step](step.md)