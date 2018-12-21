/**
 * Get a random branch
 */

const spinTheBottle = {
  
  /**
   * Fork logic for determining next step
   * @return {String} Branch key (name)
   */
  getNextBranch: function() {
    let keys = Object.keys(this.branches);
    let len = keys.length;
    return keys[Math.floor(Math.random() * len)];
  }
}

export {
  spinTheBottle
}