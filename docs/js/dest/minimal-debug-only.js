(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;

var _forks = require("../js/src/import/util/forks");

var maxStepsPerBranch = 3;
var maxBranchesPerFork = 3;
var maxForks = 3;
var forksCount = 0;
/**
 * Some logic for dynamically creating a
 * tree with generic steps and forks based on the
 * congiguration settings above
 */

var createBranch = function createBranch() {
  var ret = [];
  var howManySteps = Math.ceil(Math.random() * maxStepsPerBranch);

  for (var i = 1; i <= howManySteps; i++) {
    ret.push(Object.assign({}, aStep));
  }

  if (forksCount <= maxForks) {
    var fork = Object.assign({}, aFork);
    fork.getNextBranch = _forks.spinTheBottle.getNextBranch;
    ret.push(fork);
    fork.branches = {};
    forksCount++;
    var howManyBranches = Math.ceil(Math.random() * maxBranchesPerFork);

    if (howManyBranches < 2) {
      howManyBranches = 2;
    }

    for (var i = 1; i <= howManyBranches; i++) {
      fork.branches['branch' + i] = createBranch();
    }
  }

  return ret;
};

var aStep = {
  type: 'step',
  id: 'step'
};
var aFork = {
  type: 'fork',
  id: 'fork'
};
var config = createBranch();
exports.config = config;

},{"../js/src/import/util/forks":3}],2:[function(require,module,exports){
"use strict";

var autoPlay = function autoPlay(p) {
  var props = Object.assign({
    stepForwardMs: 950,
    stepBackMs: 250,
    autoPlay: true
  }, p); // TODO: come back to this
  // Some crazy test logic to automate stepping
  // through the flow then back out again over and over
  // assumes no validation on steps, forks get a random branch

  window.startAutoStepForward = function () {
    try {
      window.clearInterval(window.stepForwardInterval);
      window.clearInterval(window.stepBackInterval);
    } catch (err) {
      /* do nothing */
    }

    window.stepForwardInterval = window.setInterval(function () {
      if (!window.msuFlow.stepForward()) {
        window.clearInterval(window.stepForwardInterval);
        window.stepBackInterval = window.setInterval(function () {
          if (!window.msuFlow.stepBack()) {
            window.clearInterval(window.stepBackInterval);
            window.startAutoStepForward();
          }
        }, props.stepBackMs);
      }
    }, props.stepForwardMs);
  };

  window.stopAutoStepForward = function () {
    window.clearInterval(window.stepForwardInterval);
    window.clearInterval(window.stepBackInterval);
  };

  document.getElementById('start-auto-play').addEventListener('click', window.startAutoStepForward);
  document.getElementById('stop-auto-play').addEventListener('click', window.stopAutoStepForward);

  if (props.autoPlay === true) {
    window.startAutoStepForward();
  }
};

module.exports = autoPlay;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spinTheBottle = void 0;

/**
 * Get a random branch
 */
var spinTheBottle = {
  /**
   * Fork logic for determining next step
   * @return {String} Branch key (name)
   */
  getNextBranch: function getNextBranch() {
    var keys = Object.keys(this.branches);
    var len = keys.length;
    return keys[Math.floor(Math.random() * len)];
  }
};
exports.spinTheBottle = spinTheBottle;

},{}],4:[function(require,module,exports){
"use strict";

var _multiStepUi = require("../../../src/multi-step-ui");

var _generateComplexBranchingFlow = require("../../data/generate-complex-branching-flow");

require('./import/util/autoPlay')({
  stepForwardMs: 200,
  stepBackMs: 50,
  autoPlay: true
}); // Import config, steps, forks and render for this example page


// Debug original config
document.getElementById('debug-config').innerHTML = JSON.stringify(_generateComplexBranchingFlow.config, null, 2); // Create and configure the multi step flow

var msuFlow = (0, _multiStepUi.multiStepUi)({
  config: _generateComplexBranchingFlow.config,
  render: function render() {
    document.getElementById('debug-tree-state').innerHTML = JSON.stringify(this._treeState, null, 2);
  }
}); // Assign to a global property for debugging purposes

window.msuFlow = msuFlow;

},{"../../../src/multi-step-ui":5,"../../data/generate-complex-branching-flow":1,"./import/util/autoPlay":2}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multiStepUi = exports.Tree = void 0;

var _util = _interopRequireDefault(require("./util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Tree =
/*#__PURE__*/
function () {
  function Tree(props) {
    _classCallCheck(this, Tree);

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
      render: function render() {},

      /**
       * Optionally proved an onComplete handler at configuration
       * will be called when the final step (Leaf) is valid
       */
      onComplete: function onComplete() {}
    }, props); // Overwrite config, add unique ID etc.

    this._mapSteps(this.config); // Tree maintains simple state, data store maintained separately


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


  _createClass(Tree, [{
    key: "_mapSteps",
    value: function _mapSteps(config) {
      // FIXME: originally did this in a way which didn't mutate config
      // but changed that to reduce dependencies
      // FIXME: how can I make this whole thing more pure?
      var count = 1;

      var mapEachStep = function (branch) {
        var len = branch.length;
        branch.forEach(function (n, i) {
          if (n.type === 'step') {
            // Mix in imported step if available
            var step = {};

            try {
              step = this.steps[n.id];
            } catch (err) {
              /* do nothing */
            }

            Object.assign(n, {
              uniqueId: n.id + count,
              // FIXME: temp placeholder
              renderStep: function renderStep() {
                return "".concat(this.leaf === true ? 'LEAF!' : 'STEP', " <b>").concat(this.id, "</b>");
              },
              // Default steps to having no validation rules
              isValid: function isValid() {
                return true;
              }
            }, step); // If the current step is the last item in its branch
            // then it is a leaf

            if (i === len - 1) {
              n.isLeaf = true;
            }

            count++;
          } else if (n.type === 'fork') {
            var fork = {};

            try {
              fork = this.forks[n.id];
            } catch (err) {}
            /* do nothing */
            // Mix in imported fork


            Object.assign(n, {// No default properties or methods for now
            }, fork);

            if (!n.getNextBranch) {
              throw new Error('Fork missing required method: getNextBranch');
            }

            Object.entries(n.branches).forEach(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  key = _ref2[0],
                  val = _ref2[1];

              mapEachStep(val);
            });
          }
        }, this);
      }.bind(this);

      mapEachStep(config);
      return config;
    } /////////////////////////////
    // Navigation ///////////////
    /////////////////////////////

  }, {
    key: "stepForward",
    value: function stepForward() {
      var currentStepUniqueId = this._treeState.currentStepUniqueId;
      var nextStepUniqueId = null; // Don't step forward unless current step is valid

      if (!this.getStepByUniqueId(currentStepUniqueId).isValid({
        tree: this
      })) {
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
  }, {
    key: "stepBack",
    value: function stepBack() {
      var lastHistoryItem = this._treeState.history.pop();

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

  }, {
    key: "fastForward",
    value: function fastForward(toStep) {
      var keepGoing = function keepGoing() {
        return (!toStep || this.getStepByUniqueId(this._treeState.currentStepUniqueId)).id !== toStep ? true : false;
      };

      while (keepGoing.call(this) && this.stepForward()) {
        ;
      }
    } /////////////////////////////
    /////////////////////////////
    /////////////////////////////

  }, {
    key: "getStepByUniqueId",
    value: function getStepByUniqueId(uniqueId) {
      var ret; // TODO: break on finding step

      _util.default.mapEachStep(this.config, function (step, count, branch) {
        if (step.uniqueId === uniqueId) {
          ret = step;
        }
      });

      return ret;
    }
  }, {
    key: "getNextStepUniqueId",
    value: function getNextStepUniqueId(currentStepUniqueId) {
      var nextStepUniqueId;

      if (!currentStepUniqueId) {
        throw new Error('getNextStepUniqueId missing required parameter: currentStepUniqueId');
      }

      try {
        _util.default.mapEachStep(this.config, function (step, count, branch) {
          // Have we found the current step
          if (step.uniqueId === currentStepUniqueId) {
            var nextNode = branch[_util.default.indexOfStepInBranch(branch, step) + 1];

            if (!nextNode) {
              nextStepUniqueId = null;
              throw 'END';
            }

            if (nextNode.type === 'step') {
              nextStepUniqueId = nextNode.uniqueId;
            } else if (nextNode.type === 'fork') {
              // If next node is a fork, get the first step of the next branch
              nextStepUniqueId = nextNode.branches[nextNode.getNextBranch({
                tree: this
              })][0].uniqueId;
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
  }, {
    key: "getTreeState",
    value: function getTreeState() {
      return this._treeState;
    }
  }]);

  return Tree;
}(); // Factory function export


exports.Tree = Tree;

var multiStepUi = function multiStepUi(props) {
  return new Tree(props);
};

exports.multiStepUi = multiStepUi;

},{"./util":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var util = {
  /**
   * Run some code on each step in the tree
   * @param  {Array}   config   Tree.config
   * @param  {Function} callback recieves current Step,
   * count (not index in branch, but count) and current Branch
   * @return {undefined}
   */
  mapEachStep: function mapEachStep(config, callback) {
    if (!config || !callback) {
      throw new Error('Missing required parameter');
    }

    var count = 0;

    var _mapEachStep = function _mapEachStep(branch) {
      branch.forEach(function (n) {
        if (n.type === 'step') {
          callback(n, count, branch);
          count += 1;
        } else if (n.type === 'fork') {
          Object.entries(n.branches).forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                val = _ref2[1];

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
   * @param  {Array} branch
   * @param  {Object} n Step
   * @return {Number}
   */
  indexOfStepInBranch: function indexOfStepInBranch(branch, step) {
    var ret = 0;

    try {
      branch.forEach(function (n, i) {
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
var _default = util;
exports.default = _default;

},{}]},{},[4]);
