import React from 'react';
import ReactDOM from 'react-dom';

/**
 *
 */

class Debug extends React.Component {
  render () {
    let tree = {
      store: this.props.tree.store,
      _treeState: this.props.tree._treeState
    };
    return JSON.stringify(tree, null, 2);
  }
}

export default Debug;