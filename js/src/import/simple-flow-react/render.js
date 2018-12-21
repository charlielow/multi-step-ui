import React from 'react';
import ReactDOM from 'react-dom';
import Tree from '../components/Tree'
import Debug from '../components/Debug'

/**
 *
 */

class Layout extends React.Component {
  render () {

    let tree = this.props.tree;
    
    // Save reference to the return value of the current step's render method
    // This may be a react component or it may be a string
    let step = tree.getStepByUniqueId(tree.getTreeState().currentStepUniqueId).renderStep({ tree });

    return(
      <div>
        <div className="card">
          <Header tree={tree} />
          <form action="javascript:;" onSubmit={() => { 
            tree.stepForward()
          }} noValidate>
            <div className="card-body">

                {
                  /**
                   * If step is a function we'll assume it's a React component
                   * and render it passing in tree via props
                   *
                   * className={'needs-validation ' + ((tree.store.errors && Object.keys(tree.store.errors).length) ? 'was-validated' : '' )}
                   *
                   * Else we'll assume it's a string and just render the string dangerously (for example purposes only, to have a fallback)
                   */
                }
                {(typeof step === 'function') ?
                  React.createElement(step, { tree }, null) :
                  <div dangerouslySetInnerHTML={{__html: step}} />
                }

            </div>
            <Footer tree={tree} />
          </form>
        </div>
      </div>
    );
  }
}

/**
 *
 */

class Header extends React.Component {
  render () {
    let tree = this.props.tree;
    let uniqueId = tree.getTreeState().currentStepUniqueId;
    let heading = tree.getStepByUniqueId(uniqueId).heading;

    return(
      <div>
        <div className="card-header text-center">
          <b>{heading || uniqueId}</b>
          <NavHeader tree={tree} />
        </div>
      </div>
    );
  }
}

/**
 *
 */

class NavHeader extends React.Component {
  render () {
    let tree = this.props.tree;
    let step = tree.getStepByUniqueId(tree.getTreeState().currentStepUniqueId);

    return(
      <div>
        <div className="btn-back">
          <button className="btn" onClick={() => tree.stepBack()}>
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
        {!step.hideSubmit && <div className="btn-forward">
          <button className="btn" onClick={() => tree.stepForward()}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>}
      </div>
    );
  }
}

/**
 *
 */

class Footer extends React.Component {
  render () {
    let tree = this.props.tree;

    return(
      <div>
        <div className="card-footer text-right">
          <NavFooter tree={tree} />
        </div>
      </div>
    );
  }
}


/**
 *
 */

class NavFooter extends React.Component {
  render () {
    let tree = this.props.tree;
    let step = tree.getStepByUniqueId(tree.getTreeState().currentStepUniqueId);

    return(
      <div>
        {/* <button type="button" className="btn btn-link btn-sm">Skip</button> */}
        {!step.hideSubmit && <button type="submit" className="btn btn-secondary btn-sm">
          Submit
        </button>}
      </div>
    );
  }
}


const render = function() {


  ReactDOM.render(<Tree tree={this} />, document.getElementById('tree'));
  ReactDOM.render(<Layout tree={this} />, document.getElementById('render'), function() {

    // A way to execute logic after rendering a simple string render step
    let postRender = this.getStepByUniqueId(this._treeState.currentStepUniqueId).postRender;
    if (postRender) {
      postRender({ tree: this });
    }
  }.bind(this));
  ReactDOM.render(<Debug tree={this} />, document.getElementById('debug'));


};

export {
  render
};