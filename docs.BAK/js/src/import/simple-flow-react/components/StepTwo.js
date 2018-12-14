import React from 'react';

/**
 * 
 */

class StepTwo extends React.Component {
  render () {
    
    let tree = this.props.tree;

    const setStateRadio = function(evt) {
      let name = evt.target.name;
      let val = evt.target.value;
      tree.store[name] = (evt.target.checked) ? val : '' ;
      tree.render();
    };

    return (
      <div>
        <div className="custom-control custom-radio">
          <input type="radio" id="buyer" value="buyer" checked={tree.store.memberType === 'buyer'} name="memberType" className="custom-control-input"
            onChange={setStateRadio} />
          <label className="custom-control-label" htmlFor="buyer">Search marketplace</label>
        </div>
        <div className="custom-control custom-radio">
          <input type="radio" id="seller" value="seller" checked={tree.store.memberType === 'seller'} name="memberType" className="custom-control-input"
            onChange={setStateRadio} />
          <label className="custom-control-label" htmlFor="seller">I have items to sell</label>
        </div>        
      </div>
    );
  }
}

export {
  StepTwo
};