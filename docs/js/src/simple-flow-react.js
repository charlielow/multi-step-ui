import { multiStepUi } from '../../../src/multi-step-ui';

// Import config, steps, forks and render for this example page
const config = require('../../data/simple-flow-react.json');
import { steps } from './import/simple-flow-react/steps';
import { forks } from './import/simple-flow-react/forks';
import { render } from './import/simple-flow-react/render';
import { plugins } from './import/plugins/dummy';

// Create and configure the multi step flow
var msuFlow = multiStepUi({

  config,
  steps,
  forks,
  render,

  plugins,

  // deepLinkStepUniqueId: 'stepTwo2',

  store: {
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    password: 'password',
    memberType: 'buyer'
  },
  
  onStep: function() {
    console.log(JSON.stringify(this.getTreeState()));
  },

  onComplete: function() {
    console.log('Complete!');
  }

});

// Assign to a global property for debugging purposes
window.msuFlow = msuFlow;

// TODO: remove
// msuFlow.stepForward();
// msuFlow.fastForward('stepTwo');
