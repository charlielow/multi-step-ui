import util from './util';

// FIXME: this is increasing the package size by 44KB! wtf, can't seem to get rid of it, need to reduce size
import cloneDeep from 'lodash.clonedeep';

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
    this.config = this._mapSteps(cloneDeep(this.config));

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
    // FIXME: how can I make this whole thing more pure?
    var count = 1;

    const mapEachStep = (function (branch) {

      let len = branch.length;

      branch.forEach(function(n, i, list) {
        if (n.type === 'fork') {
          let fork;
          try {
            fork = cloneDeep(this.forks[n.id]);
          } catch (err) { /* do nothing */ }
          fork = fork || {};

          Object.assign(fork, n);

          if (!fork.getNextBranch) {
            throw new Error('Fork missing required method: getNextBranch');
          }

          Object.entries(fork.branches).forEach(function ([key, val]) {
            mapEachStep(val);
          });

          list[i] = fork;
        } else {

          // Assume anything other than type: fork is type: step

          // TODO: ensure n.id

          /**
           * The loaded step needs to retain
           * prototype chain and trump all default properties
           * everything needs to be copied back to n, can't use object.assign
           *
           * prototype chain to support custom step classes incoming
           */

          // Import step if available
          let step;
          try {
            
            // Must deep clone to preserve prototype chain and all nested branches etc.
            // and so steps that share logic will be copied and thus have unique ID
            step = cloneDeep(this.steps[n.id]);
          } catch (err) { /* do nothing */ }
          step = step || {};

          // Step needs to be the destination so it can retain
          // its prototype chain, n is just a plain JSON config
          Object.assign(step, n);

          step.type = 'step';
          step.uniqueId = step.id + count;

          // If the current step is the last item in its branch
          // then it is a leaf
          if (i === len - 1) {
            step.isLeaf = true;
          }

          if (typeof step.isValid !== 'function') {
            step.isValid = function () {
              return true;
            };
          }

          if (typeof step.renderStep !== 'function') {
            step.renderStep = function () {
              
              // TODO: remove/change
              return 'TEMPORARY PLACEHOLDER DEFAULT STEP renderStep()';
            };
          }

          // FIXME: maybe?, I don't like how this force overwrites
          list[i] = step;

          count ++ ;
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