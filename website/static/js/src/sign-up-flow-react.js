import { multiStepUi } from '../../../../src/multi-step-ui';

require('./import/util/autoPlay')({
  autoPlay: false
});

// Import config, steps, forks and render for this example page
const config = require('../../data/sign-up-flow-react.json');
import { steps } from './import/sign-up-flow-react/steps';
import { forks } from './import/sign-up-flow-react/forks';
import { render } from './import/sign-up-flow-react/render';

// Create and configure the multi step flow
var msuFlow = multiStepUi({
  config,
  steps,
  forks,
  store: {
    name: 'Bob Smith',
    email: 'bob.smith@email.com'
  },
  render: render
});

// Assign to a global property for debugging purposes
window.msuFlow = msuFlow;
