// FIXME: cloneDeep is increasing the package size by 44KB!
// can't seem to get rid of it, need to reduce size
import cloneDeep from 'lodash.clonedeep';
import util from './util';

class Tree {
  constructor(props) {
    if (!props.config) {
      throw new Error('Missing required prop: config');
    }

    if (!props.render) {
      throw new Error('Missing required prop: render');
    }

    // Mix props into this
    Object.assign(this, {

      // //////////////////////////
      // Supported props //////////
      // //////////////////////////

      /*
        Required
       */
      config: [],

      /**
       * Tree render method is required and provided at configuration
       * Tree render should render whatever layout plus the output of
       * calling `render()` on the current step
       */
      render() {

      },

      /**
       * Optionally provive an `onComplete()` handler at configuration
       * which will be called when the final step (Leaf) is valid
       */
      onComplete() {

      },

    }, props);

    // Overwrite `this.config`, add unique ID etc.
    this.config = this._mapSteps(cloneDeep(this.config));

    // Tree maintains simple navigation state
    // maintaining your own application state separately is recommended
    this._treeState = {
      currentStepUniqueId: this.config[0].uniqueId,
      history: [],
      isFastForwarding: false
    };

    this.render();
  }

  /**
   * Enhance config, add functionality
   *
   * This is where config is matched against
   * the maps for steps and forks (props.steps and props.forks)
   * and functionality is merged and made accessible in the
   * context of the Tree instance
   *
   * @param  {Object} config TODO: see documentation
   * @return {Object}        New config
   */
  _mapSteps(config) {
    let count = 1;

    const mapEachStep = ((branch) => {
      const len = branch.length;

      branch.forEach((n, i, list) => {
        if (n.type === 'fork') {
          let fork;
          try {
            // Attempt to load an externally configured fork by id
            // (passed in via props.forks) but it's OK to fail
            fork = cloneDeep(this.forks[n.id]);
          } catch (err) { /* do nothing */ }
          fork = fork || {};

          // Mix in any config properties, namely id
          Object.assign(fork, n);

          if (!fork.getNextBranch) {
            throw new Error('Fork missing required method: getNextBranch');
          }

          Object.entries(fork.branches).forEach(([key, val]) => {
            mapEachStep(val);
          });

          list[i] = fork;
        } else {
          // Assume anything other than type: fork is type: step

          if (!n.id) {
            throw new Error('Step missing required property: id');
          }

          /**
           * The loaded step needs to retain
           * prototype chain and trump all default properties
           * everything needs to be copied back to n, can't use object.assign
           *
           * prototype chain is required to support custom step classes incoming
           */

          // Import step if available
          let step;
          try {
            // Attempt to load step from props.steps map
            // Must deep clone to preserve prototype chain
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

          // Default isValid() step method always returns true
          // override this on individual steps
          if (typeof step.isValid !== 'function') {
            step.isValid = () => {
              return true;
            };
          }

          // Allow for empty `step.renderStep()`
          if (typeof step.renderStep !== 'function') {
            step.renderStep = () => {};
          }

          list[i] = step;

          count += 1;
        }
      }, this);
    });

    mapEachStep(config);
    return config;
  }

  // ///////////////////////////
  // Navigation ////////////////
  // ///////////////////////////

  /**
   * Step _treeState forward by one
   * @return {String} Next step uniqueId
   */
  stepForward(isFastForwarding = false) {
    const { currentStepUniqueId } = this._treeState;
    let nextStepUniqueId = null;

    // if isFastForwarding, a step may choose to suppress validation errors
    this._treeState.isFastForwarding = isFastForwarding;
    // Don't step forward unless current step is valid
    if (!this.getStepByUniqueId(currentStepUniqueId).isValid({ tree: this })) {
      return '';
    }
    this._treeState.isFastForwarding = false;

    nextStepUniqueId = this.getNextStepUniqueId(currentStepUniqueId);

    if (nextStepUniqueId) {
      if (this._treeState.currentStepUniqueId) {
        this._treeState.history.push(this._treeState.currentStepUniqueId);
      }
      this._treeState.currentStepUniqueId = nextStepUniqueId;
      this.render();
    } else {
      // No next step means we're at the end of the line
      this.onComplete();
      return '';
    }

    return nextStepUniqueId;
  }

  /**
   * Step _treeState back by one
   * @return {String} Last histroy item
   */
  stepBack() {
    const lastHistoryItem = this._treeState.history.pop();

    if (!lastHistoryItem) {
      return '';
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
   * IMPORTANT: toStep should be step.id NOT step.uniqueId
   */
  fastForward(toStep) {
    const keepGoing = () => {
      return !toStep || this.getStepByUniqueId(this._treeState.currentStepUniqueId).id !== toStep;
    };
    while (keepGoing.call(this) && this.stepForward(true));
  }

  /**
   * TODO: implement a rewind/start over method
   */
  // rewind(toStep) {
  // }

  // ///////////////////////////
  // ///////////////////////////
  // ///////////////////////////

  getStepByUniqueId(uniqueId) {
    let ret;

    if (!uniqueId || typeof uniqueId !== 'string') {
      throw new Error('getStepByUniqueId called with missing or invalid `uniqueId`');
    }

    // TODO: break on finding step
    util.mapEachStep(this.config, (step) => {
      if (step.uniqueId === uniqueId) {
        ret = step;
      }
    });

    return ret;
  }

  getNextStepUniqueId(currentStepUniqueId) {
    let nextStepUniqueId;

    if (!currentStepUniqueId) {
      throw new Error('getNextStepUniqueId missing required parameter: currentStepUniqueId');
    }

    try {
      util.mapEachStep(this.config, (step, count, branch) => {
        // Have we found the current step
        if (step.uniqueId === currentStepUniqueId) {
          const nextNode = branch[util.indexOfStepInBranch(branch, step) + 1];

          if (!nextNode) {
            nextStepUniqueId = '';
            throw new Error('END');
          }

          if (nextNode.type === 'step') {
            nextStepUniqueId = nextNode.uniqueId;
          } else if (nextNode.type === 'fork') {
            // If next node is a fork, get the first step of the next branch
            nextStepUniqueId = nextNode.branches[nextNode.getNextBranch({ tree: this })][0]
              .uniqueId;
          }
        }
      });
    } catch (err) {
      if (err.message !== 'END') {
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
const multiStepUi = (props) => {
  return new Tree(props);
};

export {
  Tree,
  multiStepUi
};
