# Multi-Step UI

___WARNING__  this project is currently in pre-release beta, under development and subject to change_

Manage simple or complex, multi-step user flows

* Support for nested branching
* Integrate with any view library such as React, or without
* Small footprint

## Docs

__Example pages__

[https://charlielow.github.io/multi-step-ui/docs](https://charlielow.github.io/multi-step-ui/docs)

## Install

...
    
__Tree (multi-step-ui)__

`config`

`steps`

`forks`

`render()`

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
