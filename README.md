# multi-step-ui

__WARNING__  this project is currently in pre-release beta, under development and subject to change

### Docs

__Example pages__

[https://charlielow.github.io/multi-step-ui/docs](https://charlielow.github.io/multi-step-ui/docs)

#### Tree (multi-step-ui)

`config`

`steps`

`forks`

`render()`

#### Step

`id`

`renderStep()` (get props from tree)

`isValid()`

#### Fork

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
