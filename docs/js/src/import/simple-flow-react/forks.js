
const forks = {
  forkOne: {
    getNextBranch: function(props) {
      let tree = props.tree;
      return tree.store.memberType;
    }
  }
};


export {
  forks
};