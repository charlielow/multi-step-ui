# multi-step-ui

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
Compare layout + ID to determine matches
Store state, local storage
    flow state
    data state


prefix everything with `msu`? or namespace?

## To Do

## Design

### Tree

Class

Props
    Store
    App
    Etc.

### Node

Class

ID
Dependencies
    Template
    CSS
    View logic
Prior step dependencies?
getNextNode()

### Step

`renderStep()` (get props from tree)

`isValid()`

Defaults from Node class

Compose step properties?

### Fork

Branches {} named
getNextBranch

### Branch

### Leaf
