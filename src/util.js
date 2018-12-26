const util = {

  /**
   * Run some code on each step in the tree
   * @param {Array} config Tree.config
   * @param {Function} callback recieves current Step,
   * count (not index in branch, but count) and current Branch
   * @return {undefined}
   */
  mapEachStep(config, callback) {
    if (!config || !callback) {
      throw new Error('Missing required parameter');
    }
    let count = 0;
    const _mapEachStep = (branch) => {
      branch.forEach((n) => {
        if (n.type === 'step') {
          callback(n, count, branch);
          count += 1;
        } else if (n.type === 'fork') {
          Object.entries(n.branches).forEach(([key, val]) => {
            _mapEachStep(val);
          });
        }
      });
    };
    _mapEachStep(config);
    return config;
  },

  /**
   * Return index of step in branch
   * replacement for _.indexOf()
   * @param {Array} branch
   * @param {Object} n Step
   * @return {Number}
   */
  indexOfStepInBranch(branch, step) {
    let ret = 0;
    try {
      branch.forEach((n, i) => {
        ret = i;
        if (n.uniqueId === step.uniqueId) {
          throw new Error('break');
        }
      });
    } catch (err) {
      if (err.message !== 'break') {
        throw err;
      }
    }
    return ret;
  }
};

export default util;
