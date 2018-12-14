import React from 'react';
import ReactDOM from 'react-dom';
import Tree from '../components/Tree'
import Debug from '../components/Debug'

const render = function() {
  ReactDOM.render(<Tree tree={this} />, document.getElementById('tree'));
  ReactDOM.render(<Debug tree={this} />, document.getElementById('debug'));
};

export {
  render
};