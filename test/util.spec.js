import util from '../src/util';

const _ = require('lodash');

const originalConfig = require('./data/config-01.json');

let config;

beforeAll(() => {
  // Clone config to avoid mutating the original
  config = _.cloneDeep(originalConfig);
});

describe('mapEachStep', () => {
  test('Should throw when provided with incorrect arguments', () => {
    expect(() => {
      util.mapEachStep();
    }).toThrow();

    expect(() => {
      util.mapEachStep(config);
    }).toThrow();

    expect(() => {
      util.mapEachStep(() => {});
    }).toThrow();
  });
  test('Should update a property on each step despite nesting depth', () => {
    const result = util.mapEachStep(config, (step, index) => {
      step.uniqueId = index + '';
    });

    expect(result[1].uniqueId).toBe('1');

    expect(result[2].branches.branchB[2].branches.branchD[0].uniqueId).toBe('6');
  });
});

describe('indexOfStepInBranch', () => {
  test('Should throw when provided with incorrect arguments', () => {
    // It works by comparing uniqueId which needs to be set first
    const result = util.mapEachStep(config, (step, index) => {
      step.uniqueId = index + '';
    });

    expect(() => {
      util.indexOfStepInBranch();
    }).toThrow();

    expect(() => {
      util.indexOfStepInBranch(result);
    }).toThrow();

    expect(() => {
      util.indexOfStepInBranch(result[1]);
    }).toThrow();
  });
  test('Should return the correct index of a step in a branch', () => {
    const result = util.mapEachStep(config, (step, index) => {
      step.uniqueId = index + '';
    });

    expect(util.indexOfStepInBranch(result, result[1])).toBe(1);

    expect(util.indexOfStepInBranch(
      result[2].branches.branchB[2].branches.branchD,
      result[2].branches.branchB[2].branches.branchD[0]
    )).toBe(0);
  });
});
