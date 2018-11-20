// TODO: modularize, unit test
const util = {

  /**
   * Run some code on each step in the tree
   * @param  {Array}   config   Tree.config
   * @param  {Function} callback recieves current Step and current Branch
   * @return {undefined}
   */
  mapEachStep: function(config, callback) {
    const _mapEachStep = function (branch) {
      branch.forEach(function(n) {
        if (n.type === 'step') {
          callback(n, branch);
        } else if (n.type === 'fork') {
          Object.entries(n.branches).forEach(function ([key, val]) {
            _mapEachStep(val);
          });
        }
      })
    }
    _mapEachStep(config);
  },

  /**
   * Return index of n in branch
   * @param  {Array} branch
   * @param  {Object} n Step
   * @return {Number}
   */
  indexOfStepInBranch: function(branch, step) {
    var ret = 0;
    try {
      branch.forEach(function(n, i) {
        ret = i;
        if (n.uniqueId === step.uniqueId) {
          throw 'break';
        }
      });
    } catch (err) {
      if (err !== 'break') {
        throw err;
      }
    }
    return ret;

  }
};

export {
  util
}