const autoPlay = function(p) {

  let props = Object.assign({
    stepForwardMs: 950,
    stepBackMs: 250,
    autoPlay: true
  }, p);

  // TODO: come back to this

  // Some crazy test logic to automate stepping
  // through the flow then back out again over and over
  // assumes no validation on steps, forks get a random branch
  window.startAutoStepForward = function () {
    
    try {
      window.clearInterval(window.stepForwardInterval);
      window.clearInterval(window.stepBackInterval)
    } catch (err) { /* do nothing */ }  

    window.stepForwardInterval = window.setInterval(() => { 
      if (!window.msuFlow.stepForward()) {
        window.clearInterval(window.stepForwardInterval);
        window.stepBackInterval = window.setInterval(function() {
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
    window.clearInterval(window.stepBackInterval)
  }

  document.getElementById('start-auto-play').addEventListener('click', window.startAutoStepForward);
  document.getElementById('stop-auto-play').addEventListener('click', window.stopAutoStepForward);

  if (props.autoPlay === true) {
    window.startAutoStepForward();
  }

};


module.exports = autoPlay;