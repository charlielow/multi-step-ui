import util from './util';

class Tree {
  constructor(props) {
    // Mix props into this
    Object.assign(this, {

      // //////////////////////////
      // Supported config props //
      // //////////////////////////

      /*
        Required
       */
      config: [],

      /**
       * Tree render method is required and provided at configuration
       * Tree render should render whatever layout plus the output of
       * calling render on the current step
       */
      render() {

      },

      /**
       * Optionally proved an onComplete handler at configuration
       * will be called when the final step (Leaf) is valid
       */
      onComplete() {

      },

    }, props);

    // Overwrite config, add unique ID etc.
    this._mapSteps(this.config);

    // Tree maintains simple state, data store maintained separately
    this._treeState = {
      currentStepUniqueId: this.config[0].uniqueId,
      history: []
    };

    this.render();
  }

  /**
   * Enhance config, make it functional
   * @param  {Object} config TODO: see documentation
   * @return {Object}        New config
   */
  _mapSteps(config) {
    // FIXME: originally did this in a way which didn't mutate config
    // but changed that to reduce dependencies

    // FIXME: how can I make this whole thing more pure?
    var count = 1;

    const mapEachStep = (function (branch) {

      let len = branch.length;

      branch.forEach(function(n, i) {
        if (n.type === 'step') {

          // Mix in imported step if available
          let step = {};
          try {
            step = this.steps[n.id];
          } catch (err) { /* do nothing */ }

          Object.assign(n, {
            uniqueId: n.id + count,

            // FIXME: temp placeholder
            renderStep: function () {

              return `${(this.leaf === true) ? 'LEAF!' : 'STEP' } <b>${this.id}</b>`;

            },

            // Default steps to having no validation rules
            isValid: function () {
              return true;
            }

          }, step);

          // If the current step is the last item in its branch
          // then it is a leaf
          if (i === len - 1) {
            n.isLeaf = true;
          }

          count ++ ;
        } else if (n.type === 'fork') {

          let fork = {};
          try {
            fork = this.forks[n.id];
          } catch (err) { /* do nothing */ }

          // Mix in imported fork
          Object.assign(n, {

            // No default properties or methods for now
          }, fork);

          if (!n.getNextBranch) {
            throw new Error('Fork missing required method: getNextBranch');
          }

          Object.entries(n.branches).forEach(function ([key, val]) {
            mapEachStep(val);
          });
        }
      }, this)

    }).bind(this)

    mapEachStep(config);
    return config;

  }

  /////////////////////////////
  // Navigation ///////////////
  /////////////////////////////

  stepForward () {

    var currentStepUniqueId = this._treeState.currentStepUniqueId;
    var nextStepUniqueId = null;

    // Don't step forward unless current step is valid
    if (!this.getStepByUniqueId(currentStepUniqueId).isValid( {tree: this} )) {
      return;
    }

    nextStepUniqueId = this.getNextStepUniqueId(currentStepUniqueId);

    if (nextStepUniqueId) {
      if (this._treeState.currentStepUniqueId) {
        this._treeState.history.push(this._treeState.currentStepUniqueId);
      }
      this._treeState.currentStepUniqueId = nextStepUniqueId;
      this.render();
    } else {
      this.onComplete();
      return;
    }

    return nextStepUniqueId;

  }

  stepBack () {

    let lastHistoryItem = this._treeState.history.pop();

    if (!lastHistoryItem) {
      return;
    }

    this._treeState.currentStepUniqueId = lastHistoryItem;
    this.render();

    return lastHistoryItem;

  }

  /**
   * Move forward until you can't anymore
   *
   * @param {String} toStep Step ID to stop on, if omitted keep going as far as possible
   *
   * TODO: suppress errors on final step
   */

  fastForward (toStep) {
    let keepGoing = function() {
      return (!toStep || this.getStepByUniqueId(this._treeState.currentStepUniqueId)).id !== toStep ? true : false;
    };
    while (keepGoing.call(this) && this.stepForward());
  }

  /////////////////////////////
  /////////////////////////////
  /////////////////////////////

  getStepByUniqueId (uniqueId) {
    let ret;

    // TODO: break on finding step
    util.mapEachStep(this.config, function(step, count, branch) {
      if (step.uniqueId === uniqueId) {
        ret = step;
      }
    });

    return ret;

  }

  getNextStepUniqueId (currentStepUniqueId) {

    let nextStepUniqueId;

    if (!currentStepUniqueId) {
      throw new Error('getNextStepUniqueId missing required parameter: currentStepUniqueId');
    }

    try {
      util.mapEachStep(this.config, function(step, count, branch) {

        // Have we found the current step
        if (step.uniqueId === currentStepUniqueId) {
          let nextNode = branch[util.indexOfStepInBranch(branch, step) + 1];

          if(!nextNode) {
            nextStepUniqueId = null;
            throw 'END'
          }

          if (nextNode.type === 'step') {
            nextStepUniqueId = nextNode.uniqueId;
          } else if (nextNode.type === 'fork') {

            // If next node is a fork, get the first step of the next branch
            nextStepUniqueId = nextNode.branches[nextNode.getNextBranch( {tree: this} )][0].uniqueId;
          }
        }
      }.bind(this));
    } catch (err) {
      if (err !== 'END') {
        throw err;
      }
    }

    return nextStepUniqueId;

  }

  getTreeState() {
    return this._treeState;
  }

}

// Factory function export
const multiStepUi = function (props) {
  return new Tree(props)
};

export {
  Tree,
  multiStepUi
};