import React from 'react';

/**
 * 
 */

class Step extends React.Component {
  render () {
    
    let tree = this.props.tree;

    return (
      <div>React component step: {tree.getTreeState().currentStepUniqueId} </div>
    );
  }
}

export {
  Step
};