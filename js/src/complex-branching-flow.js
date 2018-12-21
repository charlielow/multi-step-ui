import { multiStepUi } from '../../../../src/multi-step-ui';

require('./import/util/autoPlay')({
  stepForwardMs: 200,
  stepBackMs: 50,
  autoPlay: false
});

// Import config, steps, forks and render for this example page
import { config } from '../../data/generate-complex-branching-flow';
import { render } from './import/complex-branching-flow/render';

// Create and configure the multi step flow
var msuFlow = multiStepUi({
  config,
  render
});


// Assign to a global property for debugging purposes
window.msuFlow = msuFlow;
