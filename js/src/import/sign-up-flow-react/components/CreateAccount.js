import React from 'react';

/**
 * 
 */

class CreateAccount extends React.Component {
  render () {
    
    let tree = this.props.tree;

    return (
      <div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" 
            placeholder="Enter email" value={tree.store.email} onChange={(evt) => {
              
              // TODO: obviously this is going to have to change
              // should probably get redux integrated here
              tree.store.email = evt.target.value;
              tree.render();
            }} />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
        </div>
      </div>
    );
  }
}

export {
  CreateAccount
};