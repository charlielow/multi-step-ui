import { genericStep } from '../util/steps';
import { CreateAccount } from './components/CreateAccount';

const steps = {
  createAccount: {
    renderStep: function() {
      return CreateAccount;
    },
    isValid: function(props) {

      let tree = props.tree;

      if (tree.store.email && tree.store.email.length) {
        return true;
      }

      return false;
    }
  },

  // Generic past here
  addInventory: genericStep,
  congrats: genericStep,
  primaryObjective: genericStep,
  profileAddress: genericStep,
  profileBankInfo: genericStep,
  profileBasic: genericStep,
  profileCreditCard: genericStep,
  profilePhoto: genericStep,
  reviewCart: genericStep,
  subscribe: genericStep,
  upsellTShirt: genericStep
}

export {
  steps
};