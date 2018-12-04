import { Tree, multiStepUi } from '../src/multi-step-ui';

const _ = require('lodash');

const config = require('./data/config-basic-sign-up.json');
const configNoForks = require('./data/config-no-forks.json');
const configFullSignUp = require('./data/config-full-sign-up.json');

describe('Tree', () => {
  describe('constructor', () => {
    test('Should throw when instantiated with missing arguments', () => {
      expect(() => {
        return new Tree();
      }).toThrow();
    });

    test('Should throw when instantiated with invalid arguments', () => {
      // In this case, render is missing
      expect(() => {
        return new Tree({
          config: configNoForks,
        });
      }).toThrow(/render/);

      // In this case, config is missing
      expect(() => {
        return new Tree({
          render: () => {},
        });
      }).toThrow(/config/);
    });

    test('Should throw when instantiated with invalid forks', () => {
      // In this case, config has forks missing getNextBranch()
      expect(() => {
        return new Tree({
          config,
          render: () => {},
        });
      }).toThrow(/Fork/);
    });

    /**
     * Currently due to defaults there is no case for invalid steps
     * may want to revisit this in the future with logging support
     *
    test('Should throw when instantiated with invalid steps', () => {
      // In this case, config has forks missing getNextBranch()
      expect(() => {
        return new Tree({
          config,
          steps: {
            createAccount: {}
          },
          forks: {
            forkOne: {
              getNextBranch: () => {},
            }
          },
          render: () => {},
        });
      }).toThrow();
    });
     */

    test('Should NOT throw when instantiated with minimal valid arguments', () => {
      const msuFlow = new Tree({
        config: configNoForks,
        render: () => {},
      });
      expect(msuFlow._treeState).toBeDefined();
    });

    test('Should not mutate original config', () => {
      const t = new Tree({
        config: configFullSignUp,
        forks: {
          fork: {
            getNextBranch: () => {}
          }
        },
        render: () => {}
      });

      expect(t.config[0].uniqueId).toBe('step1');
      expect(configFullSignUp[0].uniqueId).toBeUndefined();
    });
  });

  describe('_mapSteps', () => {
    let t;
    let _mapSteps;

    beforeEach(() => {
      class Fork {
        getNextBranch() {
          return 'someBranch';
        }
      }

      class Step {
        renderStep() {
          return 'step string';
        }
      }

      t = new Tree({
        config: configFullSignUp,
        steps: {
          step: new Step()
        },
        forks: {
          fork: new Fork()
        },
        render: () => {}
      });
    });

    test('Should throw if any step is missing `id`', () => {
      expect(() => {
        const tree = new Tree({
          config: [
            {
              id: 'step'
            },
            {}
          ],
          steps: {},
          forks: {
            fork: {
              getNextBranch: () => {}
            }
          },
          render: () => {}
        });
      }).toThrow(/id/);
    });

    test('Should correctly map nested steps', () => {
      expect(t.config[2].branches.branchA[0].uniqueId).toBe('step3');
    });

    test('Should preserve arbitrary step config attributes', () => {
      expect(t.config[1].title).toBe('Step Two');
    });

    test('Should correctly map all steps to type `step`', () => {
      expect(t.config[2].branches.branchA[0].type).toBe('step');
    });

    test('Should correctly map all terminal steps `isLeaf: true`', () => {
      expect(t.config[2].branches.branchA[0].isLeaf).toBe(true);
    });

    test('Should load forks per per fork map', () => {
      expect(t.config[2].getNextBranch()).toBe('someBranch');
    });

    test('Should support fork class, maintain prototype methods', () => {
      expect(typeof t.config[2].getNextBranch).toBe('function');
    });

    test('Should throw if a fork is missing getNextBranch', () => {
      expect(() => {
        return new Tree({
          config: configFullSignUp,
          forks: {
            fork: {}
          },
          render: () => {}
        });
      }).toThrow(/getNextBranch/);
    });

    test('Should load steps per step map', () => {
      expect(t.config[0].renderStep()).toBe('step string');
    });

    test('Should support 2 steps of the same ID as distinct objects', () => {
      expect(t.config[0]).not.toBe(t.config[1]);
      expect(t.config[0]).not.toBe(t.config[2].branches.branchB[1]);
    });

    test('Should preserve step object prototype chain on mapped step objects', () => {
      expect(typeof t.config[0].renderStep).toBe('function');
    });

    test('Should default step.isValid to return `true`', () => {
      expect(t.config[0].isValid()).toBe(true);
    });
  });

  describe('stepForward', () => {
    let t;

    beforeEach(() => {
      class Fork {
        getNextBranch() {
          return 'branchA';
        }
      }

      class Step {
        renderStep() {
          return 'step string';
        }
      }

      t = new Tree({
        config: configFullSignUp,
        steps: {
          step: new Step()
        },
        forks: {
          fork: new Fork()
        },
        render: () => {}
      });
    });

    test('Should step forward and `render()`', () => {
      t.render = jest.fn();
      expect(t.getTreeState().currentStepUniqueId).toBe('step1');
      t.stepForward();
      expect(t.getTreeState().currentStepUniqueId).toBe('step2');
      expect(t.render).toHaveBeenCalled();
    });

    test('Should push the current step into history when stepping forward', () => {
      expect(t.getTreeState().currentStepUniqueId).toBe('step1');
      expect(t.getTreeState().history).toEqual([]);
      t.stepForward();
      expect(t.getTreeState().history).toEqual(['step1']);
    });

    test('Should not step forward when current step is not valid', () => {
      expect(t.getTreeState().currentStepUniqueId).toBe('step1');
      t.config[0].isValid = () => false;
      const nextStepUniqueId = t.stepForward();
      expect(nextStepUniqueId).toEqual('');
      expect(t.getTreeState().currentStepUniqueId).toBe('step1');
    });

    test('Should return `\'\'` and call `onComplete()` when there are no more steps', () => {
      t.onComplete = jest.fn();
      t.fastForward('step3');
      expect(t.getTreeState().currentStepUniqueId).toBe('step3');
      const nextStepUniqueId = t.stepForward();
      expect(nextStepUniqueId).toEqual('');
      expect(t.getTreeState().currentStepUniqueId).toBe('step3');
      expect(t.onComplete).toHaveBeenCalled();
    });
  });

  describe('stepBack', () => {
    let t;

    beforeEach(() => {
      class Fork {
        getNextBranch() {
          return 'branchA';
        }
      }

      class Step {
        renderStep() {
          return 'step string';
        }
      }

      t = new Tree({
        config: configFullSignUp,
        steps: {
          step: new Step()
        },
        forks: {
          fork: new Fork()
        },
        render: () => {}
      });
    });

    test('Should step back, `render()` and return `lastHistoryItem`', () => {
      t.stepForward();
      expect(t.getTreeState().currentStepUniqueId).toBe('step2');
      t.render = jest.fn();
      const lastHistoryItem = t.stepBack();
      expect(t.getTreeState().currentStepUniqueId).toBe('step1');
      expect(t.render).toHaveBeenCalled();
      expect(lastHistoryItem).toBe('step1');
    });

    test('Should return `\'\'` if history is empty and not change step', () => {
      expect(t.getTreeState().currentStepUniqueId).toBe('step1');
      const lastHistoryItem = t.stepBack();
      expect(lastHistoryItem).toEqual('');
      expect(t.getTreeState().currentStepUniqueId).toBe('step1');
    });
  });

  describe('fastForward', () => {
    let t;

    beforeEach(() => {
      class Fork {
        getNextBranch() {
          return 'branchA';
        }
      }

      t = new Tree({
        config,
        forks: {
          forkOne: {
            getNextBranch: () => {
              return 'buyer';
            },
          }
        },
        render: () => {}
      });
    });

    test('Should fast forward, across forks, to a terminal step if all steps are valid', () => {
      expect(t.getTreeState().currentStepUniqueId).toBe('createAccount1');
      t.fastForward();
      expect(t.getTreeState().currentStepUniqueId).toBe('congratsBuyer3');
    });

    test('Should fast forward to a valid `toStep` and stop', () => {
      expect(t.getTreeState().currentStepUniqueId).toBe('createAccount1');
      t.fastForward('stepTwo');
      expect(t.getTreeState().currentStepUniqueId).toBe('stepTwo2');
    });

    test('Should disregard an invalid `toStep`', () => {
      expect(t.getTreeState().currentStepUniqueId).toBe('createAccount1');
      t.fastForward('foofoolala');
      expect(t.getTreeState().currentStepUniqueId).toBe('congratsBuyer3');
    });

    test('Should stop on any invalid step', () => {
      t.config[1].isValid = () => false;
      expect(t.getTreeState().currentStepUniqueId).toBe('createAccount1');
      t.fastForward();
      expect(t.getTreeState().currentStepUniqueId).toBe('stepTwo2');
    });
    test('Should call `_onStep` for the step being fast forwarded to and not others', () => {
      expect(t.getTreeState().currentStepUniqueId).toBe('createAccount1');
      t._onStep = jest.fn();
      t.fastForward('congratsBuyer');
      expect(t.getTreeState().currentStepUniqueId).toBe('congratsBuyer3');
      expect(t._onStep).toHaveBeenCalledTimes(1);
    });
  });

  describe('rewind', () => {
    let t;

    beforeEach(() => {
      class Fork {
        getNextBranch() {
          return 'branchA';
        }
      }

      t = new Tree({
        config,
        forks: {
          forkOne: {
            getNextBranch: () => {
              return 'buyer';
            },
          }
        },
        render: () => {}
      });
    });

    test('Should rewind to the first step if no argument is provided', () => {
      t.stepForward();
      t.stepForward();
      expect(t.getTreeState().currentStepUniqueId).toBe('congratsBuyer3');
      t.rewind();
      expect(t.getTreeState().currentStepUniqueId).toBe('createAccount1');
    });
    test('Should rewind across forks to `toStepId`', () => {
      t.stepForward();
      t.stepForward();
      expect(t.getTreeState().currentStepUniqueId).toBe('congratsBuyer3');
      t.rewind('stepTwo');
      expect(t.getTreeState().currentStepUniqueId).toBe('stepTwo2');
    });
    test('Should disregard an invalid `toStep`', () => {
      t.rewind('foofoolala');
      expect(t.getTreeState().currentStepUniqueId).toBe('createAccount1');
    });
    test('Should call `_onStep` on the rewind step destination', () => {
      t.stepForward();
      t.stepForward();
      expect(t.getTreeState().currentStepUniqueId).toBe('congratsBuyer3');
      t._onStep = jest.fn();
      t.rewind('createAccount');
      expect(t._onStep).toHaveBeenCalledTimes(1);
    });
    test('Should call `_onStep` on the rewind step destination when called without argument', () => {
      t.stepForward();
      t.stepForward();
      expect(t.getTreeState().currentStepUniqueId).toBe('congratsBuyer3');
      t._onStep = jest.fn();
      t.rewind();
      expect(t._onStep).toHaveBeenCalledTimes(1);
    });
    test('Should rewind correctly after `fastForward()`', () => {
      t.fastForward('congratsBuyer');
      expect(t.getTreeState().currentStepUniqueId).toBe('congratsBuyer3');
      t._onStep = jest.fn();
      t.rewind('stepTwo');
      expect(t.getTreeState().currentStepUniqueId).toBe('stepTwo2');
      expect(t._onStep).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStepByUniqueId', () => {
    let t;

    beforeEach(() => {
      class Fork {
        getNextBranch() {
          return 'branchA';
        }
      }

      t = new Tree({
        config,
        forks: {
          forkOne: {
            getNextBranch: () => {
              return 'buyer';
            },
          }
        },
        render: () => {}
      });
    });

    test('Should return a step matching `uniqueId`', () => {
      t.config[1].foo = 'bar';
      expect(t.getStepByUniqueId('stepTwo2').foo).toBe('bar');
    });

    test('Should throw if passed an invalid `uniqueId`', () => {
      expect(() => {
        t.getStepByUniqueId();
      }).toThrow();
    });

    test('Should return `undefined` if a step can\'t be found matching `uniqueId`', () => {
      expect(t.getStepByUniqueId('foofoolala')).toBeUndefined();
    });
  });

  describe('getNextStepUniqueId', () => {
    let t;

    beforeEach(() => {
      class Fork {
        getNextBranch() {
          return 'branchA';
        }
      }

      t = new Tree({
        config,
        forks: {
          forkOne: {
            getNextBranch: () => {
              return 'buyer';
            },
          }
        },
        render: () => {}
      });
    });

    test('Should throw if called without `currentStepUniqueId`', () => {
      expect(() => {
        t.getNextStepUniqueId();
      }).toThrow();
    });

    test('Should return `\'\'` when called with the `currentStepUniqueId` of a terminal step (leaf)', () => {
      expect(t.getNextStepUniqueId('congratsBuyer3')).toBe('');
    });

    test('Should return the next step in a branch if `currentStepUniqueId` is not a terminal step (leaf)', () => {
      expect(t.getNextStepUniqueId('createAccount1')).toBe('stepTwo2');
    });

    test('Should return the first step in the next branch if next step is a fork', () => {
      expect(t.getNextStepUniqueId('stepTwo2')).toBe('congratsBuyer3');
    });

    test('Should throw if an unexpected error occurs during step mapping', () => {
      delete t.config[2].branches;
      expect(() => {
        t.getNextStepUniqueId('stepTwo2');
      }).toThrow();
    });
  });

  describe('getTreeState  ', () => {
    test('Should return `_treeState`', () => {
      class Fork {
        getNextBranch() {
          return 'branchA';
        }
      }

      const t = new Tree({
        config,
        forks: {
          forkOne: {
            getNextBranch: () => {
              return 'buyer';
            },
          }
        },
        render: () => {}
      });

      expect(t.getTreeState()).toEqual(t._treeState);
    });
  });
});

describe('multiStepUi', () => {
  test('Should return a new instance of Tree based on `props` argument', () => {
    const t = new Tree({
      config,
      forks: {
        forkOne: {
          getNextBranch: () => {}
        }
      },
      render: () => {}
    });
    const msuFlow = multiStepUi({
      config,
      forks: {
        forkOne: {
          getNextBranch: () => {}
        }
      },
      render: () => {}
    });

    expect(msuFlow.getTreeState().currentStepUniqueId)
      .toEqual(t.getTreeState().currentStepUniqueId);
  });
});
