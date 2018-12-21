const plugins = {
  router: {
    init: function () {
      console.log('init router: ' + this.getTreeState().currentStepUniqueId);
    },
    render: function() {
      console.log('render router: ' + this.getTreeState().currentStepUniqueId);
    },
    onStep: function (stepUniqueId) {
      console.log('onStep router: ' + stepUniqueId + ' : ' + this.getTreeState().currentStepUniqueId);
    },
    onComplete: function () {
      console.log('onComplete router : ' + this.getTreeState().currentStepUniqueId);
    },
  },
  somethingElse: {
    init: function () {
      console.log('init somethingElse: ' + this.getTreeState().currentStepUniqueId);
    }
  },
  anEmptyOne: {}
};

export {
  plugins
}