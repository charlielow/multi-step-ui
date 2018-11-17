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
          <label htmlFor="exampleInputEmail1">Name</label>
          <input type="name" id="name" name="name"
            className={ 'form-control ' + ((tree.store.errors && tree.store.errors.name) ? 'is-invalid' : '' )}
            placeholder="Enter full name" value={tree.store.name} onChange={(evt) => {
              tree.store.name = evt.target.value;
              tree.render();
            }} />
          <div className="invalid-feedback">
            {tree.store.errors && tree.store.errors.name}            
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" id="email" name="email" aria-describedby="emailHelp" 
            className={ 'form-control ' + ((tree.store.errors && tree.store.errors.email) ? 'is-invalid' : '' )}
            placeholder="Enter email" value={tree.store.email} onChange={(evt) => {
              tree.store.email = evt.target.value;
              tree.render();
            }} />
          <div className="invalid-feedback">
            {tree.store.errors && tree.store.errors.email}            
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" id="password" name="password"
            className={ 'form-control ' + ((tree.store.errors && tree.store.errors.password) ? 'is-invalid' : '' )}
            placeholder="Password" value={tree.store.password} onChange={(evt) => {
              tree.store.password = evt.target.value;
              tree.render();
            }} />
          <div className="invalid-feedback">
            {tree.store.errors && tree.store.errors.password}            
          </div>
        </div>
      </div>
    );
  }
}

export {
  CreateAccount
};