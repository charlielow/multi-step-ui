import { spinTheBottle } from '../js/src/import/util/forks';

const maxStepsPerBranch = 3;
const maxBranchesPerFork = 3;
const maxForks = 3;

let forksCount = 0;

/**
 * Some logic for dynamically creating a
 * tree with generic steps and forks based on the
 * congiguration settings above
 */

const createBranch = function() {
  let ret = []
  let howManySteps = Math.ceil(Math.random() * maxStepsPerBranch)
  for (var i = 1; i <= howManySteps; i++) {
    ret.push(Object.assign({}, aStep));
  }
  if (forksCount <= maxForks) {
    let fork = Object.assign({}, aFork);
    fork.getNextBranch = spinTheBottle.getNextBranch;
    ret.push(fork);
    fork.branches = {};
    forksCount++;
    let howManyBranches = Math.ceil(Math.random() * maxBranchesPerFork)
    if (howManyBranches < 2) {
      howManyBranches = 2;
    }
    for (var i = 1; i <= howManyBranches; i++) {
      fork.branches['branch' + i] = createBranch();
    }
  }
  return ret;
};

let aStep = {
  type: 'step',
  id: 'step'
}

let aFork = {
  type: 'fork',
  id: 'fork'
}

let config = createBranch();

export {
  config
}