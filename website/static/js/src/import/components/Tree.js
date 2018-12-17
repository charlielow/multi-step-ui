import React from 'react';
import ReactDOM from 'react-dom';

/**
 *
 */

class Tree extends React.Component {
  render () {

    let tree = this.props.tree;

    let mapBranch = (branch) => {
      return branch.map((n) => {
        if (n.type === 'step') {

          let liClassName = (n.isLeaf === true) ? 'is-leaf' : '' ;
          let iconClassName = (n.isLeaf === true) ? 'fas fa-leaf' : 'far fa-stop-circle' ;

          return (
            <li key={n.uniqueId} className={liClassName + ((n.uniqueId === tree.getTreeState().currentStepUniqueId) ? ' selected' : '') }>
              <i className={iconClassName}></i> {n.id}
            </li>
          );

        } else if (n.type === 'fork') {

          return (
            <li key={n.uniqueId}>
              <ul>
                { Object.keys(n.branches).map((branch) => {
                  return (
                    <li key={branch}>
                      <div>
                        <i className="fas fa-code-branch"></i> {branch}
                        <ul>
                          {mapBranch(n.branches[branch])}
                        </ul>
                      </div>
                    </li>
                  );
                }) }
              </ul>
            </li>
          );

        }
      })
    };

    return (
      <div>
        <ul>
          { mapBranch(tree.config) }
        </ul>
      </div>
    );
  }
}

export default Tree;