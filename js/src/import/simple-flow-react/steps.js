import { CreateAccount } from './components/CreateAccount';
import { StepTwo } from './components/StepTwo';

const congrats = {
  renderStep: function(props) {
    
    let tree = props.tree;
    let name = tree.store.name;
    let memberType = tree.store.memberType;

    return `
      <div class="text-center h5 m-4">
        <i class="far fa-grin"></i>
        <b>Congrats on signing up as a <i>${memberType}</i><br> ${name}!</b>
      </div>
      <div class="text-center h5 m-4">
        <button type="button" class="btn btn-secondary" id="onward">Onward!</button>
      </div>
    `;
  },
  postRender: function(props) {

    let tree = props.tree;

    document.getElementById('onward').addEventListener('click', function() {
      tree.stepForward();
    });
  },
  hideSubmit: true
};

/**
 * Map step ID to controller
 */

const steps = {
  createAccount: {
    renderStep: function() {
      return CreateAccount;
    },
    isValid: function(props) {
      let tree = props.tree;
      let errors = {};

      if (!tree.store.name || !tree.store.name.length) {
        errors.name = 'Please enter your full name';
      }

      if (!tree.store.email || !tree.store.email.length) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!tree.store.password || !tree.store.password.length) {
        errors.password = 'Please enter a valid password';
      }

      if (!Object.keys(errors).length) {
        tree.store.errors = errors;
        tree.render();
        return true;
      }

      tree.store.errors = errors;
      tree.render();
      return false;
    }
  },

  stepTwo: {
    renderStep: function() {
      return StepTwo;
    },
    isValid: function(props) {
      let tree = props.tree;

      if (tree.store.memberType) {
        return true;
      }

      return false;
    }
  },

  // Generic past here
  congratsBuyer: congrats,
  congratsSeller: congrats
}

export {
  steps
};