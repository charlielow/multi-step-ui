import { multiStepUi } from '../../../../src/multi-step-ui';

require('./import/util/autoPlay')({
  stepForwardMs: 200,
  stepBackMs: 50,
  autoPlay: true
});

// Import config, steps, forks and render for this example page
import { config } from '../../data/generate-complex-branching-flow';

// Debug original config
document.getElementById('debug-config').innerHTML = JSON.stringify(config, null, 2);

// Create and configure the multi step flow
var msuFlow = multiStepUi({
  config,
  render: function () {
    document.getElementById('debug-tree-state').innerHTML = JSON.stringify(this._treeState, null, 2);
  }
});


// Assign to a global property for debugging purposes
window.msuFlow = msuFlow;
