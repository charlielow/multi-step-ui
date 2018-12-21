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
    let stepRender = tree.getStepByUniqueId(tree.getTreeState().currentStepUniqueId).renderStep({ tree });

    return(
      <div>
        <div className="card">
          <Header tree={tree} />
          <div className="card-body">
            <form>

              {
                /**
                 * TODO: form onsubmit etc.
                 * 
                 * If stepRender is a function we'll assume it's a React component
                 * and render it passing in tree via props
                 *
                 * Else we'll assume it's a string and just render the string dangerously (for example purposes only, to have a fallback)
                 */
              }
              {(typeof stepRender === 'function') ?
                React.createElement(stepRender, { tree }, null) :
                <div dangerouslySetInnerHTML={{__html: stepRender}} />
              }

            </form>
          </div>
          <Footer tree={tree} />
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

    return(
      <div>
        <div className="card-header text-center">
          <b>{tree.getTreeState().currentStepUniqueId}</b>
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

    return(
      <div>
        <div className="btn-back">
          <button className="btn" onClick={() => tree.stepBack()}>
            <i className="fas fa-chevron-left"></i>
          </button>
        </div>
        <div className="btn-forward">
          <button className="btn" onClick={() => tree.stepForward()}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
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

    return(
      <div>
        {/* <button type="button" className="btn btn-link btn-sm">Skip</button> */}
        <button type="submit" className="btn btn-secondary btn-sm" onClick={() => tree.stepForward()}>
          Submit
        </button>
      </div>
    );
  }
}


const render = function() {

  ReactDOM.render(<Tree tree={this} />, document.getElementById('tree'));
  ReactDOM.render(<Layout tree={this} />, document.getElementById('render'));
  ReactDOM.render(<Debug tree={this} />, document.getElementById('debug'));

};

export {
  render
};